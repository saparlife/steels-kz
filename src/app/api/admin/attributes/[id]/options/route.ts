import { createServiceClient } from '@/lib/supabase/server'
import type { AttributeDefinition } from '@/types/database'
import { NextResponse } from 'next/server'

// POST - add new option to attribute
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { option } = body

  if (!option || typeof option !== 'string') {
    return NextResponse.json({ error: 'Option is required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  // Get current options
  const { data, error: fetchError } = await supabase
    .from('attribute_definitions')
    .select('options')
    .eq('id', id)
    .single()

  if (fetchError || !data) {
    return NextResponse.json({ error: fetchError?.message || 'Attribute not found' }, { status: 500 })
  }

  const attr = data as Pick<AttributeDefinition, 'options'>

  // Add new option
  const currentOptions = attr.options || []
  if (currentOptions.includes(option)) {
    return NextResponse.json({ error: 'Option already exists' }, { status: 400 })
  }

  const newOptions = [...currentOptions, option]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateError } = await (supabase as any)
    .from('attribute_definitions')
    .update({ options: newOptions })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({ options: newOptions })
}
