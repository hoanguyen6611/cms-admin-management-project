import LayoutPage from "@/components/layout/layout/Layout";
import PermissionTable from "@/components/layout/permission/PermissionTable";
import Head from "next/head";
import React from "react";

const Permission = () => {
  return (
    <div>
      <Head>
        <title>Quản lý quyền</title>
      </Head>
      <LayoutPage>
        <PermissionTable></PermissionTable>
      </LayoutPage>
    </div>
  );
};

export default Permission;
