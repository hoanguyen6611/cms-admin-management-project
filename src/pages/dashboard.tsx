import Dashboard from "@/components/dashboard/DashBoard";
import Head from "next/head";
import React from "react";

const Dashborad = () => {
  return (
    <div>
      <Head>
        <title>Tổng quan</title>
      </Head>
      <Dashboard></Dashboard>
    </div>
  );
};

export default Dashborad;
