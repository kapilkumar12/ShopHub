import API from "./api";

// register
export const registerUser = async(data) =>{
    const res = await API.post("/auth/sign-up", data)
    return res.data
}

// Login
export const loginUser = async(data) =>{
    const res = await API.post("/auth/login", data)
    return res.data
}

// Verify otp
export const verifyOtp = async(data) =>{
    const res = await API.post("/auth/verify-otp", data)
    return res.data
}

// Resend otp
export const resendOtp = async(data) =>{
    const res = await API.post("/auth/resend-otp", data)
    return res.data
}

// get user
export const getProfile = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

// logout
export const logoutUser = async(data) =>{
    const res = await API.get("/auth/logout", data)
    return res.data
}