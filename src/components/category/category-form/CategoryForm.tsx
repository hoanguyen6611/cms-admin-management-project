import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Radio,
  Row,
  Select,
  Upload,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
const { TextArea } = Input;
import {
  CheckOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditCategoryForm,
  updateIsVisibleFormCategory,
} from "@/redux/category/categorySlice";
import { RootState } from "@/redux/store";
import { ref, UploadResult, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/utils/firebase";
import type { RadioChangeEvent } from "antd";
import useSWR, { mutate } from "swr";
import { Category } from "@/models";
import Context from "@/store/Context";
import { actions, useStoreContext } from "@/store";

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

const CategoryForm = () => {
  const [form] = Form.useForm();
  const categorySelector = useSelector((state: RootState) => state.category);
  const [state, dispatchs] = useStoreContext();
  const { data, error } = useSWR("product-category/list", fetcher);
  const { data: category } = useSWR(
    `https://tech-api.herokuapp.com/v1/product-category/get/${state.idCategory}`,
    fetchers
  );
  const [createCategory, setCreateCategory] = useState(false);
  const [id, setId] = useState<number>();
  const [name, setName] = useState("hello");
  const [parentId, setParentId] = useState("");
  const [status, setStatus] = useState(1);
  const [orderSort, setOrderSort] = useState(0);
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState<File>();
  const [iconUpload, setIconUpload] = useState("");
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    setId(category?.id);
    setStatus(category?.status);
    setOrderSort(category?.orderSort);
    setNote(category?.note);
    setIconUpload(category?.icon);
    form.setFieldsValue({
      nameCategory: category?.name,
      parentId: category?.parentId,
      note: category?.note,
      status: category?.status,
      orderSort: category?.orderSort,
      id: category?.id
    });
  }, [category]);

  const createCategoryForm = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product-category/create",
      {
        name: name,
        note: note,
        orderSort: orderSort,
        status: status,
        icon: iconUpload,
        parentId: parentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(updateIsVisibleFormCategory(false));
      dispatchs(actions.changeVisibleFormCategory(false));
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    }
  };
  const updateCategory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/product-category/update",
      {
        name: name,
        note: note,
        orderSort: orderSort,
        status: status,
        icon: iconUpload,
        id: id,
        parentId: parentId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.data.result) {
      dispatch(updateIsVisibleFormCategory(false));
      dispatchs(actions.changeVisibleFormCategory(false));
      form.resetFields();
      notification.open({
        message: res.data.message,
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
    } else {
      notification.open({
        message: res.data,
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };

  const handleOk = async () => {
    console.log(form.getFieldsValue());
    if (id) {
      updateCategory();
    } else {
      createCategoryForm();
    }
  };
  const cancelCreateCategory = () => {
    dispatch(updateIsVisibleFormCategory(false));
    dispatch(isEditCategoryForm(false));
    dispatchs(actions.changeVisibleFormCategory(false));
    setValueForm();
  };
  const handleFileSelected = (file: any) => {
    setIcon(file);
  };
  const setValueForm = () => {
    setName("");
    setId(0);
    setStatus(1);
    setOrderSort(0);
    setNote("");
    setIconUpload("");
  };
  const uploadImage = () => {
    if (!icon) {
      notification.open({
        message: "Upload ảnh chưa thành công",
      });
    } else {
      const imageRef = ref(storage, `images/${icon.name}`);
      uploadBytesResumable(imageRef, icon).then((res: UploadResult) => {
        setIconUpload(
          `https://firebasestorage.googleapis.com/v0/b/music-mp3-page.appspot.com/o/images%2F${icon.name}?
          alt=media&token=16d7e53d-909a-484e-8481-f242d2e3a31f`
        );
      });
    }
  };
  return (
    <div>
      <Modal
        title={
          categorySelector.isEdit
            ? "Cập nhập danh mục sản phẩm"
            : "Tạo mới danh mục sản phẩm"
        }
        open={state.isVisibleFormCategory}
        okType={"danger"}
        onOk={handleOk}
        onCancel={cancelCreateCategory}
        width={800}
      >
        <Form
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên danh mục"
                name="nameCategory"
                rules={[
                  {
                    required: true,
                    message: "Tên danh mục là trường bắt buộc",
                  },
                ]}
              >
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Danh mục cha" name="parentId">
                <div className="flex">
                  <Select
                    defaultValue={
                      category ? category : "Chọn nhóm danh mục cha"
                    }
                    onChange={(e) => setParentId(e)}
                    options={data}
                  />
                  <button
                    className="ml-2"
                    onClick={() => setCreateCategory(true)}
                  >
                    <PlusOutlined />
                  </button>
                </div>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item
                label="Order Sort"
                name="orderSort"
                initialValue={orderSort}
              >
                <InputNumber
                  style={{ width: 200 }}
                  onChange={(e: any) => setOrderSort(e)}
                  value={orderSort}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Ghi chú" name="note" initialValue={note}>
                <TextArea
                  value={note}
                  rows={4}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
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
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryForm;
