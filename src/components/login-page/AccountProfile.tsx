import { useRouter } from "next/router";
import React, { useEffect } from "react";

const AccountProfile = () => {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    }
  }, [router]);
  return <div>Quản lý tài khoản cá nhân</div>;
};

export default AccountProfile;
