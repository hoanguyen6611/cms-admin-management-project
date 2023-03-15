
import GroupPermissionTable from "@/components/group-permission/group-permission-table/GroupPermissionTable";
import Head from "next/head";
import React from "react";

const Group = () => {
  return (
    <div>
      <Head>
        <title>Phân quyền </title>
      </Head>
      <GroupPermissionTable></GroupPermissionTable>
    </div>
  );
};

export default Group;
