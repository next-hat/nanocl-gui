import React from "react"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js"
import { useTheme } from "next-themes"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export type HttpChartsProps = {
  data: any[]
  title: string
  dataKey: string
  axisKey: string
}

export function HttpCharts({ title, data, dataKey, axisKey }: HttpChartsProps) {
  const { theme } = useTheme()
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    // Modify the axis by adding scales
    scales: {
      // to remove the labels
      x: {
        ticks: {
          display: false,
        },

        // to remove the x-axis grid
        grid: {
          drawBorder: true,
          display: true,
          color: theme === "dark" ? "#2d3748" : "#e2e8f0",
        },
      },
      // to remove the y-axis labels
      y: {
        ticks: {
          display: false,
          beginAtZero: true,
          padding: -9,
        },
        // to remove the y-axis grid
        grid: {
          drawBorder: true,
          display: true,
          color: theme === "dark" ? "#2d3748" : "#e2e8f0",
        },
      },
    },
  }
  return (
    <div>
      <Bar
        height={420}
        options={options}
        data={{
          labels: [title],
          datasets: data.map((d) => ({
            label: d[axisKey],
            data: [d[dataKey]],
            backgroundColor: d.backgroundColor,
          })),
        }}
      />
    </div>
  )
}
