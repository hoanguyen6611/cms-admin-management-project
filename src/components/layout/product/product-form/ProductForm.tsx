import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Switch,
  Upload,
} from "antd";
import React, { useState } from "react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateVisibleFormProduct } from "@/redux/productSlice";
const { TextArea } = Input;

const ProductForm = () => {
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState();
  const product = useSelector((state: any) => state.product);
  const [category, setCategory] = useState([]);
  const [saleOff, setSaleOff] = useState(false);
  const [numberSaleOff, setNumberSaleOff] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [parentId, setParentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-3",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-4",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-xxx",
      percent: 50,
      name: "image.png",
      status: "uploading",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-5",
      name: "image.png",
      status: "error",
    },
  ]);
  const dispatch = useDispatch();
  const handleOk = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product/create",
      {
        description: des,
        name: name,
        price: price,
        isSaleOff: saleOff,
        isSoldOut: soldOut,
        saleOff: numberSaleOff,
        categoryId: Number(categoryId),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      //   getProduct();
      dispatch(updateVisibleFormProduct(false));
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };

  const handleCancel = () => {
    dispatch(updateVisibleFormProduct(false));
  };
  const handleChange = (value: string) => {
    console.log(value);
    setCategoryId(value);
  };
  const handleChangeParent = (value: string) => {
    console.log(value);
    setParentId(value);
  };
  const getCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      "https://tech-api.herokuapp.com/v1/product-category/list",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    res.data.data.map((data: any) => {
      data.value = data.id;
      data.label = data.name;
    });
    setCategory(res.data.data || []);
  };
  const handleCancelcreateCategory = () => {
    setCreateCategory(false);
  };
  const handleOkcreateCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product-category/create",
      {
        name: categoryName,
        note: noteCategory,
        orderSort: 0,
        status: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      //   getProduct();
      // dispatch(updateVisibleFormProduct(false));
      setCreateCategory(false);
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  return (
    <div>
      <Modal
        title="Tạo mới"
        open={product.isVisibleFormProduct}
        onOk={handleOk}
        okType={"danger"}
        onCancel={handleCancel}
        width={1000}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[
              { required: true, message: "Tên sản phẩm là trường bắt buộc" },
            ]}
          >
            <Input onChange={(e) => setName(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Thông tin sản phẩm"
            name="description"
            rules={[
              {
                required: true,
                message: "Thông tin sản phẩm là trường bắt buộc",
              },
            ]}
          >
            <Input onChange={(e) => setDes(e.target.value)} />
          </Form.Item>
          <Form.Item
            label="Giá sản phẩm"
            name="price"
            rules={[
              { required: true, message: "Giá sản phẩm là trường bắt buộc" },
            ]}
          >
            <InputNumber onChange={(e: any) => setPrice(e)} />
          </Form.Item>
          <Form.Item label="Nhóm sản phẩm" name="category">
            <Select
              defaultValue="Chọn nhóm sản phẩm"
              style={{ width: 120 }}
              onChange={handleChange}
              options={category}
            />
            <button className="ml-2" onClick={() => setCreateCategory(true)}>
              <PlusOutlined />
            </button>
          </Form.Item>
          <Form.Item label="Sale Off" name="saleOff">
            <div className="flex items-center justify-around">
              <Switch
                style={{ width: 50 }}
                onChange={(e: boolean) => setSaleOff(e)}
              />
              <InputNumber
                hidden={!saleOff}
                style={{ width: 200 }}
                onChange={(e: any) => setNumberSaleOff(e)}
              />
            </div>
          </Form.Item>
          <Form.Item label="Sold out" name="soldOut">
            <div className="ml-10">
              <Switch
                style={{ width: 50 }}
                onChange={(e: boolean) => setSoldOut(e)}
              />
            </div>
          </Form.Item>
          <Form.Item>
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture-card"
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
        <Button onClick={getCategory}>Show</Button>
      </Modal>
      <Modal
        title="Tạo mới danh mục sản phẩm"
        open={createCategory}
        okType={"danger"}
        onOk={handleOkcreateCategory}
        onCancel={handleCancelcreateCategory}
        width={800}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Form.Item
            label="Tên danh mục"
            name="nameCategory"
            rules={[
              { required: true, message: "Tên danh mục là trường bắt buộc" },
            ]}
          >
            <Input onChange={(e) => setCategoryName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Danh mục cha" name="parentId">
            <Select
              defaultValue="Chọn nhóm danh mục cha"
              style={{ width: 120 }}
              onChange={handleChangeParent}
              options={category}
            />
            <button className="ml-2" onClick={() => setCreateCategory(true)}>
              <PlusOutlined />
            </button>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <TextArea
              rows={4}
              onChange={(e) => setNoteCategory(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductForm;
