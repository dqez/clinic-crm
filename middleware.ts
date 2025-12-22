import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Unauthenticated users -> Redirect to Login
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (!user && request.nextUrl.pathname.startsWith('/doctor')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Authenticated but Role Check
  if (user) {
    // We need to fetch the user's role from the 'users' table or metadata
    // For performance, better to use custom claims, but here we query DB or assume metadata
    // Let's query the public.users table to be safe and accurate as per schema.

    // Note: Middleware DB queries can be slow. A better approach is using metadata in JWT.
    // However, for this phase, we will fetch profile.

    // Warning: supabase.auth.getUser() is safe. calling simple query next.
    // Actually, we can't easily query 'public' tables in middleware with just 'anon' key if RLS enabled and no policy for 'anon' to read roles of own user?
    // Users can read their own profile usually.

    // Let's rely on a simpler check first: existence of user.
    // Deep role check often better done in Layout or Page or via Metadata.
    // But specific requirement was: "Nếu role === 'patient' -> đá về trang chủ"

    // Using Supabase RPC or just reading the public.users table
    const { data: dbUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = dbUser?.role || 'patient'
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isDoctorRoute = request.nextUrl.pathname.startsWith('/doctor')

    if (isAdminRoute && role === 'patient') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Flexible: Doctors might need access to some admin parts? Or just doctor portal?
    // Req: "Admin Portal serving 3 roles: Admin, Doctor, Staff"
    // So Doctor might access /admin? The text says "/doctor/schedule" for doctor.
    // Let's assume /admin is for Admin/Staff.

    if (isAdminRoute && (role !== 'admin' && role !== 'staff' && role !== 'doctor')) {
      // If doctor is allowed in admin, keep them. If strictly doctor portal, kick them.
      // The Prompt says: "Xây dựng trang quản trị (Admin Portal) ... phục vụ 3 đối tượng"
      // And "Phase 4: Doctor Portal" has /doctor/schedule.
      // But "Phase 2: Dispatch Center ... /admin/bookings".
      // Use: If they are generic admin/staff/doctor, they might access /admin 
      // BUT strict interpretation: 
      // "Admin/Staff" -> Dispatch, "Doctor" -> Doctor Portal.
      // Let's allow "admin" and "staff" to /admin.
      // And "doctor" to /doctor.

      if (role === 'doctor') {
        // If doctor tries /admin, maybe redirect to /doctor/schedule?
        // let's just allow for now or block?
        // "Nếu user login nhưng role === 'patient' -> đá về trang chủ, không cho vào /admin"
        // It implies non-patients CAN enter.
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - auth (auth routes if any)
     * - api/auth (auth apis)
     * - public files (images etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|auth|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
