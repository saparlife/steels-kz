'use client'

import { useEffect, useState } from 'react'
import { Inbox, Phone, Mail, Building2, Calendar, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'

interface Lead {
  id: string
  type: string
  name: string
  phone: string
  email: string | null
  company: string | null
  city: string | null
  message: string | null
  source_page: string | null
  status: string
  created_at: string
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const fetchLeads = async () => {
    try {
      setLoading(true)
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const response = await fetch(`/api/leads${params}`)
      const result = await response.json()
      if (result.data) {
        setLeads(result.data)
      }
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeads()
  }, [statusFilter])

  const updateStatus = async (leadId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setLeads(leads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ))
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
            <Clock className="w-3 h-3" /> Новая
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" /> В работе
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" /> Завершена
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" /> Отменена
          </span>
        )
      default:
        return (
          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {status}
          </span>
        )
    }
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      price_request: 'Узнать цену',
      order: 'Заказ',
      wholesale: 'Опт',
      business: 'Для бизнеса',
      partner: 'Партнерство',
      contact: 'Обратная связь',
    }
    return types[type] || type
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Inbox className="w-8 h-8 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-900">Заявки</h1>
          <span className="px-2 py-1 text-sm bg-orange-100 text-orange-700 rounded-full">
            {leads.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="in_progress">В работе</option>
            <option value="completed">Завершенные</option>
            <option value="cancelled">Отмененные</option>
          </select>
          <button
            onClick={fetchLeads}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Обновить
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Загрузка...</div>
        ) : leads.length === 0 ? (
          <div className="p-8 text-center">
            <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Нет заявок</h3>
            <p className="text-gray-500">
              Здесь будут отображаться заявки с сайта
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Дата
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Тип
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Контакт
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Сообщение
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Статус
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(lead.created_at).toLocaleDateString('ru-RU')}
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(lead.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {getTypeLabel(lead.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{lead.name}</div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-orange-500">
                        <Phone className="w-3 h-3" /> {lead.phone}
                      </a>
                    </div>
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500">
                        <Mail className="w-3 h-3" /> {lead.email}
                      </a>
                    )}
                    {lead.company && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Building2 className="w-3 h-3" /> {lead.company}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs">
                    <div className="truncate">{lead.message || '—'}</div>
                    {lead.source_page && (
                      <div className="text-xs text-gray-400 truncate">
                        Источник: {lead.source_page}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                      className="text-xs px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="new">Новая</option>
                      <option value="in_progress">В работе</option>
                      <option value="completed">Завершена</option>
                      <option value="cancelled">Отменена</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Заявка #{selectedLead.id.slice(0, 8)}</h2>
                <button onClick={() => setSelectedLead(null)} className="text-gray-400 hover:text-gray-600">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Статус:</span>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => updateStatus(selectedLead.id, e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Завершена</option>
                    <option value="cancelled">Отменена</option>
                  </select>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Контактные данные</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Имя:</span> {selectedLead.name}</div>
                    <div>
                      <span className="text-gray-500">Телефон:</span>{' '}
                      <a href={`tel:${selectedLead.phone}`} className="text-orange-500 hover:underline">
                        {selectedLead.phone}
                      </a>
                    </div>
                    {selectedLead.email && (
                      <div>
                        <span className="text-gray-500">Email:</span>{' '}
                        <a href={`mailto:${selectedLead.email}`} className="text-orange-500 hover:underline">
                          {selectedLead.email}
                        </a>
                      </div>
                    )}
                    {selectedLead.company && (
                      <div><span className="text-gray-500">Компания:</span> {selectedLead.company}</div>
                    )}
                    {selectedLead.city && (
                      <div><span className="text-gray-500">Город:</span> {selectedLead.city}</div>
                    )}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-2">Детали</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-500">Тип:</span> {getTypeLabel(selectedLead.type)}</div>
                    <div>
                      <span className="text-gray-500">Дата:</span>{' '}
                      {new Date(selectedLead.created_at).toLocaleString('ru-RU')}
                    </div>
                    {selectedLead.source_page && (
                      <div><span className="text-gray-500">Источник:</span> {selectedLead.source_page}</div>
                    )}
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="border-t pt-4">
                    <h3 className="font-medium mb-2">Сообщение</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded">
                      {selectedLead.message}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
