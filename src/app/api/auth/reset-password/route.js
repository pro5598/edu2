import { NextResponse } from 'next/server';
import { User } from '../../../../models';

const validatePassword = (password) => {
  return password.length >= 8 && 
         /[A-Z]/.test(password) && 
         /[a-z]/.test(password) && 
         /\d/.test(password) && 
         /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

export async function POST(request) {
  try {
    const { token, password, confirmPassword } = await request.json();

    if (!token || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Token, password, and confirm password are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character' },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: new Date()
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    await user.update({
      password: password,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return NextResponse.json({
      message: 'Password reset successful. You can now log in with your new password.',
      redirectPath: user.role === 'admin' ? '/login/adminlogin' : 
                   user.role === 'instructor' ? '/login/instructorlogin' : '/login'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}