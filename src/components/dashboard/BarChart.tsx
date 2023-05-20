import React, { useState } from "react";
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
import axios from "axios";
import useSWR from "swr";
import { DatePicker, DatePickerProps } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const fetchers = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data.data;
};

const BarChart = () => {
  const [year, setYear] = useState<String>();
  const { data: revenueByYear } = useSWR(
    year
      ? `https://tech-api.herokuapp.com/v1/orders/revenue-by-year?year=${year}`
      : "",
    fetchers
  );
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
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu theo tháng",
        data: labels.map(() => revenueByYear?.map((item: any) => item.revenue)),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    setYear(dateString);
  };
  return (
    <div>
      <div className="p-3">
        <DatePicker onChange={onChange} picker="year" />
      </div>
      <div className="w-full md:col-span-2 relative lg:h-[70vh] h-[58vh] m-auto p-4 border rounded-lg bg-white">
        <Bar options={options} data={data} />
      </div>
    </div>
  );
};

export default BarChart;
