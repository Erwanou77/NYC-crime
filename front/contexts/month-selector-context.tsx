"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type MonthSelectorContextType = {
  selectedMonth: number // 0-11 (janvier-décembre)
  selectedYear: number
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
}

const MonthSelectorContext = createContext<MonthSelectorContextType | undefined>(undefined)

export function MonthSelectorProvider({
  children,
  initialMonth,
  initialYear,
}: {
  children: ReactNode
  initialMonth?: number
  initialYear?: number
}) {
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState<number>(initialMonth || currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || currentDate.getFullYear())

  return (
    <MonthSelectorContext.Provider value={{ selectedMonth, selectedYear, setSelectedMonth, setSelectedYear }}>
      {children}
    </MonthSelectorContext.Provider>
  )
}

export function useMonthSelector() {
  const context = useContext(MonthSelectorContext)
  if (context === undefined) {
    throw new Error("useMonthSelector must be used within a MonthSelectorProvider")
  }
  return context
}
