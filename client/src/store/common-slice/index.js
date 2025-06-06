import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  "https://ecommerce-mern-khr6.onrender.com" || "http://localhost:5000";

const initialState = {
  isLoading: false,
  featureImageList: [],
  isError: false,
  errorMessage: "",
};

export const getFeatureImages = createAsyncThunk(
  "common/getFeatureImages",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/common/feature/get`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch feature images"
      );
    }
  }
);

export const addFeatureImage = createAsyncThunk(
  "common/addFeatureImage",
  async (image, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/common/feature/add`, {
        image,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add feature image"
      );
    }
  }
);

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.featureImageList = [];
        state.errorMessage = action.payload;
      })
      .addCase(addFeatureImage.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addFeatureImage.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optionally add the new image to the list
        state.featureImageList.push(action.payload.data);
      })
      .addCase(addFeatureImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default commonSlice.reducer;
