"use client"

import { useEffect, useRef } from "react"

export default function CrimeMap() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ici, vous intégreriez une bibliothèque de cartographie comme Mapbox, Leaflet ou Google Maps
    // Pour la maquette, nous utilisons simplement une image statique
    if (mapRef.current) {
      const mapElement = mapRef.current
      mapElement.style.backgroundImage = "url('/placeholder.svg?height=500&width=800')"
      mapElement.style.backgroundSize = "cover"
      mapElement.style.backgroundPosition = "center"
    }
  }, [])

  return (
    <div className="h-[500px] w-full bg-muted/40 rounded-md flex items-center justify-center">
      <iframe title="carte" width="100%" height="100%" src="https://app.powerbi.com/view?r=eyJrIjoiY2ZhN2JhODQtNTQ2NC00MTE0LWI3ZjUtNzk5NTc3NWZlZjI3IiwidCI6IjEwOGJjODY0LWNkZjUtNGVjMy04YjdjLTRlYjA2YmUxYjQxZCIsImMiOjl9" allowFullScreen={true}></iframe>
    </div>
  )
}
