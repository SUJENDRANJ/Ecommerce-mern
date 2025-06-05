import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  isLoading: false,
  searchResults: [],
  isError: false,
  errorMessage: "",
};

export const getSearchResults = createAsyncThunk(
  "search/getSearchResults",
  async (keyword, thunkAPI) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/shop/search/${keyword}`
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch search results"
      );
    }
  }
);

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
      state.isError = false;
      state.errorMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResults.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(getSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data || [];
      })
      .addCase(getSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || action.error.message;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
