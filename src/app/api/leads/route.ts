import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'

type LeadInsert = Database['public']['Tables']['leads']['Insert']

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!

async function sendTelegramNotification(lead: {
  type: string
  name: string
  phone: string
  email?: string | null
  company?: string | null
  message?: string | null
  source_page?: string | null
  product_name?: string | null
}) {
  const typeLabels: Record<string, string> = {
    price_request: '💰 Узнать цену',
    order: '🛒 Заказ',
    wholesale: '📦 Оптовый запрос',
    business: '🏢 Для бизнеса',
    partner: '🤝 Партнёрство',
    callback: '📞 Обратный звонок',
  }

  const typeLabel = typeLabels[lead.type] || lead.type

  let text = `<b>${typeLabel}</b>\n\n`
  text += `👤 <b>Имя:</b> ${lead.name}\n`
  text += `📱 <b>Телефон:</b> ${lead.phone}\n`
  if (lead.email) text += `📧 <b>Email:</b> ${lead.email}\n`
  if (lead.company) text += `🏢 <b>Компания:</b> ${lead.company}\n`
  if (lead.product_name) text += `📦 <b>Товар:</b> ${lead.product_name}\n`
  if (lead.message) text += `💬 <b>Сообщение:</b> ${lead.message}\n`
  if (lead.source_page) text += `\n🔗 <a href="https://temir-service.kz${lead.source_page}">Страница заявки</a>`

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
  } catch (err) {
    console.error('Failed to send Telegram notification:', err)
  }
}

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

    // Get product name if product_id exists
    let productName: string | null = null
    if (product_id) {
      const { data: product } = await supabase
        .from('products')
        .select('name_ru')
        .eq('id', product_id)
        .single()
      productName = (product as { name_ru: string } | null)?.name_ru || null
    }

    // Send Telegram notification
    await sendTelegramNotification({
      type,
      name,
      phone,
      email,
      company,
      message,
      source_page,
      product_name: productName,
    })

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Error processing lead request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
