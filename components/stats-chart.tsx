'use client'

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'

interface DataPoint {
  day: string
  count: number
  completed: number
}

interface TooltipPayload {
  name: string
  value: number
  payload: DataPoint
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="border border-ink/10 bg-parchment-light px-3 py-2 shadow-sm">
      <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted mb-1">{label}</p>
      <p className="font-serif text-sm font-medium text-ink">{d.count} session{d.count !== 1 ? 's' : ''}</p>
      <p className="font-mono text-[9px] text-sage">{d.completed} completed</p>
    </div>
  )
}

export function StatsChart({ data }: { data: DataPoint[] }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'short' })

  return (
    <div className="h-28 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: -32, bottom: 0 }} barSize={18}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, fill: '#8a7f74' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{ fontFamily: 'var(--font-jetbrains)', fontSize: 9, fill: '#8a7f74' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#e8ddd0' }} />
          <Bar dataKey="count" radius={[2, 2, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.day}
                fill={entry.day === today ? '#c97b5e' : '#d9cfc3'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
