import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

type LeadInsert = Database['public']['Tables']['leads']['Insert']

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const supabase = await createServiceClient()

    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching leads:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const {
      type,
      name,
      phone,
      email,
      company,
      city,
      message,
      product_id,
      category_id,
      source_page,
      utm_source,
      utm_medium,
      utm_campaign,
    } = body

    if (!type || !name || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields: type, name, phone' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    const leadData: LeadInsert = {
      type,
      name,
      phone,
      email: email || null,
      company: company || null,
      city: city || null,
      message: message || null,
      product_id: product_id || null,
      category_id: category_id || null,
      source_page: source_page || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      status: 'new',
    }

    const { data, error } = await supabase
      .from('leads')
      .insert(leadData as never)
      .select()
      .single()

    if (error) {
      console.error('Error creating lead:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Error processing lead request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
