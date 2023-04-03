import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

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
  return <div></div>;
};

export default Dashboard;
