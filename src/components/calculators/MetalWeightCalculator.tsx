'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

const profiles = [
  { value: 'sheet', label: 'Лист', unit: 'мм' },
  { value: 'round', label: 'Круг', unit: 'мм' },
  { value: 'square', label: 'Квадрат', unit: 'мм' },
  { value: 'pipe_round', label: 'Труба круглая', unit: 'мм' },
  { value: 'pipe_square', label: 'Труба профильная', unit: 'мм' },
  { value: 'angle', label: 'Уголок', unit: 'мм' },
  { value: 'channel', label: 'Швеллер', unit: '№' },
  { value: 'beam', label: 'Балка', unit: '№' },
  { value: 'rebar', label: 'Арматура', unit: 'мм' },
]

const STEEL_DENSITY = 7850 // kg/m³

export function MetalWeightCalculator() {
  const [profile, setProfile] = useState('sheet')
  const [dimensions, setDimensions] = useState({
    thickness: '',
    width: '',
    length: '',
    diameter: '',
    wallThickness: '',
    sideA: '',
    sideB: '',
  })
  const [quantity, setQuantity] = useState('1')
  const [result, setResult] = useState<{ weight: number; total: number } | null>(null)

  const calculateWeight = () => {
    const length = parseFloat(dimensions.length) || 1000 // mm to m
    const qty = parseFloat(quantity) || 1
    let weight = 0

    switch (profile) {
      case 'sheet': {
        const thickness = parseFloat(dimensions.thickness) / 1000 // mm to m
        const width = parseFloat(dimensions.width) / 1000 // mm to m
        const len = length / 1000 // mm to m
        weight = thickness * width * len * STEEL_DENSITY
        break
      }
      case 'round': {
        const diameter = parseFloat(dimensions.diameter) / 1000 // mm to m
        const len = length / 1000
        weight = Math.PI * Math.pow(diameter / 2, 2) * len * STEEL_DENSITY
        break
      }
      case 'rebar': {
        const diameter = parseFloat(dimensions.diameter) / 1000
        const len = length / 1000
        weight = Math.PI * Math.pow(diameter / 2, 2) * len * STEEL_DENSITY
        break
      }
      case 'pipe_round': {
        const diameter = parseFloat(dimensions.diameter) / 1000
        const wall = parseFloat(dimensions.wallThickness) / 1000
        const len = length / 1000
        const outerArea = Math.PI * Math.pow(diameter / 2, 2)
        const innerArea = Math.PI * Math.pow((diameter - 2 * wall) / 2, 2)
        weight = (outerArea - innerArea) * len * STEEL_DENSITY
        break
      }
      case 'pipe_square': {
        const sideA = parseFloat(dimensions.sideA) / 1000
        const sideB = parseFloat(dimensions.sideB || dimensions.sideA) / 1000
        const wall = parseFloat(dimensions.wallThickness) / 1000
        const len = length / 1000
        const outerArea = sideA * sideB
        const innerArea = (sideA - 2 * wall) * (sideB - 2 * wall)
        weight = (outerArea - innerArea) * len * STEEL_DENSITY
        break
      }
      case 'angle': {
        const sideA = parseFloat(dimensions.sideA) / 1000
        const sideB = parseFloat(dimensions.sideB || dimensions.sideA) / 1000
        const thickness = parseFloat(dimensions.thickness) / 1000
        const len = length / 1000
        weight = (sideA + sideB - thickness) * thickness * len * STEEL_DENSITY
        break
      }
      default:
        weight = 0
    }

    setResult({
      weight: Math.round(weight * 1000) / 1000,
      total: Math.round(weight * qty * 1000) / 1000,
    })
  }

  const renderInputs = () => {
    switch (profile) {
      case 'sheet':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Толщина (мм)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.thickness}
                onChange={(e) => setDimensions({ ...dimensions, thickness: e.target.value })}
                placeholder="Например: 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ширина (мм)
              </label>
              <Input
                type="number"
                value={dimensions.width}
                onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                placeholder="Например: 1000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина (мм)
              </label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                placeholder="Например: 2000"
              />
            </div>
          </>
        )
      case 'round':
      case 'rebar':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Диаметр (мм)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.diameter}
                onChange={(e) => setDimensions({ ...dimensions, diameter: e.target.value })}
                placeholder="Например: 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина (мм)
              </label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                placeholder="Например: 11700"
              />
            </div>
          </>
        )
      case 'pipe_round':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Внешний диаметр (мм)
              </label>
              <Input
                type="number"
                value={dimensions.diameter}
                onChange={(e) => setDimensions({ ...dimensions, diameter: e.target.value })}
                placeholder="Например: 57"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Толщина стенки (мм)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.wallThickness}
                onChange={(e) => setDimensions({ ...dimensions, wallThickness: e.target.value })}
                placeholder="Например: 3.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина (мм)
              </label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                placeholder="Например: 6000"
              />
            </div>
          </>
        )
      case 'pipe_square':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сторона A (мм)
                </label>
                <Input
                  type="number"
                  value={dimensions.sideA}
                  onChange={(e) => setDimensions({ ...dimensions, sideA: e.target.value })}
                  placeholder="40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Сторона B (мм)
                </label>
                <Input
                  type="number"
                  value={dimensions.sideB}
                  onChange={(e) => setDimensions({ ...dimensions, sideB: e.target.value })}
                  placeholder="20"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Толщина стенки (мм)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.wallThickness}
                onChange={(e) => setDimensions({ ...dimensions, wallThickness: e.target.value })}
                placeholder="2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина (мм)
              </label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                placeholder="6000"
              />
            </div>
          </>
        )
      case 'angle':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Полка A (мм)
                </label>
                <Input
                  type="number"
                  value={dimensions.sideA}
                  onChange={(e) => setDimensions({ ...dimensions, sideA: e.target.value })}
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Полка B (мм)
                </label>
                <Input
                  type="number"
                  value={dimensions.sideB}
                  onChange={(e) => setDimensions({ ...dimensions, sideB: e.target.value })}
                  placeholder="50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Толщина (мм)
              </label>
              <Input
                type="number"
                step="0.1"
                value={dimensions.thickness}
                onChange={(e) => setDimensions({ ...dimensions, thickness: e.target.value })}
                placeholder="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Длина (мм)
              </label>
              <Input
                type="number"
                value={dimensions.length}
                onChange={(e) => setDimensions({ ...dimensions, length: e.target.value })}
                placeholder="6000"
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <Calculator className="w-6 h-6 text-orange-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Калькулятор веса металла</h2>
          <p className="text-sm text-gray-600">Расчет массы металлопроката</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Тип профиля
          </label>
          <Select
            value={profile}
            onChange={(e) => {
              setProfile(e.target.value)
              setResult(null)
            }}
            options={profiles.map((p) => ({ value: p.value, label: p.label }))}
          />
        </div>

        {renderInputs()}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Количество штук
          </label>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <Button onClick={calculateWeight} className="w-full">
          Рассчитать
        </Button>

        {result && (
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Вес 1 шт.</p>
                <p className="text-2xl font-bold text-gray-900">{result.weight} кг</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Общий вес</p>
                <p className="text-2xl font-bold text-orange-500">{result.total} кг</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
