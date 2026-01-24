import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .order('term_ru', { ascending: true })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching glossary terms:', error)
    return NextResponse.json({ error: 'Failed to fetch glossary terms' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('glossary_terms')
      .insert(body as never)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (error: unknown) {
    console.error('Error creating glossary term:', error)
    const message = error instanceof Error ? error.message : 'Failed to create glossary term'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
