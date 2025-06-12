import axios from "axios";

import { BASE_URL } from "../../src/utils/api_base_url_configration";

const token = localStorage.getItem("token");

const getConfig = () => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};
export const getStateServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "state/list", formData, getConfig());
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const addStateServ = async (formData) => {
  try {
    const response = await axios.post(BASE_URL + "state/create", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const updateStateServ = async (formData) => {
  try {
    const response = await axios.put(BASE_URL + "state/update", formData);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};
export const deleteStateServ = async (id) => {
  try {
    const response = await axios.delete(BASE_URL + "state/delete/"+id);
    return response;
  } catch (error) {
    // Handle error (e.g., log or throw an error)
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getCityServ = async (formData) => {
    try {
      const response = await axios.post(BASE_URL + "city/list", formData, getConfig());
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  export const addCityServ = async (formData) => {
    try {
      const response = await axios.post(BASE_URL + "city/create", formData);
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  
  export const updateCityServ = async (formData) => {
    try {
      const response = await axios.put(BASE_URL + "city/update", formData);
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  export const deleteCityServ = async (id) => {
    try {
      const response = await axios.delete(BASE_URL + "city/delete/"+id);
      return response;
    } catch (error) {
      // Handle error (e.g., log or throw an error)
      console.error("Error fetching data:", error);
      throw error;
    }
  };