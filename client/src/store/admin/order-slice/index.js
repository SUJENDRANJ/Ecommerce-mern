import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Use environment variable for base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  orderList: [],
  orderDetails: null,
  isLoading: false,
  isError: false,
  errorMessage: "",
};

// Async thunk to get all orders for admin
export const getAllOrdersForAdmin = createAsyncThunk(
  "order/getAllOrdersForAdmin",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/orders/get`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// Async thunk to get details of one order by id
export const getOrderDetailsForAdmin = createAsyncThunk(
  "order/getOrderDetailsForAdmin",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/orders/details/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

// Async thunk to update order status
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/orders/update/${id}`,
        { orderStatus },
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update order"
      );
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all orders
      .addCase(getAllOrdersForAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.orderList = [];
        state.errorMessage = action.payload;
      })

      // Get order details
      .addCase(getOrderDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetailsForAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.orderDetails = null;
        state.errorMessage = action.payload;
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;

        const updatedOrder = action.payload.data;

        // Update orderList with the updated order
        state.orderList = state.orderList.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );

        // Update orderDetails if currently viewed order matches
        if (state.orderDetails && state.orderDetails._id === updatedOrder._id) {
          state.orderDetails = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export const { resetOrderDetails } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
