import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from('steel_grades')
      .select('*')
      .order('name', { ascending: true })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching steel grades:', error)
    return NextResponse.json({ error: 'Failed to fetch steel grades' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('steel_grades')
      .insert(body as never)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating steel grade:', error)
    const message = error instanceof Error ? error.message : 'Failed to create steel grade'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
