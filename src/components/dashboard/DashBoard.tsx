import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Selling from "./Selling";
import BarChart from "./BarChart";
import Statistical from "./Statistical";
import { DatePicker, DatePickerProps, Space } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { actions, useStoreContext } from "@/store";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const router = useRouter();
  const { state, dispatch } = useStoreContext();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }
  }, [router]);
  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    dispatch(actions.setFromDate(dateString[0] + " " + "00:00:00"));
    dispatch(actions.setToDate(dateString[1] + " " + "00:00:00"));
  };
  return (
    <div>
      <RangePicker onChange={onChange} format="DD/MM/YYYY" />
      <Statistical />
      <div className="p-4 grid md:grid-cols-2 grid-cols-1 gap-4">
        <BarChart></BarChart>
        <Selling></Selling>
      </div>
    </div>
  );
};

export default Dashboard;
