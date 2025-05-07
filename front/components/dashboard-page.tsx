"use client"

import { useState, useEffect } from "react"
import { Map, BarChart4, PieChart, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MonthSelector } from "@/components/month-selector"
import CrimeMap from "@/components/crime-map"
import CrimeStats from "@/components/crime-stats"
import CrimeChart from "@/components/crime-chart"
import CrimePrediction from "@/components/crime-prediction"
import { useMonthSelector } from "@/contexts/month-selector-context"
import { fetchCrimeDataByMonth, type CrimeData } from "@/services/crime-data-service"

export default function DashboardPage() {
  const { selectedMonth, selectedYear } = useMonthSelector()
  const [crimeData, setCrimeData] = useState<CrimeData>({
    totalCrimes: 0,
    mostAffectedArea: "",
    areaPercentage: 0,
    mainCrimeType: "",
    crimeTypePercentage: 0,
    peakHours: "",
    peakHoursPercentage: 0,
    isLoading: true,
    error: null,
  })

  // Récupérer les données de l'API en fonction du mois et de l'année sélectionnés
  useEffect(() => {
    const fetchData = async () => {
      setCrimeData((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const data = await fetchCrimeDataByMonth(selectedMonth, selectedYear)
        setCrimeData(data)
      } catch (error) {
        console.error("Error in dashboard:", error)
        setCrimeData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Une erreur s'est produite",
        }))
      }
    }

    fetchData()
  }, [selectedMonth, selectedYear])

  // Obtenir le nom du mois en français
  const getMonthName = (month: number) => {
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
    return months[month]
  }

  // Traduire les noms de quartiers en français si nécessaire
  const translateBorough = (borough: string) => {
    const translations: Record<string, string> = {
      MANHATTAN: "Manhattan",
      BROOKLYN: "Brooklyn",
      BRONX: "Bronx",
      QUEENS: "Queens",
      "STATEN ISLAND": "Staten Island",
      Inconnu: "Inconnu",
    }
    return translations[borough] || borough
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <h1 className="text-2xl font-bold tracking-tight mb-6">NYC Crime Visualization Platform</h1>

        {/* Sélecteur de mois et d'année au-dessus des cartes */}
        <MonthSelector />

        {/* Les 4 cartes de statistiques qui se mettent à jour */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total des Crimes</CardTitle>
              <BarChart4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {crimeData.isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                </div>
              ) : crimeData.error ? (
                <div className="text-sm text-red-500">{crimeData.error}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{crimeData.totalCrimes.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    {getMonthName(selectedMonth)} {selectedYear}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quartier le Plus Touché</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {crimeData.isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                </div>
              ) : crimeData.error ? (
                <div className="text-sm text-red-500">{crimeData.error}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{translateBorough(crimeData.mostAffectedArea)}</div>
                  <p className="text-xs text-muted-foreground">{crimeData.areaPercentage}% des incidents totaux</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Type de Crime Principal</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {crimeData.isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                </div>
              ) : crimeData.error ? (
                <div className="text-sm text-red-500">{crimeData.error}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{crimeData.mainCrimeType}</div>
                  <p className="text-xs text-muted-foreground">
                    {crimeData.crimeTypePercentage}% des incidents signalés
                  </p>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Heure de Pointe</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {crimeData.isLoading ? (
                <div className="flex flex-col gap-2">
                  <div className="h-8 w-24 animate-pulse rounded bg-muted"></div>
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                </div>
              ) : crimeData.error ? (
                <div className="text-sm text-red-500">{crimeData.error}</div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{crimeData.peakHours}</div>
                  <p className="text-xs text-muted-foreground">{crimeData.peakHoursPercentage}% des incidents</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Le reste de l'interface reste statique */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Carte des Crimes</CardTitle>
              <CardDescription>Distribution géographique des incidents à New York</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex space-x-4 p-4">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type de crime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les crimes</SelectItem>
                    <SelectItem value="theft">Vol</SelectItem>
                    <SelectItem value="assault">Agression</SelectItem>
                    <SelectItem value="burglary">Cambriolage</SelectItem>
                    <SelectItem value="robbery">Vol à main armée</SelectItem>
                    <SelectItem value="homicide">Homicide</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Quartier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les quartiers</SelectItem>
                    <SelectItem value="manhattan">Manhattan</SelectItem>
                    <SelectItem value="brooklyn">Brooklyn</SelectItem>
                    <SelectItem value="queens">Queens</SelectItem>
                    <SelectItem value="bronx">Bronx</SelectItem>
                    <SelectItem value="staten_island">Staten Island</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <CrimeMap />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Statistiques des Crimes</CardTitle>
              <CardDescription>Répartition par type et tendances</CardDescription>
            </CardHeader>
            <CardContent>
              <CrimeStats />
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="temporal">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="temporal">Analyse Temporelle</TabsTrigger>
            <TabsTrigger value="correlation">Corrélations</TabsTrigger>
            <TabsTrigger value="prediction">Prévisions</TabsTrigger>
          </TabsList>
          <TabsContent value="temporal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Évolution Temporelle des Crimes</CardTitle>
                <CardDescription>Tendances mensuelles et hebdomadaires des incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <Select defaultValue="monthly">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Quotidien</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="yearly">Annuel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type de crime" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les crimes</SelectItem>
                      <SelectItem value="theft">Vol</SelectItem>
                      <SelectItem value="assault">Agression</SelectItem>
                      <SelectItem value="burglary">Cambriolage</SelectItem>
                      <SelectItem value="robbery">Vol à main armée</SelectItem>
                      <SelectItem value="homicide">Homicide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CrimeChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="correlation" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Corrélation Crime-Zone</CardTitle>
                <CardDescription>Analyse des relations entre types de crimes et zones géographiques</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <Select defaultValue="heatmap">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Type de visualisation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heatmap">Carte de chaleur</SelectItem>
                      <SelectItem value="scatter">Nuage de points</SelectItem>
                      <SelectItem value="matrix">Matrice de corrélation</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Variables" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les variables</SelectItem>
                      <SelectItem value="socioeconomic">Socio-économiques</SelectItem>
                      <SelectItem value="demographic">Démographiques</SelectItem>
                      <SelectItem value="urban">Urbanistiques</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="h-[400px] w-full bg-muted/40 rounded-md flex items-center justify-center">
                  <p className="text-muted-foreground">Carte de chaleur des corrélations crime-zone</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="prediction" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Prévisions de Criminalité</CardTitle>
                <CardDescription>
                  Modèles prédictifs basés sur les séries temporelles et le clustering spatial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-4">
                  <Select defaultValue="timeseries">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Modèle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="timeseries">Séries temporelles</SelectItem>
                      <SelectItem value="spatial">Clustering spatial</SelectItem>
                      <SelectItem value="ml">Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 jours</SelectItem>
                      <SelectItem value="30">30 jours</SelectItem>
                      <SelectItem value="90">90 jours</SelectItem>
                      <SelectItem value="365">1 an</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CrimePrediction />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
