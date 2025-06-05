import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Use environment variable for API base URL (set this in your build system or .env file)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  approvalURL: null,
  isLoading: false,
  isError: false,
  errorMessage: "",
  orderId: null,
  orderList: [],
  orderDetails: null,
};

export const createNewOrder = createAsyncThunk(
  "order/createNewOrder",
  async (orderData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shop/order/create`,
        orderData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create order"
      );
    }
  }
);

export const capturePayment = createAsyncThunk(
  "order/capturePayment",
  async ({ paymentId, payerId, orderId }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shop/order/capture`,
        {
          paymentId,
          payerId,
          orderId,
        }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to capture payment"
      );
    }
  }
);

export const getAllOrdersByUserId = createAsyncThunk(
  "order/getAllOrdersByUserId",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/shop/order/list/${userId}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch orders"
      );
    }
  }
);

export const getOrderDetails = createAsyncThunk(
  "order/getOrderDetails",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/shop/order/details/${id}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch order details"
      );
    }
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrder",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
    resetApprovalURL: (state) => {
      state.approvalURL = null;
    },
    clearError: (state) => {
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // createNewOrder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "currentOrderId",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload || action.error.message || "Failed to create order";
        state.approvalURL = null;
        state.orderId = null;
      })

      // capturePayment
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.isLoading = false;
        // Update order status if needed here
      })
      .addCase(capturePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload || action.error.message || "Failed to capture payment";
      })

      // getAllOrdersByUserId
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data || [];
      })
      .addCase(getAllOrdersByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload || action.error.message || "Failed to fetch orders";
        state.orderList = [];
      })

      // getOrderDetails
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data || null;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage =
          action.payload ||
          action.error.message ||
          "Failed to fetch order details";
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails, resetApprovalURL, clearError } =
  shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
