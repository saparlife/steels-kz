'use client'

import { useEffect, useRef, useState } from 'react'

interface StatItem {
  value: number
  suffix: string
  label: string
}

function useCountUp(target: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return

    let startTime: number | null = null
    let rafId: number

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))

      if (progress < 1) {
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [target, duration, start])

  return count
}

function StatCard({ item, started }: { item: StatItem; started: boolean }) {
  const count = useCountUp(item.value, 2000, started)

  return (
    <div
      className={`transition-all duration-700 ${
        started ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="text-3xl md:text-4xl font-bold">
        {count.toLocaleString('ru-RU')}{item.suffix}
      </div>
      <div className="text-orange-100 mt-1">{item.label}</div>
    </div>
  )
}

interface StatsCounterProps {
  items: StatItem[]
}

export function StatsCounter({ items }: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-orange-500 text-white py-10">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((item, i) => (
            <div key={i} style={{ transitionDelay: `${i * 150}ms` }}>
              <StatCard item={item} started={started} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
