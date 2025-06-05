import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL from environment variable
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  isLoading: false,
  isError: false,
  errorMessage: "",
  productList: [],
};

// Add new product
export const addNewProduct = createAsyncThunk(
  "products/addNewProduct",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/admin/products/add`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// Fetch all products
export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/products/get`, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Edit a product
export const editProduct = createAsyncThunk(
  "products/editProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/admin/products/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to edit product"
      );
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/admin/products/delete/${id}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

const AdminProductsSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch All
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.productList = [];
        state.errorMessage = action.payload;
      })

      // Add Product
      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addNewProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // Edit Product
      .addCase(editProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(editProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default AdminProductsSlice.reducer;
