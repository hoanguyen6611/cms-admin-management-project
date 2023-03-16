import PermissionShow from "@/components/permission/Permission";
import Head from "next/head";
import React from "react";

const Permission = () => {
  return (
    <div>
      <Head>
        <title>Quản lý quyền</title>
      </Head>
      <PermissionShow></PermissionShow>
    </div>
  );
};

export default Permission;
