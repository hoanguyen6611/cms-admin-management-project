import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Switch,
  Upload,
  Tabs,
} from "antd";
import React, { useRef, useState } from "react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateVisibleFormProduct } from "@/redux/product/productSlice";
const { TextArea } = Input;
import * as yup from "yup";
import { ProductCreate } from "@/models/product";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./ProductForm.module.scss";
import { ref, UploadResult, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/utils/firebase";
import type { RadioChangeEvent } from "antd";
import useSWR from "swr";
import { Variant } from "@/models";

const schema = yup
  .object({
    name: yup.string().required("Vui lòng nhập tên sản phẩm"),
    description: yup.string().required("Vui lòng nhập thông tin sản phẩm"),
    price: yup.number().required("Vui lòng nhập giá sản phẩm"),
    categoryId: yup.number(),
    isSaleOff: yup.boolean(),
    saleOff: yup.number(),
    isSoldOut: yup.boolean(),
    image: yup.string(),
    tags: yup.string(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;
const variants: Variant[] = [];
const fetcher = async () => {
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
  return res.data.data;
};
const Variants = () => {
  const [fileList, setFileList] = useState([]);
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState<File>();
  const [imageUpload, setImageUpload] = useState("");
  const [status, setStatus] = useState(0);
  const [orderSort, setOrderSort] = useState(0);
  const value = {
    description: des,
    image: imageUpload,
    name: name,
    orderSort: orderSort,
    price: price,
    status: status,
  };
  const addVariant = () => {
    variants.push(value);
    console.log(variants);
  };
  const handleFileSelected = (file: any) => {
    setImage(file);
  };
  const uploadImage = () => {
    if (!image) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${image.name}`);
      uploadBytesResumable(imageRef, image).then((res: UploadResult) => {
        setImageUpload(
          `https://firebasestorage.googleapis.com/v0/b/music-mp3-page.appspot.com/o/images%2F${image.name}?alt=media&token=16d7e53d-909a-484e-8481-f242d2e3a31f`
        );
      });
    }
  };
  return (
    <div>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
      >
        <Row>
          <Col span={8}>
            <Form.Item label="Tên" name="name">
              <Input onChange={(e) => setName(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Thông tin" name="description">
              <Input onChange={(e) => setDes(e.target.value)} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Giá" name="price">
              <InputNumber onChange={(e: any) => setPrice(e)} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item label="Hình ảnh" name="image">
              <Upload
                listType="picture-card"
                onChange={(e) => handleFileSelected(e.file)}
              >
                {fileList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <Button onClick={uploadImage}>Upload</Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" name="status">
              <Radio.Group
                onChange={(e: RadioChangeEvent) => {
                  setStatus(e.target.value);
                }}
              >
                <Radio value={0}>Khoá</Radio>
                <Radio value={1}>Mở</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Button onClick={addVariant}>Thêm</Button>
    </div>
  );
};
const initialItems = [
  { label: "Thuộc tính 1", children: <Variants></Variants>, key: "1" },
];
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const ProductForm = () => {
  const { data, error } = useSWR("/product-category", fetcher);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState();
  const product = useSelector((state: any) => state.product);
  const [category, setCategory] = useState([]);
  const [saleOff, setSaleOff] = useState(false);
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState<File>();
  const [imageUpload, setImageUpload] = useState("");
  const [numberSaleOff, setNumberSaleOff] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [parentId, setParentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [fileList, setFileList] = useState([]);
  const [items, setItems] = useState(initialItems);
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [isRequired, setIsRequired] = useState(true);
  const [nameConfig, setNameConfig] = useState("");
  const [statusConfig, setStatusConfig] = useState(1);
  const newTabIndex = useRef(0);
  const dispatch = useDispatch();
  const handleOk = async () => {
    console.log({
      description: des,
      name: name,
      price: price,
      isSaleOff: saleOff,
      isSoldOut: soldOut,
      saleOff: numberSaleOff,
      categoryId: Number(categoryId),
      image: imageUpload,
      status: status,
      productConfigs: [
        {
          isRequired: isRequired,
          name: nameConfig,
          status: statusConfig,
          variants: variants,
        },
      ],
    });
    // const token = localStorage.getItem("token");
    // const res = await axios.post(
    //   "https://tech-api.herokuapp.com/v1/product/create",
    //   {
    //     description: des,
    //     name: name,
    //     price: price,
    //     isSaleOff: saleOff,
    //     isSoldOut: soldOut,
    //     saleOff: numberSaleOff,
    //     categoryId: Number(categoryId),
    //     image: imageUpload,
    //     status: status,
    //     productConfigs: [
    //       {
    //         isRequired: isRequired,
    //         name: nameConfig,
    //         status: statusConfig,
    //         variants: variants,
    //       },
    //     ],
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    // if (res.data.result) {
    //   dispatch(updateVisibleFormProduct(false));
    //   notification.open({
    //     message: res.data.message,
    //     icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    //   });
    // }
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
  const handleFileSelected = (file: any) => {
    setImage(file);
  };
  const uploadImage = () => {
    if (!image) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${image.name}`);
      uploadBytesResumable(imageRef, image).then((res: UploadResult) => {
        setImageUpload(
          `https://firebasestorage.googleapis.com/v0/b/music-mp3-page.appspot.com/o/images%2F${image.name}?alt=media&token=16d7e53d-909a-484e-8481-f242d2e3a31f`
        );
      });
    }
  };

  const onChangeTabs = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `newTab${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: "Thuộc tính mới",
      children: <Variants></Variants>,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const remove = (targetKey: TargetKey) => {
    let newActiveKey = activeKey;
    let lastIndex = -1;
    items.forEach((item, i) => {
      if (item.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const newPanes = items.filter((item) => item.key !== targetKey);
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    setItems(newPanes);
    setActiveKey(newActiveKey);
  };

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: "add" | "remove"
  ) => {
    if (action === "add") {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <div>
      <Modal
        title={product.isEdit ? "Cập nhập sản phẩm" : "Tạo mới sản phẩm"}
        open={product.isVisibleFormProduct}
        onOk={handleOk}
        okType={"danger"}
        onCancel={handleCancel}
        width={1200}
      >
        <Form
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
          <Card className="mb-4" title="Thông tin chung">
            <Row>
              <Col span={12}>
                <Form.Item label="Tên sản phẩm" name="name">
                  <Input
                    {...register("name")}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <p className={styles.warning}>{errors.name?.message}</p>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá sản phẩm" name="price">
                  <InputNumber
                    style={{ width: 350 }}
                    onChange={(e: any) => setPrice(e)}
                  />
                  {/* <p className={styles.warning}>{errors.price?.message}</p> */}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Nhóm sản phẩm" name="category">
                  <Select
                    defaultValue="Chọn nhóm sản phẩm"
                    style={{ width: 200 }}
                    onChange={handleChange}
                    options={data}
                  />
                  <button
                    className="ml-2"
                    onClick={() => setCreateCategory(true)}
                  >
                    <PlusOutlined />
                  </button>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Sold out" name="soldOut">
                  <div className="ml-10">
                    <Switch
                      checked={false}
                      style={{ width: 50 }}
                      onChange={(e: boolean) => setSoldOut(e)}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="Sale Off" name="isSaleOff">
                  <Switch
                    checked={false}
                    style={{ width: 50 }}
                    onChange={(e: boolean) => setSaleOff(e)}
                  />
                </Form.Item>
              </Col>
              <Col span={8} hidden={!saleOff}>
                <Form.Item label="Giảm giá" name="saleOff">
                  <InputNumber
                    style={{ width: 200 }}
                    addonAfter="%"
                    onChange={(e: any) => setNumberSaleOff(e)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Trạng thái" name="status">
                  <Radio.Group
                    onChange={(e: RadioChangeEvent) => {
                      setStatus(e.target.value);
                    }}
                    value={status}
                  >
                    <Radio value={0}>Khoá</Radio>
                    <Radio value={1}>Mở</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Thông tin sản phẩm" name="description">
                  <TextArea rows={4} onChange={(e) => setDes(e.target.value)} />
                  {/* <p className={styles.warning}>{errors.description?.message}</p> */}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="image">
              <Upload
                listType="picture-card"
                onChange={(e) => handleFileSelected(e.file)}
              >
                {fileList.length >= 8 ? null : (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              <Button onClick={uploadImage}>Upload</Button>
            </Form.Item>
          </Card>
          <Card className="mb-4" title="Thông tin khác">
            <Row>
              <Col span={8}>
                <Form.Item label="Tên thuộc tính" name="nameConfig">
                  <Input
                    style={{ width: 150 }}
                    onChange={(e) => setNameConfig(e.target.value)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Bắt buộc hay không" name="isRequired">
                  <Switch
                    checked={false}
                    style={{ width: 50 }}
                    onChange={(e: boolean) => setIsRequired(e)}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Trạng thái" name="statusConfig">
                  <Radio.Group
                    onChange={(e: RadioChangeEvent) => {
                      setStatusConfig(e.target.value);
                    }}
                  >
                    <Radio value={0}>Khoá</Radio>
                    <Radio value={1}>Mở</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            <Tabs
              type="editable-card"
              onChange={onChangeTabs}
              activeKey={activeKey}
              onEdit={onEdit}
              items={items}
            />
          </Card>
        </Form>
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
              style={{ width: 200 }}
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
