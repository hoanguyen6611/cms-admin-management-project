import React, { useEffect } from "react";
import CategoryTable from "@/components/category/category-table/CategoryTable";
import CategoryForm from "./category-form/CategoryForm";
import { useDispatch } from "react-redux";
import { updateIsVisibleFormCategory } from "@/redux/categorySlice";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const CategoryShow = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const showModal = () => {
    dispatch(updateIsVisibleFormCategory(true));
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
      <div className="flex justify-end ml-4">
        <Button className="mb-2" onClick={showModal}>
          Tạo mới
        </Button>
        <Button>
          <UploadOutlined />
        </Button>
      </div>
      <CategoryTable></CategoryTable>
      <CategoryForm></CategoryForm>
    </div>
  );
};

export default CategoryShow;
