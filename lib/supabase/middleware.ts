import { createServerClient } from '@supabase/ssr'
import next from 'next';
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
  const isEmailVerifyPage = pathName.startsWith('/email-verify');
  const protectedRoutes = ['/user-home', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) => pathName.startsWith(route));
  const isHomePage = pathName === '/';

  if (!user && !request.cookies.get('pendingEmail')) {
    if (isProtectedRoute || pathName === '/email-verify') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/';
      console.log("user tried to access protected route, redirecting to home");
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (!user && request.cookies.get('pendingEmail')) {
    if (isProtectedRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/email-verify';
      console.log("user not verified, redirecting to email verify page" + request.cookies.get('pendingEmail')!.value);
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (user) {
    if (pathName === '/' || pathName === '/email-verify' || pathName === '/register' || pathName === '/login') {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/user-home';
      console.log("logged in user tried to access restricted page, redirecting to user home");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}