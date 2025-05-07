// Service pour récupérer et traiter les données de l'API NYC Open Data
export interface CrimeData {
  totalCrimes: number
  mostAffectedArea: string
  areaPercentage: number
  mainCrimeType: string
  crimeTypePercentage: number
  peakHours: string
  peakHoursPercentage: number
  isLoading: boolean
  error: string | null
}

// Fonction pour récupérer les données de crimes pour un mois spécifique
export async function fetchCrimeDataByMonth(month: number, year: number): Promise<CrimeData> {
  try {
    // Construire les dates de début et de fin pour le mois sélectionné
    // Format de date pour l'API: YYYY-MM-DDT00:00:00.000
    const startDate = `${year}-${(month + 1).toString().padStart(2, "0")}-01T00:00:00.000`

    // Calculer le dernier jour du mois
    const lastDay = new Date(year, month + 1, 0).getDate()
    const endDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${lastDay}T23:59:59.999`

    // Construire l'URL avec les filtres de date
    // Utiliser CMPLNT_FR_DT qui est la date exacte de l'événement
    const url = `https://data.cityofnewyork.us/resource/5uac-w243.json?$where=cmplnt_fr_dt between '${startDate}' and '${endDate}'&$limit=100000`

    console.log(`Fetching data from: ${url}`)

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Traiter les données pour obtenir les statistiques
    return processData(data)
  } catch (error) {
    console.error("Error fetching crime data:", error)
    return {
      totalCrimes: 0,
      mostAffectedArea: "Données indisponibles",
      areaPercentage: 0,
      mainCrimeType: "Données indisponibles",
      crimeTypePercentage: 0,
      peakHours: "Données indisponibles",
      peakHoursPercentage: 0,
      isLoading: false,
      error: error instanceof Error ? error.message : "Une erreur s'est produite",
    }
  }
}

// Fonction pour traiter les données brutes et calculer les statistiques
function processData(data: any[]): CrimeData {
  // Si aucune donnée n'est disponible
  if (!data || data.length === 0) {
    return {
      totalCrimes: 0,
      mostAffectedArea: "Aucune donnée",
      areaPercentage: 0,
      mainCrimeType: "Aucune donnée",
      crimeTypePercentage: 0,
      peakHours: "Aucune donnée",
      peakHoursPercentage: 0,
      isLoading: false,
      error: null,
    }
  }

  // Nombre total de crimes
  const totalCrimes = data.length

  // Compter les crimes par quartier (BORO)
  const areaCount: Record<string, number> = {}
  data.forEach((crime) => {
    const area = crime.boro || "Inconnu"
    areaCount[area] = (areaCount[area] || 0) + 1
  })

  // Trouver le quartier le plus touché
  let mostAffectedArea = "Inconnu"
  let maxAreaCount = 0

  Object.entries(areaCount).forEach(([area, count]) => {
    if (count > maxAreaCount) {
      mostAffectedArea = area
      maxAreaCount = count
    }
  })

  const areaPercentage = Math.round((maxAreaCount / totalCrimes) * 100)

  // Compter les crimes par type (OFNS_DESC)
  const crimeTypeCount: Record<string, number> = {}
  data.forEach((crime) => {
    const type = crime.ofns_desc || "Inconnu"
    crimeTypeCount[type] = (crimeTypeCount[type] || 0) + 1
  })

  // Trouver le type de crime le plus fréquent
  let mainCrimeType = "Inconnu"
  let maxTypeCount = 0

  Object.entries(crimeTypeCount).forEach(([type, count]) => {
    if (count > maxTypeCount) {
      mainCrimeType = type
      maxTypeCount = count
    }
  })

  const crimeTypePercentage = Math.round((maxTypeCount / totalCrimes) * 100)

  // Analyser les heures des crimes (CMPLNT_FR_TM)
  const hourRanges = {
    "00h - 06h": 0,
    "06h - 12h": 0,
    "12h - 18h": 0,
    "18h - 00h": 0,
  }

  data.forEach((crime) => {
    if (crime.cmplnt_fr_tm) {
      try {
        // Le format de l'heure peut varier, essayons de l'extraire
        let hour: number

        // Si c'est au format HH:MM:SS
        if (crime.cmplnt_fr_tm.includes(":")) {
          hour = Number.parseInt(crime.cmplnt_fr_tm.split(":")[0], 10)
        }
        // Si c'est un autre format, essayons de le convertir
        else {
          const timeString = crime.cmplnt_fr_tm.toString()
          hour = Number.parseInt(timeString.substring(0, 2), 10)
        }

        // Vérifier que l'heure est valide
        if (!isNaN(hour) && hour >= 0 && hour < 24) {
          if (hour >= 0 && hour < 6) {
            hourRanges["00h - 06h"]++
          } else if (hour >= 6 && hour < 12) {
            hourRanges["06h - 12h"]++
          } else if (hour >= 12 && hour < 18) {
            hourRanges["12h - 18h"]++
          } else {
            hourRanges["18h - 00h"]++
          }
        }
      } catch (e) {
        console.error("Error parsing time:", crime.cmplnt_fr_tm, e)
      }
    }
  })

  // Trouver la plage horaire la plus fréquente
  let peakHours = "Inconnu"
  let maxHourCount = 0

  Object.entries(hourRanges).forEach(([range, count]) => {
    if (count > maxHourCount) {
      peakHours = range
      maxHourCount = count
    }
  })

  const peakHoursPercentage = Math.round((maxHourCount / totalCrimes) * 100)

  return {
    totalCrimes,
    mostAffectedArea,
    areaPercentage,
    mainCrimeType,
    crimeTypePercentage,
    peakHours,
    peakHoursPercentage,
    isLoading: false,
    error: null,
  }
}
