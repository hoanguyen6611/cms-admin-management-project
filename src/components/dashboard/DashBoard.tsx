import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Selling from "./Selling";
import BarChart from "./BarChart";
import Statistical from "./Statistical";
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);
  return (
    <div>
      <RangePicker />
      <Statistical />
      <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4">
        <BarChart></BarChart>
        <Selling></Selling>
      </div>
    </div>
  );
};

export default Dashboard;
