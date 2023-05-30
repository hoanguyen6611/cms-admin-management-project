import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useEffect } from "react";
import PromotionTable from "./promotion-table/PromotionTable";
import PromotionForm from "./promotion-form/PromotionForm";
import { actions, useStoreContext } from "@/store";
import { useRouter } from "next/router";

const PromotionShow = () => {
  const {state, dispatch} = useStoreContext();
  const router = useRouter();
  const showModal = () => {
    dispatch(actions.changeVisibleFormPromotion(true));
  };
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
