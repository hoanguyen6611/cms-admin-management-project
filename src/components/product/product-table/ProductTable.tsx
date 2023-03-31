import React, { useEffect, useState } from "react";
import { notification, Table, Spin, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  isEditProductForm,
  updateVisibleFormProduct,
} from "@/redux/product/productSlice";
import { useDispatch } from "react-redux";
import useSWR from "swr";
import { Product } from "@/models";
import styles from "./ProductTable.module.scss";
import { actions, useStoreContext } from "@/store";

const VND = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
const fetcher = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    "https://tech-api.herokuapp.com/v1/product/list",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  res.data.data.data.map((data: any) => {
    data.key = data.id;
    data.price = VND.format(data.price);
  });
  return res.data.data.data;
};

const ProductTable = () => {
  const { data, error } = useSWR("/product", fetcher);
  const [state, dispatchs] = useStoreContext();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const dispatch = useDispatch();
  const deleteProduct = async (record: any) => {
    const token = localStorage.getItem("token");
    const res = await axios.delete(
      `https://tech-api.herokuapp.com/v1/product/delete/${record}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    } else if (!res.data.result) {
      notification.open({
        message: res.data.message,
        icon: <CloseOutlined style={{ color: "red" }} />,
      });
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text) => (
        <Tag
          style={
            text === 1 ? { width: 80, height: 30 } : { width: 120, height: 30 }
          }
          color={text === 1 ? "green" : "red"}
          key={text}
        >
          {text === 1 ? "KÍCH HOẠT" : "CHƯA KÍCH HOẠT"}
        </Tag>
      ),
    },
    {
      title: "",
      dataIndex: "id",
      key: "action",
      render: (record: number) => {
        return (
          <>
            <EditOutlined
              style={{ color: "green" }}
              onClick={() => isEditProduct(record)}
            />
            <DeleteOutlined
              style={{ color: "red", marginLeft: 12 }}
              onClick={() => {
                deleteProduct(record);
              }}
            />
          </>
        );
      },
    },
  ];
  const isEditProduct = (record: number) => {
    console.log(process.env.URL_HOST);
    dispatch(updateVisibleFormProduct(true));
    dispatch(isEditProductForm(true));
    dispatchs(actions.setIdProductForm(record));
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  // if (error) return <div>An error has occured</div>;
  // if (!data)
  //   return (
  //     <div className={styles.example}>
  //       <Spin />
  //     </div>
  //   );
  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      className="mt-4"
    />
  );
};

export default ProductTable;
