"use client"

import { useMonthSelector } from "@/contexts/month-selector-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export function MonthSelector() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } = useMonthSelector()

  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ]

  // Générer une liste d'années (de 2010 à l'année actuelle)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => 2010 + i)

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Sélectionner une période pour les statistiques</div>
          <div className="flex items-center gap-2">
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sélectionner un mois" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number.parseInt(value))}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
