'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface HeroSectionProps {
  title: string
  subtitle: string
}

export function HeroSection({ title, subtitle }: HeroSectionProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 md:py-28 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/4 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl">
          <h1
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {title}
          </h1>
          <p
            className={`text-xl md:text-2xl text-gray-300 mb-10 transition-all duration-700 delay-200 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {subtitle}
          </p>
          <div
            className={`flex flex-wrap gap-4 transition-all duration-700 delay-[400ms] ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link
              href="/katalog"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg bg-orange-500 text-white hover:bg-orange-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-orange-500/25"
            >
              Перейти в каталог
            </Link>
            <Link
              href="/uznat-cenu"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-lg border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 hover:scale-105 transition-all duration-300"
            >
              Получить консультацию
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
