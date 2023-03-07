import { Permission } from "@/models/permission";
import { createSlice } from "@reduxjs/toolkit";

export interface permissionState {
  isVisibleFormPermission: boolean;
  permission: Permission[];
  user: any;
}

const initialState: permissionState = {
  isVisibleFormPermission: false,
  permission: [],
  user: {},
};

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    updateIsVisibleFormPermission: (state, action) => {
      state.isVisibleFormPermission = action.payload;
    },
    setUserLogin: (state, action) => {
      state.user = action.payload;
    },
  },
});
export default permissionSlice.reducer;
export const { updateIsVisibleFormPermission, setUserLogin } =
  permissionSlice.actions;
