import { Permission } from "@/models/permission";
import { createSlice } from "@reduxjs/toolkit";

export interface permissionGroupState {
  isVisibleChangePermissionGroup: boolean;
  isEdit: boolean;
  idSelected?: number;
}

const initialState: permissionGroupState = {
  isVisibleChangePermissionGroup: false,
  isEdit: false,
};

export const permissionGroupSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    updateIsVisibleFormPermissionGroup: (state, action) => {
      state.isVisibleChangePermissionGroup = action.payload;
    },
    updateIsEdit: (state, action) => {
      state.isEdit = action.payload;
    },
    setIdSelected: (state, action) => {
      state.idSelected = action.payload;
    },
  },
});
export default permissionGroupSlice.reducer;
export const { updateIsVisibleFormPermissionGroup, updateIsEdit, setIdSelected } =
  permissionGroupSlice.actions;
