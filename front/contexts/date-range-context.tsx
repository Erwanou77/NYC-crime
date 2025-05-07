"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { DateRange } from "react-day-picker"

type DateRangeContextType = {
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined)

export function DateRangeProvider({
  children,
  initialDateRange,
}: { children: ReactNode; initialDateRange?: DateRange }) {
  const [dateRange, setDateRange] = useState<DateRange>(
    initialDateRange || {
      from: new Date(new Date().getFullYear(), 0, 1), // 1er janvier de l'année en cours
      to: new Date(),
    },
  )

  return <DateRangeContext.Provider value={{ dateRange, setDateRange }}>{children}</DateRangeContext.Provider>
}

export function useDateRange() {
  const context = useContext(DateRangeContext)
  if (context === undefined) {
    throw new Error("useDateRange must be used within a DateRangeProvider")
  }
  return context
}
