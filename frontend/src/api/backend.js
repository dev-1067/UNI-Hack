import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const processProduct = async (partNum, partDesc, brand) => {
  try {
    const response = await api.post('/process', {
      mfg_part_num: partNum,
      part_desc: partDesc,
      e1_brand: brand,
      unilog_brand: brand,
      dib_brand: brand,
      part_manuf: brand
    });
    return response.data;
  } catch (error) {
    console.error("Backend Error:", error);
    throw error;
  }
};
