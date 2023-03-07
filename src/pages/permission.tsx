import LayoutPage from "@/components/layout/layout/Layout";
import PermissionTable from "@/components/layout/permission/permission-table/PermissionTable";
import Head from "next/head";
import React from "react";

const Permission = () => {
  return (
    <div>
      <Head>
        <title>Quản lý quyền</title>
      </Head>
      <PermissionTable></PermissionTable>
    </div>
  );
};

export default Permission;
