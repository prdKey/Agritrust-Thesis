import axios from "axios";

const PSGC_BASE = "https://psgc.cloud/api/v2";

export const getPangasinanCities = async () => {
  const res = await axios.get(`${PSGC_BASE}/provinces/0105500000/cities-municipalities`);
  return res.data;
};

export const getBarangaysByCity = async (cityCode) => {
  const res = await axios.get(`${PSGC_BASE}/cities-municipalities/${cityCode}/barangays`);
  return res.data;
};
