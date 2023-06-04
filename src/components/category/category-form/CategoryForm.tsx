import {
  Button,
  Col,
  Form,
  Image,
  Input,
  Modal,
  notification,
  Radio,
  Row,
} from "antd";
import React, { useEffect, useState } from "react";
const { TextArea } = Input;
import {
  CheckOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/utils/firebase";
import type { RadioChangeEvent } from "antd";
import useSWR from "swr";
import { actions, useStoreContext } from "@/store";
import { v4 } from "uuid";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./CategoryForm.module.scss";

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
    data.key = data.id;
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
const schema = yup.object({
  name: yup.string().required("Trường tên là trường bắt buộc"),
});
type FormData = yup.InferType<typeof schema>;

const CategoryForm = () => {
  const [form] = Form.useForm();
  const { state, dispatch } = useStoreContext();
  const { data, error, mutate } = useSWR("/product-category", fetcher);
  const { data: category } = useSWR(
    state.idCategory
      ? `https://tech-api.herokuapp.com/v1/product-category/get/${state.idCategory}`
      : null,
    fetchers
  );
  const [id, setId] = useState<number>();
  const [name, setName] = useState("");
  const [status, setStatus] = useState(1);
  const [note, setNote] = useState("");
  const [icon, setIcon] = useState("");
  const [iconUpload, setIconUpload] = useState<File>();
  const [fileList, setFileList] = useState([]);
  const [statusButton, setStatusButton] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    setId(category?.id);
    setIcon(category?.icon);
    form.setFieldsValue({
      name: category?.name,
      parentId: category?.parentId,
      note: category?.note,
      status: category?.status,
      orderSort: category?.orderSort,
      id: category?.id,
    });
  }, [category]);

  const createCategoryForm = async (url: string) => {
    setStatusButton(true);
    const token = localStorage.getItem("token");
    const res = await axios.post(
      "https://tech-api.herokuapp.com/v1/product-category/create",
      {
        ...form.getFieldsValue(),
        icon: url,
        orderSort: 0,
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
        message: 'Tạo danh mục sản phẩm thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      dispatch(actions.changeVisibleFormCategory(false));
      dispatch(actions.changeEditFormCategory(false));
      setStatusButton(false);
      mutate();
    } else {
      notification.open({
        message: 'Tạo danh mục sản phẩm thất bại',
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };
  const updateCategory = async () => {
    setStatusButton(true);
    const token = localStorage.getItem("token");
    const res = await axios.put(
      "https://tech-api.herokuapp.com/v1/product-category/update",
      {
        ...form.getFieldsValue(),
        id: id,
        icon: icon,
        orderSort: 0,
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
        message: 'Cập nhật thông tin danh mục thành công',
        icon: <CheckOutlined style={{ color: "#52c41a" }} />,
      });
      dispatch(actions.changeVisibleFormCategory(false));
      dispatch(actions.changeEditFormCategory(false));
      setStatusButton(false);
      mutate();
    } else {
      notification.open({
        message: 'Cập nhật thông tin danh mục thất bại',
        icon: <WarningOutlined style={{ color: "red" }} />,
      });
    }
  };

  const handleOk = async () => {
    if (id) {
      updateCategory();
    } else {
      if (!iconUpload) {
        notification.open({
          message: "Upload ảnh chưa thành công",
        });
        return;
      } else {
        const imageRef = ref(storage, `images/${iconUpload.name + v4()}`);
        await uploadBytes(imageRef, iconUpload).then(async (snapshot) => {
          await getDownloadURL(snapshot.ref).then((url) => {
            createCategoryForm(url);
          });
        });
      }
    }
  };
  const cancelCreateCategory = () => {
    form.resetFields();
    dispatch(actions.changeVisibleFormCategory(false));
    dispatch(actions.changeEditFormCategory(false));
  };
  const handleFileSelected = (file: any) => {
    setIconUpload(file.target.files[0]);
  };
  return (
    <div>
      <Modal
        title={
          state.isEditFormCategory
            ? "Cập nhật danh mục sản phẩm"
            : "Tạo mới danh mục sản phẩm"
        }
        open={state.isVisibleFormCategory}
        onOk={handleOk}
        onCancel={cancelCreateCategory}
        width={800}
        footer={[
          <Button key="back" onClick={cancelCreateCategory}>
            Huỷ
          </Button>,
          <Button
            disabled={statusButton}
            key="submit"
            type="primary"
            onClick={handleOk}
          >
            {state.isEditFormCategory ? "Cập nhật" : "Thêm mới"}
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          form={form}
        >
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item
                label="Tên danh mục"
                required
                name="name"
              >
                <Input
                  // {...register("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {/* <p className={styles.warning}>{errors.name?.message}</p> */}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item required label="Trạng thái" name="status">
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
              <Form.Item required label="Ghi chú" name="note" initialValue={note}>
                <TextArea
                  value={note}
                  rows={4}
                  onChange={(e) => setNote(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={0}>
            <Col span={24}>
              <Form.Item required label="Hình ảnh">
                <Image
                  hidden={!state.isEditFormCategory}
                  width={150}
                  src={category?.icon}
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
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryForm;
