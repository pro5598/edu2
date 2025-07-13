import { NextResponse } from 'next/server';

const publicRoutes = [
  '/',
  '/login',
  '/login/instructorlogin',
  '/login/adminlogin',
  '/register',
  '/register/instructor',
  '/register/student'
];

const protectedRoutes = {
  admin: ['/admin'],
  instructor: ['/instructor'],
  student: ['/student']
};

const loginRoutes = [
  '/login',
  '/login/instructorlogin', 
  '/login/adminlogin'
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const isAuthenticated = !!token;
  const tokenRole = userRole;

  if (isAuthenticated && loginRoutes.some(route => pathname === route)) {
    const redirectPath = tokenRole === 'admin' ? '/admin/dashboard' : 
                        tokenRole === 'instructor' ? '/instructor/dashboard' : 
                        '/student/dashboard';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = pathname.startsWith('/admin') ? '/login/adminlogin' :
                    pathname.startsWith('/instructor') ? '/login/instructorlogin' :
                    '/login';
    return NextResponse.redirect(new URL(loginUrl, request.url));
  }

  for (const [role, routes] of Object.entries(protectedRoutes)) {
    if (routes.some(route => pathname.startsWith(route))) {
      if (tokenRole !== role) {
        const redirectPath = tokenRole === 'admin' ? '/admin/dashboard' : 
                            tokenRole === 'instructor' ? '/instructor/dashboard' : 
                            '/login';
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      break;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};