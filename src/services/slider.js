import API from "./api";

export const getSliders = async(params)=>{
  const res = await API.get("/hero-slider", { params });
  return res.data;
}