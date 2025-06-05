import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const initialState = {
  cartItems: [],
  isLoading: false,
  isError: false,
  errorMessage: "",
};

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/shop/cart/add`, {
        userId,
        productId,
        quantity,
      });
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (userId, thunkAPI) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/shop/cart/get/${userId}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart items"
      );
    }
  }
);

export const deleteCartItem = createAsyncThunk(
  "cart/deleteCartItem",
  async ({ userId, productId }, thunkAPI) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/api/shop/cart/${userId}/${productId}`
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete cart item"
      );
    }
  }
);

export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/shop/cart/update-cart`,
        {
          userId,
          productId,
          quantity,
        }
      );
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update cart quantity"
      );
    }
  }
);

const shoppingCartSlice = createSlice({
  name: "shoppingCart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(fetchCartItems.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
        state.cartItems = [];
      })
      .addCase(updateCartQuantity.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      })
      .addCase(deleteCartItem.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(deleteCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload.data;
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload;
      });
  },
});

export default shoppingCartSlice.reducer;
