import { NextResponse } from 'next/server';
import { Payment, Notification } from '../../../../models/index.js';
import { requireAdmin } from '../../../../middleware/auth.js';
import connectDB from '../../../../lib/database.js';

export async function GET(request) {
  try {
    await connectDB();
    
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('student', 'firstName lastName email')
      .populate('course', 'title')
      .populate('instructor', 'firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPayments = await Payment.countDocuments(query);

    const stats = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$adminRevenue' },
          totalInstructorEarnings: { $sum: '$instructorAmount' },
          totalTransactions: { $sum: 1 },
          completedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          pendingTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          failedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] }
          },
          refundedTransactions: {
            $sum: { $cond: [{ $eq: ['$status', 'refunded'] }, 1, 0] }
          }
        }
      }
    ]);

    const paymentStats = stats[0] || {
      totalRevenue: 0,
      totalInstructorEarnings: 0,
      totalTransactions: 0,
      completedTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      refundedTransactions: 0
    };

    const transformedPayments = payments.map(payment => ({
      id: payment.transactionId,
      studentName: payment.student ? `${payment.student.firstName} ${payment.student.lastName}` : 'Unknown',
      studentEmail: payment.student?.email || 'Unknown',
      courseName: payment.course?.title || 'Unknown Course',
      instructorName: payment.instructor ? `${payment.instructor.firstName} ${payment.instructor.lastName}` : 'Unknown',
      amount: payment.totalAmount,
      instructorAmount: payment.instructorAmount,
      adminRevenue: payment.adminRevenue,
      status: payment.status,
      paymentMethod: payment.paymentMethod?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
      paymentGateway: payment.paymentGateway?.charAt(0).toUpperCase() + payment.paymentGateway?.slice(1) || 'Unknown',
      createdAt: payment.createdAt,
      processedAt: payment.processedAt,
      refundAmount: payment.refundAmount || 0,
      failureReason: payment.failureReason
    }));

    return NextResponse.json({
      payments: transformedPayments,
      stats: paymentStats,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPayments / limit),
        totalPayments,
        hasNext: page < Math.ceil(totalPayments / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    
    const authResult = await requireAdmin(request);
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { transactionId, action, reason } = body;

    if (!transactionId || !action) {
      return NextResponse.json({ error: 'Transaction ID and action are required' }, { status: 400 });
    }

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    let updatedPayment;
    
    switch (action) {
      case 'complete':
        if (payment.status !== 'pending') {
          return NextResponse.json({ error: 'Only pending payments can be completed' }, { status: 400 });
        }
        updatedPayment = await payment.markAsCompleted();
        
        await updatedPayment.populate([
          { path: 'student', select: 'firstName lastName email' },
          { path: 'course', select: 'title' },
          { path: 'instructor', select: 'firstName lastName email' }
        ]);
        
        await Notification.createPaymentNotification({
          paymentId: updatedPayment._id,
          courseId: updatedPayment.course._id,
          courseName: updatedPayment.course.title,
          studentId: updatedPayment.student._id,
          studentName: `${updatedPayment.student.firstName} ${updatedPayment.student.lastName}`,
          instructorId: updatedPayment.instructor._id,
          instructorName: `${updatedPayment.instructor.firstName} ${updatedPayment.instructor.lastName}`,
          commissionAmount: updatedPayment.adminRevenue,
          totalAmount: updatedPayment.totalAmount
        });
        break;
        
      case 'fail':
        if (payment.status !== 'pending') {
          return NextResponse.json({ error: 'Only pending payments can be failed' }, { status: 400 });
        }
        updatedPayment = await payment.markAsFailed(reason);
        break;
        
      case 'refund':
        if (payment.status !== 'completed') {
          return NextResponse.json({ error: 'Only completed payments can be refunded' }, { status: 400 });
        }
        updatedPayment = await payment.processRefund(null, reason);
        break;
        
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({
      message: `Payment ${action}d successfully`,
      payment: {
        id: updatedPayment.transactionId,
        status: updatedPayment.status,
        processedAt: updatedPayment.processedAt,
        refundAmount: updatedPayment.refundAmount,
        failureReason: updatedPayment.failureReason
      }
    });

  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Failed to update payment' },
      { status: 500 }
    );
  }
}