import {
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
  Tabs,
  Image,
  Button,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
const { TextArea } = Input;
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./ProductForm.module.scss";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "@/utils/firebase";
import type { RadioChangeEvent } from "antd";
import useSWR, { mutate } from "swr";
import { Variant } from "@/models";
import { v4 } from "uuid";
import { actions, useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";

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
var variant: any = {};
const list = async () => {
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
  res.data.data.data.map((data: any) => {
    data.value = data.id;
    data.label = data.name;
  });
  return res.data.data.data;
};
const fetchers = async (url: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.data;
};
const Variant = (props: any) => {
  console.log(props);
  useEffect(() => {
    form.setFieldsValue({
      name: props.value?.name,
      description: props.value?.description,
      price: props.value?.price,
      status: props.value?.status,
    });
  }, [props]);
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [imageUpload, setImageUpload] = useState<File>();
  const [status, setStatus] = useState(0);
  const uploadImageProduct = async () => {
    if (!imageUpload) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          setImage(url);
        });
      });
    }
  };
  // const addVariant = () => {
  //   uploadImageProduct();
  //   variants.push({ ...form.getFieldsValue(), image: image });
  //   console.log(variants);
  // };
  const handleFileSelected = (file: any) => {
    setImageUpload(file.target.files[0]);
  };
  return (
    <div>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
        onChange={() => {
          variant = form.getFieldsValue();
        }}
      >
        <Row>
          <Col span={8}>
            <Form.Item label="Tên" name="name">
              <Input
                style={{ width: 200 }}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Thông tin" name="description">
              <Input
                style={{ width: 200 }}
                onChange={(e) => setDes(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Giá" name="price">
              <InputNumber
                style={{ width: 200 }}
                onChange={(e: any) => setPrice(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name="image">
              <Button className="p-4 border-none">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleFileSelected(e)}
                />
              </Button>
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
      {/* <Button onClick={addVariant}>Thêm</Button> */}
    </div>
  );
};
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const ProductForm = () => {
  const [form] = Form.useForm();
  const { data, error } = useSWR("/product-category", fetcher);
  const { state, dispatch } = useStoreContext();
  const { data: productItem } = useSWR(
    `https://tech-api.herokuapp.com/v1/product/get/${state?.idProduct}`,
    fetchers
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [id, setId] = useState<number>();
  const [name, setName] = useState<string>("");
  const [des, setDes] = useState<string>("");
  const [price, setPrice] = useState<any>();
  const [saleOff, setSaleOff] = useState<boolean>(false);
  const [soldOut, setSoldOut] = useState<boolean>(false);
  const [status, setStatus] = useState(1);
  const [image, setImage] = useState("");
  const [imageUpload, setImageUpload] = useState<File>();
  const [numberSaleOff, setNumberSaleOff] = useState(0);
  const [createCategory, setCreateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [parentId, setParentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [variantsUpdate, setVariantsUpdate] = useState<any>([]);
  const initialItems = [
    { label: "Thuộc tính 1", children: <Variant></Variant>, key: "1" },
  ];
  const [items, setItems] = useState(initialItems);
  // const [itemsUpdate, setItemsUpdate] = useState(initialItemsUpdate);
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [nameConfig, setNameConfig] = useState("");
  const [statusConfig, setStatusConfig] = useState(1);

  useEffect(() => {
    setId(productItem?.id);
    // setVariantsUpdate(productItem?.productConfigs[0]?.variants);
    // console.log(variantsUpdate);
    // console.log(variant);
    // setVariantsUpdate(variant);
    // console.log(variantsUpdate);
    form.setFieldsValue({
      name: productItem?.name,
      description: productItem?.description,
      price: productItem?.price,
      soldOut: productItem?.soldOut,
      isSaleOff: productItem?.isSaleOff,
      saleOff: productItem?.saleOff,
      status: productItem?.status,
      image: productItem?.image,
      categoryId: productItem?.productCategoryName,
      statusConfig: productItem?.productConfigs
        ? productItem?.productConfigs[0]?.status
        : "",
      nameConfig: productItem?.productConfigs
        ? productItem?.productConfigs[0]?.name
        : "",
    });
  }, [productItem]);
  const variantList = productItem?.productConfigs
    ? productItem?.productConfigs[0]?.variants.map((item: any) => {
        return {
          // ...item,
          label: item.name,
          children: <Variant value={item}></Variant>,
          key: item.id,
        };
      })
    : [];
  const [activeKeyUpdate, setActiveKeyUpdate] = useState(
    variantList ? variantList[0]?.key : ""
  );
  console.log(variantList);
  const newTabIndex = useRef(2);
  const createProduct = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product/create",
      {
        ...form.getFieldsValue(),
        image: image,
        productConfigs: [
          {
            name: form.getFieldsValue().nameConfig,
            status: form.getFieldsValue().statusConfig,
            variants: variants,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate("/product-category", list, true);
    } else {
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const updateProduct = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/product/update",
      {
        ...form.getFieldsValue(),
        id: id,
        image: image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const uploadImageProduct = async () => {
    if (!imageUpload) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          setImage(url);
        });
      });
    }
  };
  const handleOk = async () => {
    if (id) {
      updateProduct();
      dispatch(actions.changeVisibleFormProduct(false));
      dispatch(actions.changeEditFormProduct(false));
    } else {
      uploadImageProduct();
      createProduct();
      dispatch(actions.changeVisibleFormProduct(false));
      dispatch(actions.changeEditFormProduct(false));
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(actions.changeVisibleFormProduct(false));
    dispatch(actions.changeEditFormProduct(false));
    dispatch(actions.setIdProductForm(0));
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
      setCreateCategory(false);
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const handleFileSelected = (file: any) => {
    setImageUpload(file.target.files[0]);
  };

  const onChangeTabs = (newActiveKey: string) => {
    setActiveKey(newActiveKey);
  };

  const add = () => {
    const newActiveKey = `${newTabIndex.current++}`;
    const newPanes = [...items];
    newPanes.push({
      label: `Thuộc tính ${newActiveKey}`,
      children: <Variant></Variant>,
      key: newActiveKey,
    });
    setItems(newPanes);
    setActiveKey(newActiveKey);
    variants.push(variant);
    console.log(variants);
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
  const a = {
    id: 229,
    key: 229,
    label: "Xám",
    name: "Xám",
    price: 11390000,
    status: 1,
  };
  return (
    <div>
      <Modal
        title={
          state.isEditFormProduct ? "Cập nhập sản phẩm" : "Tạo mới sản phẩm"
        }
        open={state.isVisibleFormProduct}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Huỷ
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {state.isEditFormProduct ? "Cập nhập" : "Tạo mới"}
          </Button>,
        ]}
      >
        {/* <Variant value={a}></Variant> */}
        <Form
          labelCol={{ span: 9 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Card className="mb-4" title="Thông tin chung">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="Tên sản phẩm" name="name">
                  <Input
                    {...register("name")}
                    style={{ width: 300 }}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {/* <p className={styles.warning}>{errors.name?.message}</p> */}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá sản phẩm" name="price">
                  <InputNumber
                    style={{ width: 300 }}
                    onChange={(e: any) => setPrice(e)}
                  />
                  {/* <CurrencyInput
                    name="currencyInput"
                    id="currencyInput"
                    data-number-to-fixed="2"
                    data-number-stepfactor="100"
                    allowDecimals
                    decimalsLimit={2}
                    disableAbbreviations
                    className="p-2"
                    placeholder="Nhập giá sản phẩm"
                    onChange={(value) => setPrice(Number(value))}
                  /> */}
                  {/* <p className={styles.warning}>{errors.price?.message}</p> */}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="Nhóm sản phẩm" name="categoryId">
                  <Select
                    defaultValue="Chọn nhóm sản phẩm"
                    style={{ width: 300 }}
                    onChange={handleChange}
                    options={data}
                  />
                  {/* <button
                    className="ml-2"
                    onClick={() => setCreateCategory(true)}
                  >
                    <PlusOutlined />
                  </button> */}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Đã bán hết" name="isSoldOut">
                  <div className="ml-10">
                    <Switch
                      style={{ width: 50 }}
                      defaultChecked={false}
                      onChange={(checked: boolean) => {
                        setSoldOut(checked);
                      }}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item label="Giảm giá" name="isSaleOff">
                  <Switch
                    style={{ width: 50 }}
                    onChange={(checked: boolean) => setSaleOff(checked)}
                    defaultChecked={false}
                  />
                </Form.Item>
              </Col>
              <Col span={8} hidden={!saleOff}>
                <Form.Item label="Phần trăm giảm" name="saleOff">
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
                <Form.Item label="Chi tiết" name="description">
                  <TextArea rows={4} onChange={(e) => setDes(e.target.value)} />
                  {/* <p className={styles.warning}>{errors.description?.message}</p> */}
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="image">
              <Image
                hidden={!state.isEditFormProduct}
                width={250}
                src={productItem?.image}
                alt="image"
              ></Image>
              <Button className="p-4 border-none">
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleFileSelected(e)}
                />
              </Button>
            </Form.Item>
          </Card>
          <Card className="mb-4" title="Thông tin thuộc tính">
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
              items={state.isEditFormProduct ? variantList : items}
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
              options={data}
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
