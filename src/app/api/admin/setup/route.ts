import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// POST - run setup/migrations
export async function POST() {
  const supabase = await createServiceClient()

  // Add options column if not exists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).rpc('exec_sql', {
    sql: `ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS options jsonb DEFAULT '[]'::jsonb;`
  })

  if (error) {
    // Try direct query if rpc doesn't work
    console.error('RPC error:', error)
    return NextResponse.json({
      message: 'Please run this SQL manually in Supabase Dashboard:',
      sql: "ALTER TABLE attribute_definitions ADD COLUMN IF NOT EXISTS options jsonb DEFAULT '[]'::jsonb;"
    })
  }

  return NextResponse.json({ success: true })
}
