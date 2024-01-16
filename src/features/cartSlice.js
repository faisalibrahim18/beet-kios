import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [], // Data keranjang belanja
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action) => {
      // Menambahkan item ke keranjang
      state.items.push(action.payload);
    },
    removeItem: (state, action) => {
      // Menghapus item dari keranjang
      state.items = state.items.filter((item) => item.id !== action.payload.id);
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;

export default cartSlice.reducer;
