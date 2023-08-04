import axios from "axios";
import baseUrl from "./baseUrl";

const pingServer = async (baseUrl: String) => {
  return await axios.get(`${baseUrl}`, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  });
};

const createLink = async (url: String) => {
  try {
    return await axios.post(
      `${await baseUrl()}/link/create`,
      {
        url: url,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const getLinkInfo = async (id: String) => {
  try {
    return await axios.get(`${await baseUrl()}/link/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const incrementLinkClicks = async (id: String) => {
  try {
    return await axios.post(
      `${await baseUrl()}/link/incrementClicks`,
      {
        id: id,
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export { pingServer, createLink, getLinkInfo, incrementLinkClicks };