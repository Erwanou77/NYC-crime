"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", vol: 400, agression: 240, cambriolage: 180 },
  { name: "Fév", vol: 300, agression: 220, cambriolage: 220 },
  { name: "Mar", vol: 350, agression: 280, cambriolage: 250 },
  { name: "Avr", vol: 280, agression: 250, cambriolage: 190 },
  { name: "Mai", vol: 390, agression: 310, cambriolage: 230 },
  { name: "Juin", vol: 430, agression: 340, cambriolage: 270 },
  { name: "Juil", vol: 510, agression: 390, cambriolage: 320 },
  { name: "Août", vol: 580, agression: 420, cambriolage: 350 },
  { name: "Sep", vol: 520, agression: 380, cambriolage: 290 },
  { name: "Oct", vol: 450, agression: 320, cambriolage: 240 },
  { name: "Nov", vol: 400, agression: 290, cambriolage: 210 },
  { name: "Déc", vol: 480, agression: 350, cambriolage: 260 },
]

export default function CrimeChart() {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="vol" stroke="#0088FE" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="agression" stroke="#00C49F" />
          <Line type="monotone" dataKey="cambriolage" stroke="#FFBB28" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
