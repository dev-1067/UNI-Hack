import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const processProduct = async (brand, partNumber, pdfPath = null) => {
  try {
    const response = await api.post('/process', {
      brand,
      part_number: partNumber,
      pdf_path: pdfPath
    });
    return response.data;
  } catch (error) {
    console.error("Backend Error:", error);
    throw error;
  }
};
