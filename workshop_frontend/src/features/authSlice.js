import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  return {
    token,
    role,
    isAuthenticated: !!token,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: getInitialState(),
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("role", action.payload.role);
    },
    logout: (state) => {
      state.token = null;
      state.role = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    setCredentials: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
  },
});

export const { loginSuccess, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
