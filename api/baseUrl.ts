import { pingServer } from "./api";

let mainUrl = process.env.REACT_APP_PROD_URL || "";
// mainUrl = process.env.REACT_APP_DEV_URL;
// mainUrl = "http://localhost";
const railwayBUPUrl = process.env.REACT_APP_BUP_URL;
const herokuBUPUrl = process.env.REACT_APP_HERO_URL;

const baseUrl = async () => {
  try {
    let result = await pingServer(mainUrl);
    if (result.status === 200) {
      return mainUrl;
    } else {
      return herokuBUPUrl;
    }
  } catch (error) {
    return herokuBUPUrl;
  }
};

export default baseUrl;