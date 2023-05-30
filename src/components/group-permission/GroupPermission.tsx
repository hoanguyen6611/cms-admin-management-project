import React, { useEffect } from "react";
import ChangePermission from "./change-permission/ChangePermission";
import GroupPermissionTable from "./group-permission-table/GroupPermissionTable";
import { useRouter } from "next/router";

const GroupPermissionShow = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
      }
    }
  }, [router]);
  return (
    <div>
      <ChangePermission></ChangePermission>
      <GroupPermissionTable></GroupPermissionTable>
    </div>
  );
};

export default GroupPermissionShow;
