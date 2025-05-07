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
    <div ref={mapRef} className="h-[500px] w-full bg-muted/40 rounded-md flex items-center justify-center">
      <div className="bg-background/80 p-4 rounded-md shadow-md">
        Carte
      </div>
    </div>
  )
}
