import GroupPermissionDetaill from "@/components/layout/group-permission/GroupPermissionDetail";
import LayoutPage from "@/components/layout/layout/Layout";
import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import Head from "next/head";


const GroupPermissionDetail = () => {
  const router = useRouter();
  const query = router.query;
  const id = query.id;
  return (
    <div>
      <Head>
        <title>Phân quyền</title>
      </Head>
      <LayoutPage>
        <GroupPermissionDetaill id={id}></GroupPermissionDetaill>
      </LayoutPage>
    </div>
  );
};

export default GroupPermissionDetail;
