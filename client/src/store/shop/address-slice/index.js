import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  isLoading: false,
  addressList: [],
  isError: false,
  errorMessage: "",
};

export const addNewAddress = createAsyncThunk(
  "addresses/addNewAddress",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/shop/address/add`,
        formData
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add new address"
      );
    }
  }
);

export const fetchAllAddresses = createAsyncThunk(
  "addresses/fetchAllAddresses",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/address/get/${userId}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch addresses"
      );
    }
  }
);

export const editAddress = createAsyncThunk(
  "addresses/editAddress",
  async ({ userId, addressId, formData }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/shop/address/update/${userId}/${addressId}`,
        formData
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update address"
      );
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "addresses/deleteAddress",
  async ({ userId, addressId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/shop/address/delete/${userId}/${addressId}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete address"
      );
    }
  }
);

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add New Address
      .addCase(addNewAddress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addNewAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addNewAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // Fetch All Addresses
      .addCase(fetchAllAddresses.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload.data;
      })
      .addCase(fetchAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.addressList = [];
        state.errorMessage = action.payload;
      })

      // Edit Address
      .addCase(editAddress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(editAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(editAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })

      // Delete Address
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deleteAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default addressSlice.reducer;
