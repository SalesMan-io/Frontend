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
      `${baseUrl}/link/create`,
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
    return await axios.get(`${baseUrl}/link/${id}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    });
  } catch (error) {
    console.log(error);
  }
};

const incrementLinkClicks = async (id: String[]) => {
  try {
    return await axios.post(
      `${baseUrl}/link/incrementClicks`,
      {
        id: id[0],
        customerId: id.length > 1 ? id.slice(1).join("/") : "",
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

const getPartners = async (domain: String, orderId: String) => {
  try {
    return await axios.get(
      orderId
        ? `${baseUrl}/partner/getPartner/${domain}/${orderId}`
        : `${baseUrl}/partner/getPartner/${domain}/null}`,
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

const logUnloadPage = async (domain: String, orderId: String) => {
  try {
    return await axios.post(
      `${baseUrl}/partner/pageUnloaded`,
      {
        shopifyId: domain,
        orderId: orderId,
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

export {
  pingServer,
  createLink,
  getLinkInfo,
  incrementLinkClicks,
  getPartners,
  logUnloadPage,
};
