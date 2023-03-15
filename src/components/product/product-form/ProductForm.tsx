import {
  Button,
  Card,
  Col,
  Form,
  FormInstance,
  Input,
  InputNumber,
  InputRef,
  Modal,
  notification,
  Popconfirm,
  Row,
  Select,
  Switch,
  Table,
  Upload,
} from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { updateVisibleFormProduct } from "@/redux/productSlice";
const { TextArea } = Input;
import * as yup from "yup";
import { ProductCreate } from "@/models/product";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./ProductForm.module.scss";
import {
  ref,
  UploadResult,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "@/utils/firebase";

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

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  name: string;
  description: string;
  address: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current!.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ProductForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const [formProduct, setFormProduct] = useState<ProductCreate>();
  const [name, setName] = useState("");
  const [des, setDes] = useState("");
  const [price, setPrice] = useState();
  const product = useSelector((state: any) => state.product);
  const [category, setCategory] = useState([]);
  const [saleOff, setSaleOff] = useState(false);
  const [status, setStatus] = useState(0);
  const [orderSort, setOrderSort] = useState(0);
  const [image, setImage] = useState<File>();
  const [imageUpload, setImageUpload] = useState("");
  const [numberSaleOff, setNumberSaleOff] = useState(0);
  const [soldOut, setSoldOut] = useState(false);
  const [tags, setTags] = useState("");
  const [createCategory, setCreateCategory] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [parentId, setParentId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [noteCategory, setNoteCategory] = useState("");
  const [nameConfig, setNameConfig] = useState("");
  const [required, setRequired] = useState<boolean>(false);
  const [statusConfig, setStatusConfig] = useState(0);
  const OPTIONS = [
    "Bảo mật vân tay",
    "Chống nước",
    "Sạc nhanh",
    "Sạc không dây",
    "Nhận diện khuôn mặt",
  ];
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const filteredOptions = OPTIONS.filter((o) => !selectedItems.includes(o));
  const [fileList, setFileList] = useState([]);
  const dispatch = useDispatch();
  const handleOk = async () => {
    console.log("create");
    console.log(errors.price);
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
        tags: "#my_hashtag",
        image: imageUpload,
        status: status,
        productConfigs: [
          {
            isRequired: required,
            name: nameConfig,
            status: statusConfig,
            variants: [
              {
                description: "string",
                image: "string",
                name: "string",
                orderSort: 0,
                price: 0,
                status: 0,
              },
            ],
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
      // console.log("Có ảnh nè");
    }
  };
  return (
    <div>
      <Modal
        title={product.isEdit ? "Cập nhập sản phẩm" : "Tạo mới sản phẩm"}
        open={product.isVisibleFormProduct}
        onOk={handleSubmit(handleOk)}
        okType={"danger"}
        onCancel={handleCancel}
        width={1200}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
        >
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
                  onClick={getCategory}
                  options={category}
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
                    style={{ width: 50 }}
                    onChange={(e: boolean) => setSoldOut(e)}
                  />
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={!saleOff ? 12 : 8}>
              <Form.Item label="Sale Off" name="isSaleOff">
                <Switch
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
            <Col span={!saleOff ? 12 : 8}>
              <Form.Item label="Trạng thái" name="status">
                <InputNumber
                  style={{ width: 200 }}
                  onChange={(e: any) => setStatus(e)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="Thông tin sản phẩm" name="description">
                <TextArea rows={4} onChange={(e) => setDes(e.target.value)} />
                {/* <p className={styles.warning}>{errors.description?.message}</p> */}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tags" name="tags">
                <Input
                  addonBefore="#"
                  onChange={(e) => console.log(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item>
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
          <Card className="mb-4" title="Other">
            <Row>
              <Col span={12}>
                <Form.Item label="Name config" name="nameConfig">
                  <Input onChange={(e: any) => setNameConfig(e.target.value)} />
                </Form.Item>
                <Form.Item label="Required" name="required">
                  <Switch
                    style={{ width: 50 }}
                    onChange={(e: boolean) => setRequired(e)}
                  />
                </Form.Item>
                <Form.Item label="Status" name="statusConfig">
                  <InputNumber
                    style={{ width: 350 }}
                    onChange={(e: any) => setStatusConfig(e)}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Row>
                  <Col span={8}>
                    <Form.Item label="Tên biến thể" name="name">
                      <Input onChange={(e) => setName(e.target.value)} />
                      {/* <p className={styles.warning}>{errors.name?.message}</p> */}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Giá biến thể" name="price">
                      <InputNumber onChange={(e: any) => setPrice(e)} />
                      {/* <p className={styles.warning}>{errors.price?.message}</p> */}
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Thông tin biến thể" name="description">
                      <TextArea onChange={(e) => setDes(e.target.value)} />
                      {/* <p className={styles.warning}>{errors.description?.message}</p> */}
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item label="Trạng thái" name="status">
                      <InputNumber onChange={(e: any) => setStatus(e)} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="Order Sort" name="orderSort">
                      <InputNumber onChange={(e: any) => setOrderSort(e)} />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
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
