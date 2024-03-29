import React, { useEffect } from "react";
import PermissionForm from "./permission-form/PermissionForm";
import { Button } from "antd";
import { useRouter } from "next/router";
import PermissionTable from "./permission-table/PermissionTable";

const PermissionShow = () => {
  const router = useRouter();
  const showModal = () => {
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);
  return (
    <div>
      <Button className="mb-2" onClick={showModal}>
        Thêm vai trò
      </Button>
      <PermissionForm></PermissionForm>
      <PermissionTable></PermissionTable>
    </div>
  );
};

export default PermissionShow;
