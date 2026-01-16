import { createServiceClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email и пароль обязательны' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    const passwordHash = hashPassword(password)
    if (admin.password_hash !== passwordHash) {
      return NextResponse.json(
        { error: 'Неверный email или пароль' },
        { status: 401 }
      )
    }

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id)

    // Create session
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const cookieStore = await cookies()

    cookieStore.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return NextResponse.json({
      success: true,
      user: { id: admin.id, email: admin.email, name: admin.name },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Ошибка сервера' },
      { status: 500 }
    )
  }
}
