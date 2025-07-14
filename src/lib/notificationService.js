import connectDB from './database';
import Notification from '../models/Notification';

export class NotificationService {
  static async createNotification({
    title,
    message,
    type = 'info',
    recipient,
    metadata = {}
  }) {
    try {
      await connectDB();
      
      const notification = new Notification({
        title,
        message,
        type,
        recipient,
        status: 'sent',
        sentDate: new Date(),
        metadata
      });
      
      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  static async createEnrollmentNotification(enrollmentData) {
    return await this.createNotification({
      title: 'New Student Enrollment',
      message: `${enrollmentData.studentName} enrolled in your ${enrollmentData.courseName} course`,
      type: 'enrollment',
      recipient: enrollmentData.instructorId,
      metadata: {
        courseId: enrollmentData.courseId,
        studentId: enrollmentData.studentId,
        instructorId: enrollmentData.instructorId
      }
    });
  }

  static async createPaymentNotification(paymentData) {
    return await this.createNotification({
      title: 'Course Purchase Confirmation',
      message: `Your payment for "${paymentData.courseName}" has been processed successfully. Amount: $${paymentData.amount.toFixed(2)}`,
      type: 'payment',
      recipient: paymentData.studentId,
      metadata: {
        paymentId: paymentData.paymentId,
        courseId: paymentData.courseId,
        studentId: paymentData.studentId,
        totalAmount: paymentData.amount
      }
    });
  }

  static async createReviewNotification(reviewData) {
    return await this.createNotification({
      title: 'New Course Review',
      message: `${reviewData.studentName} left a ${reviewData.rating}-star review for ${reviewData.courseName}`,
      type: 'review',
      recipient: reviewData.instructorId,
      metadata: {
        courseId: reviewData.courseId,
        studentId: reviewData.studentId,
        instructorId: reviewData.instructorId
      }
    });
  }

  static async createAssignmentNotification(assignmentData) {
    return await this.createNotification({
      title: 'New Assignment Available',
      message: `A new assignment "${assignmentData.title}" has been posted for ${assignmentData.courseName}`,
      type: 'assignment',
      recipient: assignmentData.studentId,
      metadata: {
        courseId: assignmentData.courseId,
        studentId: assignmentData.studentId,
        instructorId: assignmentData.instructorId
      }
    });
  }

  static async createSubmissionNotification(submissionData) {
    return await this.createNotification({
      title: 'Assignment Submitted',
      message: `${submissionData.studentName} submitted the ${submissionData.assignmentTitle} assignment`,
      type: 'submission',
      recipient: submissionData.instructorId,
      metadata: {
        courseId: submissionData.courseId,
        studentId: submissionData.studentId,
        instructorId: submissionData.instructorId
      }
    });
  }

  static async createPromotionNotification(promotionData) {
    return await this.createNotification({
      title: promotionData.title || 'Special Offer',
      message: promotionData.message,
      type: 'promotion',
      recipient: promotionData.studentId,
      metadata: {
        courseId: promotionData.courseId,
        discountPercentage: promotionData.discountPercentage
      }
    });
  }

  static async getUnreadCount(userId) {
    try {
      await connectDB();
      return await Notification.countDocuments({
        recipient: userId,
        read: false
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  static async markAllAsRead(userId) {
    try {
      await connectDB();
      const result = await Notification.updateMany(
        { 
          recipient: userId,
          read: false
        },
        { 
          read: true,
          readAt: new Date()
        }
      );
      return result.modifiedCount;
    } catch (error) {
      console.error('Error marking all as read:', error);
      throw error;
    }
  }

  static async deleteAllForUser(userId) {
    try {
      await connectDB();
      const result = await Notification.deleteMany({ recipient: userId });
      return result.deletedCount;
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      throw error;
    }
  }
}

export default NotificationService;