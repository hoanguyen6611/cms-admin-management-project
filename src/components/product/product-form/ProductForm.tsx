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
  Table,
  Divider,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
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
import { Category, Variant } from "@/models";
import { v4 } from "uuid";
import { actions, useStoreContext } from "@/store";
import { VND } from "@/utils/formatVNĐ";
import { ColumnsType } from "antd/es/table";

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
var variants: Variant[] = [];
var storeList: any = [];
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
const fetcherList = async () => {
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
    data.price = data.price;
  });
  return res.data.data.data;
};
const Variant = (props: any) => {
  const { state, dispatch } = useStoreContext();
  const [id, setId] = useState();
  useEffect(() => {
    setId(props.value?.id);
    form.setFieldsValue({
      name: props.value?.name,
      price: props.value?.price,
      image: props.value?.image,
      status: props?.status,
      color: props.value?.color,
    });
  }, [props]);
  const listProductInStore = props.value?.variantStockDtoList.map(
    (item: any) => {
      return {
        ...item,
        key: item.addressDetails,
        value: item.name,
      };
    }
  );
  const [form] = Form.useForm();
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [price, setPrice] = useState(0);
  const [imageUpload, setImageUpload] = useState<File>();
  const [status, setStatus] = useState(0);
  const [importProduct, setImportProduct] = useState<boolean>(false);
  const handleFileSelected = (file: any) => {
    setImageUpload(file.target.files[0]);
  };
  const variantOk = () => {
    if (id) {
      updateVariant();
    } else {
      addVariant();
    }
  };
  const updateVariant = async () => {};
  const addVariant = async () => {
    if (!imageUpload) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          const vaf = form.getFieldsValue();
          delete vaf.importProduct;
          variant = {
            ...vaf,
            image: url,
            description: "",
          };
          variants.push(variant);
        });
      });
    }
  };
  const columns: ColumnsType<any> = [
    {
      title: "Chi nhánh",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tồn kho",
      dataIndex: "totalInStock",
      key: "totalInStock",
    },
    {
      title: "Số lượng nhập",
      dataIndex: "storeId",
      key: "action",
      render: (record) => {
        return (
          <>
            <InputNumber
              onChange={(e: any) => {
                storeList.push({
                  storeId: record,
                  quantity: e,
                  variantId: props.value?.id,
                });
              }}
              className="mr-2"
            ></InputNumber>
          </>
        );
      },
    },
  ];
  const columnsNoImport: ColumnsType<any> = [
    {
      title: "Chi nhánh",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Tồn kho",
      dataIndex: "totalInStock",
      key: "totalInStock",
    },
  ];
  const addNumberOfProduct = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/import/request-import",
      {
        importItems: storeList,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      setImportProduct(false);
      notification.open({
        message: "Tạo yêu cầu nhập hàng thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      storeList = [];
      console.log(storeList);
    } else {
      notification.open({
        message: "Tạo yêu cầu nhập hàng thất bại",
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  return (
    <div>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
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
            <Form.Item label="Mã màu" name="color">
              <Input
                style={{ width: 200 }}
                onChange={(e) => setColor(e.target.value)}
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
              <Image
                hidden={!props.value?.image}
                width={250}
                src={props.value?.image}
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
      <Row className="pt-4">
        <Col span={17}></Col>
        <Col span={7}>
          <Button onClick={variantOk}>
            {state.isEditFormProduct ? "Cập nhật" : "Thêm màu"}
          </Button>
        </Col>
      </Row>
      <Divider />
      <div hidden={!state.isEditFormProduct}>
        <h4 className="text-center font-bold text-xl p-2">Quản lý tồn kho</h4>
        <Row>
          <Col span={17}></Col>
          <Col span={7}>
            <Form.Item label="Nhập hàng" name="importProduct">
              <Switch
                checked={importProduct}
                style={{ width: 50 }}
                onChange={(checked: boolean) => setImportProduct(checked)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Table
          size="small"
          columns={importProduct ? columns : columnsNoImport}
          dataSource={listProductInStore}
          pagination={false}
        />
        <Row className="pt-4" hidden={!importProduct}>
          <Col span={17}></Col>
          <Col span={7}>
            <Button onClick={addNumberOfProduct} key="submit" type="primary">
              Nhập hàng
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

const ProductForm = () => {
  const [form] = Form.useForm();
  const { data, error } = useSWR("/product-category", fetcher);
  const { state, dispatch } = useStoreContext();
  const { data: productList, mutate } = useSWR("/product", fetcherList);

  const { data: productItem } = useSWR(
    state?.idProduct
      ? `https://tech-api.herokuapp.com/v1/product/get/${state?.idProduct}`
      : null,
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
  const initialItems = [
    { label: "Thuộc tính 1", children: <Variant></Variant>, key: "1" },
  ];
  const [items, setItems] = useState(initialItems);
  const [activeKey, setActiveKey] = useState(initialItems[0].key);
  const [statusButton, setStatusButton] = useState<boolean>(false);
  const [variantsList, setVariantsList] = useState();
  const [idConfig, setIdConfig] = useState();

  useEffect(() => {
    setId(productItem?.id);
    setImage(productItem?.image);
    setVariantsList(productItem?.productConfigs[0]?.variants);
    setIdConfig(productItem?.productConfigs[0]?.id);
    setSaleOff(productItem?.isSaleOff);
    setSoldOut(productItem?.isSoldOut);
    form.setFieldsValue({
      name: productItem?.name,
      description: productItem?.description,
      price: productItem?.price,
      soldOut: productItem?.isSoldOut,
      isSaleOff: productItem?.isSaleOff,
      saleOff: productItem?.saleOff,
      status: productItem?.status,
      image: productItem?.image,
      categoryId: productItem?.productCategoryId,
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
        variants.push(item);
        return {
          label: item.name,
          children: (
            <Variant value={item} status={productItem?.status}></Variant>
          ),
          key: item.id,
        };
      })
    : [];
  const [activeKeyUpdate, setActiveKeyUpdate] = useState(variantList[0]?.key);

  const newTabIndex = useRef(2);
  const createProduct = async (urlImage: string) => {
    const product = {
      ...form.getFieldsValue(),
      image: urlImage,
      productConfigs: [
        {
          name: "Màu sắc",
          status: 1,
          variants: variants,
        },
      ],
    };
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product/create",
      product,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      form.resetFields();
      dispatch(actions.changeVisibleFormProduct(false));
      dispatch(actions.changeEditFormProduct(false));
      setStatusButton(false);
      notification.open({
        message: "Thêm sản phẩm thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      variants = [];
      mutate();
    } else {
      setStatusButton(false);
      notification.open({
        message: "Thêm sản phẩm thất bại",
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  const updateProduct = async () => {
    const productUpdate = {
      ...form.getFieldsValue(),
      id: id,
      image: image,
      isSoldOut: true,
      productConfigs: [
        {
          id: idConfig,
          name: "Màu sắc",
          status: 1,
          variants: variantsList,
        },
      ],
    };
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/product/update",
      productUpdate,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      form.resetFields();
      dispatch(actions.changeVisibleFormProduct(false));
      dispatch(actions.changeEditFormProduct(false));
      setStatusButton(false);
      notification.open({
        message: "Cập nhật thông tin sản phẩm thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      mutate();
    } else {
      setStatusButton(false);
      notification.open({
        message: "Cập nhật thông tin sản phẩm thất bại",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const uploadImageProduct = async () => {
    if (!imageUpload) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
      return;
    } else {
      const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then((url) => {
          console.log(url);
          setImage(url);
          return url;
        });
      });
    }
  };
  const handleOk = async () => {
    if (id) {
      setStatusButton(true);
      updateProduct();
    } else {
      if (!imageUpload) {
        notification.open({
          message: "Upload ảnh chưa thành công",
        });
        return;
      } else {
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        await uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((url) => {
            setStatusButton(true);
            createProduct(url);
          });
        });
      }
    }
  };

  const handleCancel = () => {
    form.resetFields();
    dispatch(actions.changeVisibleFormProduct(false));
    dispatch(actions.changeEditFormProduct(false));
    dispatch(actions.setIdProductForm(0));
    variants = [];
  };
  const handleChange = (value: string) => {
    setCategoryId(value);
  };
  const handleChangeParent = (value: string) => {
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
        message: "Tạo danh mục thành công",
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    } else {
      notification.open({
        message: "Tạo danh mục thất bại",
        icon: <WarningOutlined style={{ color: "red" }} />,
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
        title={
          state.isEditFormProduct ? "Cập nhật sản phẩm" : "Tạo mới sản phẩm"
        }
        open={state.isVisibleFormProduct}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Huỷ
          </Button>,
          <Button
            disabled={statusButton}
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            {state.isEditFormProduct ? "Cập nhật" : "Tạo mới"}
          </Button>,
        ]}
      >
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
                      checked={soldOut}
                      style={{ width: 50 }}
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
                    checked={saleOff}
                    style={{ width: 50 }}
                    onChange={(checked: boolean) => setSaleOff(checked)}
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
          <Card className="mb-4" title="Màu sắc">
            <Tabs
              type="editable-card"
              onChange={onChangeTabs}
              activeKey={state.isEditFormProduct ? activeKeyUpdate : activeKey}
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
