import { pingServer } from "./api";

let mainUrl = process.env.NEXT_PUBLIC_PROD_URL || "";
// mainUrl = process.env.NEXT_PUBLIC_PROD_URL;
// mainUrl = "http://localhost";
const railwayBUPUrl = process.env.NEXT_PUBLIC_PROD_URL;

// const baseUrl = async () => {
//   try {
//     let result = await pingServer(mainUrl);
//     if (result.status === 200) {
//       return mainUrl;
//     } else {
//       return railwayBUPUrl;
//     }
//   } catch (error) {
//     return railwayBUPUrl;
//   }
// };

const baseUrl = mainUrl;

export default baseUrl;