import GroupPermissionShow from "@/components/group-permission/GroupPermission";
import Head from "next/head";
import React from "react";

const Group = () => {
  return (
    <div>
      <Head>
        <title>Phân quyền </title>
      </Head>
      <GroupPermissionShow></GroupPermissionShow>
    </div>
  );
};

export default Group;
