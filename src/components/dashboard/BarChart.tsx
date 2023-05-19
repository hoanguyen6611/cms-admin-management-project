import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { faker } from "@faker-js/faker";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = () => {
  const [chartData, setChartData] = useState<ChartData>();
  const [chartOptions, setChartOptions] = useState<ChartOptions>({});
  useEffect(() => {
  }, []);
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Thống kế doanh thu theo năm",
      },
    },
  };

  const labels = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8"
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu theo tháng",
        data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div>
      <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[58vh] m-auto p-4 border rounded-lg bg-white">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default BarChart;
