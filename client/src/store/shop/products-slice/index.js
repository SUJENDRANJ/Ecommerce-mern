import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  isError: false,
  errorMessage: "",
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "products/fetchAllFilteredProducts",
  async ({ filterParams, sortParams }, thunkAPI) => {
    try {
      const query = new URLSearchParams({
        ...filterParams,
        sortBy: sortParams,
      }).toString();

      const result = await axios.get(
        `${API_BASE_URL}/api/shop/products/get?${query}`
      );

      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch products"
      );
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id, thunkAPI) => {
    try {
      const result = await axios.get(
        `${API_BASE_URL}/api/shop/products/get/${id}`
      );
      return result.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch product details"
      );
    }
  }
);

const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null;
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload?.data || [];
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || action.error.message;
        state.productList = [];
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload?.data || null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || action.error.message;
        state.productDetails = null;
      });
  },
});

export const { clearProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
