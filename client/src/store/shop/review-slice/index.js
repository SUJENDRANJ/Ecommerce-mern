import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  isLoading: false,
  reviews: [],
  isError: false,
  errorMessage: "",
};

export const addReview = createAsyncThunk(
  "review/addReview",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/shop/review/add`,
        formData
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Failed to add review"
      );
    }
  }
);

export const getReviews = createAsyncThunk(
  "review/getReviews",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/shop/review/${id}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch reviews"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.isError = false;
      state.errorMessage = "";
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data || [];
      })
      .addCase(getReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || action.error.message;
        state.reviews = [];
      })

      .addCase(addReview.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.isLoading = false;
        // Optional: push new review to reviews array if returned
        if (action.payload?.data) {
          state.reviews.push(action.payload.data);
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || action.error.message;
      });
  },
});

export const { clearReviews } = reviewSlice.actions;

export default reviewSlice.reducer;
