import { Permission } from "@/models/permission";
import { createSlice } from "@reduxjs/toolkit";

export interface permissionState {
  isVisibleFormPermission: boolean;
  permission: Permission[];
}

const initialState: permissionState = {
  isVisibleFormPermission: false,
  permission: [],
};

export const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    updateIsVisibleFormPermission: (state, action) => {
      state.isVisibleFormPermission = action.payload;
    },
  },
});
export default permissionSlice.reducer;
export const { updateIsVisibleFormPermission } = permissionSlice.actions;
