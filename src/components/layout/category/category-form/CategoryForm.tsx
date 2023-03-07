import { Button, Form, Input, Modal, notification, Select } from "antd";
import React, { useState } from "react";
const { TextArea } = Input;
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  isEditCategoryForm,
  updateIsVisibleFormCategory,
} from "@/redux/categorySlice";
import { RootState } from "@/redux/store";
import { useCreateCategoryMutation } from "../category.service";

const CategoryForm = () => {
  const [createCategory, setCreateCategory] = useState(false);
  const [id, setId] = useState();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState([]);
  const dispatch = useDispatch();
  const categorySelector = useSelector((state: RootState) => state.category);
  const [createCategorys, createCategoryResult] = useCreateCategoryMutation();
  const createFormCategory = async () => {
    await createCategorys({
      name: name,
      note: note,
      orderSort: 0,
      status: 0,
    }).unwrap();
    dispatch(updateIsVisibleFormCategory(false));
    // const token = localStorage.getItem("token");
    // if (id) {
    //   const res = await axios.put(
    //     "https://tech-api.herokuapp.com/v1/product-category/update",
    //     {
    //       name: name,
    //       note: note,
    //       orderSort: 0,
    //       status: 0,
    //       id: id,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   if (res.data.result) {
    //     getCategory();
    //     dispatch(updateIsVisibleFormCategory(false));
    //     getCategory();
    //     notification.open({
    //       message: res.data.message,
    //       icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    //     });
    //   }
    // } else {
    //   const res = await axios.post(
    //     "https://tech-api.herokuapp.com/v1/product-category/create",
    //     {
    //       name: name,
    //       note: note,
    //       orderSort: 0,
    //       status: 0,
    //     },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     }
    //   );
    //   if (res.data.result) {
    //     getCategory();
    //     dispatch(updateIsVisibleFormCategory(false));
    //     getCategory();
    //     notification.open({
    //       message: res.data.message,
    //       icon: <CheckOutlined style={{ color: "#52c41a" }} />,
    //     });
    //   }
    // }
  };
  const cancelCreateCategory = () => {
    dispatch(updateIsVisibleFormCategory(false));
    dispatch(isEditCategoryForm(false));
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
  const getCategorySelected = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `https://tech-api.herokuapp.com/v1/product-category/get/${categorySelector.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(res.data.data);
    setName(res.data.data.name);
    setNote(res.data.data.note);
  };
  return (
    <div>
      <Modal
        title={
          categorySelector.isEdit
            ? "Cập nhập danh mục sản phẩm"
            : "Tạo mới danh mục sản phẩm"
        }
        open={categorySelector.isVisibleFormCategory}
        okType={"danger"}
        onOk={createFormCategory}
        onCancel={cancelCreateCategory}
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
            <Input
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Danh mục cha" name="parentId">
            <div className="flex">
              <Select
                defaultValue="Chọn nhóm danh mục cha"
                onChange={(e) => setParentId(e)}
                options={category}
              />
              <button className="ml-2" onClick={() => setCreateCategory(true)}>
                <PlusOutlined />
              </button>
            </div>
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <TextArea
              value={note}
              rows={4}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryForm;
