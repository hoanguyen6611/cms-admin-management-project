import React from "react";
import CategoryTable from "@/components/category/category-table/CategoryTable";
import CategoryForm from "./category-form/CategoryForm";
import { useDispatch } from "react-redux";
import { updateIsVisibleFormCategory } from "@/redux/categorySlice";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const CategoryShow = () => {
  const dispatch = useDispatch();
  const showModal = () => {
    dispatch(updateIsVisibleFormCategory(true));
  };
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
