import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = await createServiceClient()

    const updateData: Record<string, unknown> = {}

    if (body.status) {
      updateData.status = body.status
      if (body.status === 'completed' || body.status === 'cancelled') {
        updateData.processed_at = new Date().toISOString()
      }
    }

    if (body.manager_notes !== undefined) {
      updateData.manager_notes = body.manager_notes
    }

    const { data, error } = await supabase
      .from('leads')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error: unknown) {
    console.error('Error updating lead:', error)
    const message = error instanceof Error ? error.message : 'Failed to update lead'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServiceClient()

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (error: unknown) {
    console.error('Error fetching lead:', error)
    const message = error instanceof Error ? error.message : 'Failed to fetch lead'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
