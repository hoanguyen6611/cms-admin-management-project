import GroupPermissionTable from "@/components/layout/group-permission/GroupPermissionTable";
import LayoutPage from "@/components/layout/layout/Layout";
import Head from "next/head";
import React from "react";

const GroupPermission = () => {
  return (
    <div>
      <Head>
        <title>Quản lý phân quyền</title>
      </Head>
      <LayoutPage>
        <GroupPermissionTable></GroupPermissionTable>
      </LayoutPage>
    </div>
  );
};

export default GroupPermission;
