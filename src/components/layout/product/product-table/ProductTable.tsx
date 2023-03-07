import React, { useEffect, useState } from "react";
import { Button, Modal, notification, Space, Table, Upload } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { updateVisibleFormProduct } from "@/redux/productSlice";
import { useDispatch } from "react-redux";
import ProductForm from "../product-form/ProductForm";

interface Product {
  id: number;
  modifiedDate: string;
  createdDate: string;
  modifiedBy: string;
  createdBy: string;
  description: string;
  name: string;
  price: number;
  image: string;
  saleOff: number;
}

const ProductTable = () => {
  const [product, setProduct] = useState([]);
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
      getProduct();
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
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thông tin sản phẩm",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "action",
      render: (record) => {
        return (
          <>
            <EditOutlined />
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
  const getProduct = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/product/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProduct(res.data.data.data || []);
  };
  useEffect(() => {
    getProduct();
  }, []);
  const showModal = () => {
    dispatch(updateVisibleFormProduct(true));
  };
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  return (
    <div>
      <>
        <Space>
          <Button className="" onClick={showModal}>
            Tạo mới
          </Button>
          <Upload>
            <Button>
              <UploadOutlined /> Click to Upload
            </Button>
          </Upload>
        </Space>
        <ProductForm></ProductForm>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={product}
          className="mt-4"
        />
      </>
    </div>
  );
};

export default ProductTable;
