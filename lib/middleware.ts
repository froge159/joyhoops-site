import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const redirect = (to: string) => {
    const url = request.nextUrl.clone()
    url.pathname = to
    return NextResponse.redirect(url)
  }

  const protectedRoutes = ['/user-home', '/admin']
  const isProtected = protectedRoutes.some((r) => path.startsWith(r))
  const isAPI = path.startsWith('/api/')
  const isAdmin = user?.email === process.env.ADMIN_EMAIL

  const pendingEmail = request.cookies.get('pendingEmail')
  const changingPassword = request.cookies.get('isChangingPassword')

  // 1. API passthrough
  if (isAPI) return supabaseResponse

  // 2. Admin-only area protection
  if (path.startsWith('/admin')) {
    if (!user) return redirect('/')
    if (!isAdmin) return redirect('/user-home')
  }

  // 3. If user is not logged in, block ALL protected routes
  if (!user && isProtected) {
    return redirect('/')
  }

  // 4. Password reset route rules
  if (path === '/set-password') {
    // only allow if cookie explicitly allows it
    if (!changingPassword) {
      return redirect('/')
    }
  }

  // 5. Email verification requirements
  if (user && pendingEmail) {
    // lock down ALL protected user areas until verified
    if (path !== '/email-verify' && path !== '/set-password') {
      return redirect('/email-verify')
    }
  }

  // 6. Logged-in user: restrict access to non-user pages (except allowed)
  if (user && !isAdmin && !pendingEmail && !changingPassword) {
    const allowed = ['/user-home', '/email-verify', '/set-password']
    const isAllowed = allowed.some((p) => path.startsWith(p))

    if (!isAllowed) {
      return redirect('/user-home')
    }
  }

  if (user && path === '/') {
    return redirect('/user-home')
  }

  return supabaseResponse
}
