import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import PromotionTable from "./promotion-table/PromotionTable";
import PromotionForm from "./promotion-form/PromotionForm";

const PromotionShow = () => {
  const showModal = () => {};
  return (
    <div>
      <div className="flex justify-end ml-4">
        <Button className="mb-2" onClick={showModal}>
          <PlusOutlined />
          Tạo mới
        </Button>
      </div>
      <PromotionTable/>
      < PromotionForm/>
    </div>
  );
};

export default PromotionShow;
