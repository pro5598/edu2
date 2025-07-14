import { NextResponse } from 'next/server';
import { Cart } from '../../../../models';
import { authenticateToken } from '../../../../middleware/auth';

export async function DELETE(request, { params }) {
  try {
    const authResult = await new Promise((resolve) => {
      authenticateToken(request, NextResponse, (result) => {
        resolve(result);
      });
    });

    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = await params;

    const cartItem = await Cart.findOne({
      where: {
        id,
        studentId: request.user.id
      }
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      );
    }

    await cartItem.destroy();

    return NextResponse.json({
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}