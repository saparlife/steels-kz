import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { createClient } from '@/lib/supabase/server'
import type { GlossaryTerm } from '@/types/database'
import { BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Глоссарий металлопроката - Термины и определения',
  description: 'Словарь терминов металлопроката. Определения, расшифровки аббревиатур, профессиональная терминология.',
}

export default async function GlossaryPage() {
  const supabase = await createClient()

  const { data: terms } = await supabase
    .from('glossary_terms')
    .select('*')
    .eq('is_active', true)
    .order('term_ru', { ascending: true }) as { data: GlossaryTerm[] | null }

  // Group by first letter
  const grouped: Record<string, typeof terms> = {}
  terms?.forEach((term) => {
    const letter = term.term_ru.charAt(0).toUpperCase()
    if (!grouped[letter]) {
      grouped[letter] = []
    }
    grouped[letter]?.push(term)
  })

  const letters = Object.keys(grouped).sort()

  return (
    <div>
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <Breadcrumbs
            items={[{ label: 'Глоссарий' }]}
          />
        </div>
      </div>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Глоссарий
            </h1>
            <p className="text-lg text-gray-600">
              Словарь терминов и определений, используемых в металлопрокате.
              Расшифровки аббревиатур, профессиональная терминология.
            </p>
          </div>

          {!terms?.length ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Глоссарий наполняется
              </h2>
              <p className="text-gray-600">
                Мы работаем над добавлением терминов
              </p>
            </div>
          ) : (
            <>
              {/* Alphabet navigation */}
              <div className="flex flex-wrap gap-2 mb-8">
                {letters.map((letter) => (
                  <a
                    key={letter}
                    href={`#letter-${letter}`}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg font-medium transition-colors"
                  >
                    {letter}
                  </a>
                ))}
              </div>

              {/* Terms by letter */}
              <div className="space-y-8">
                {letters.map((letter) => (
                  <div key={letter} id={`letter-${letter}`}>
                    <h2 className="text-2xl font-bold text-orange-500 mb-4 border-b border-gray-200 pb-2">
                      {letter}
                    </h2>
                    <div className="space-y-4">
                      {grouped[letter]?.map((term) => (
                        <Link
                          key={term.id}
                          href={`/glossary/${term.slug}`}
                          className="block p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow group"
                        >
                          <h3 className="font-semibold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">
                            {term.term_ru}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {term.definition_ru}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
