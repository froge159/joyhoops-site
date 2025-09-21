import { createServerClient } from '@supabase/ssr'
import next from 'next';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathName = request.nextUrl.pathname
  const protectedRoutes = ['/user-home', '/admin', '/set-password'];
  const isProtectedRoute = protectedRoutes.some((route) => pathName.startsWith(route));
  const isAdmin = user?.email === process.env.ADMIN_EMAIL;
  const isAPIRoute = pathName.startsWith('/api/');

  if (isAPIRoute) {
    return supabaseResponse;
  }

  if (isAdmin) {
    const redirectUrl = request.nextUrl.clone();
    if (pathName !== '/admin') {
      redirectUrl.pathname = '/admin';
      console.log("admin user tried to access non-admin page, redirecting to admin");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (!user && !request.cookies.get('pendingEmail')) {
    if (isProtectedRoute || pathName === '/email-verify') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      console.log("user tried to access protected route, redirecting to home");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (!request.cookies.get('isChangingPassword')) {
    if (pathName === '/set-password') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      console.log("user tried to access password reset route without changing password, redirecting to home");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (!user && request.cookies.get('pendingEmail')) {
    if (isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/email-verify';
      console.log("user not verified, redirecting to email verify page");
      return NextResponse.redirect(redirectUrl);
    }
  }
  
  if (user && !isAdmin) {
    if (pathName.substring(0, 10) !== '/user-home' && !request.cookies.get("isChangingPassword")) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/user-home';
      console.log("logged in user tried to access restricted page, redirecting to user home" + pathName);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}