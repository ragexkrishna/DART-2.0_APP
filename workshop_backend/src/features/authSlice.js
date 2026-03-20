import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../api/axios"

const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
  user: user || null,
  loading: false,
  error: null
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {

    try {

      const response = await api.post("/auth/login", data)

      localStorage.setItem("user", JSON.stringify(response.data))

      return response.data

    } catch (error) {

      return thunkAPI.rejectWithValue(error.response.data)

    }

  }
)

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {

    try {

      const response = await api.post("/auth/register", data)

      return response.data

    } catch (error) {

      return thunkAPI.rejectWithValue(error.response.data)

    }

  }
)

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    logout: (state) => {

      state.user = null
      localStorage.removeItem("user")

    }

  },

  extraReducers: (builder) => {

    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

  }

})

export const { logout } = authSlice.actions

export default authSlice.reducer