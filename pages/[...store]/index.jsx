import { useEffect, useState } from "react";
import { Gallery } from "../../components/gallery";
import { getPartners, logUnloadPage } from "../../api/api";
import { Button, Divider, TextField } from "@mui/material";
import Loading from "../../components/loading";
import { Inter } from "next/font/google";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import posthog from "posthog-js";
import baseUrl from "../../api/baseUrl";

const inter = Inter({ subsets: ["latin"] });

export default function PostPurchasePage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [galleryData, setGalleryData] = useState([]);
  const [storeName, setStoreName] = useState("");
  const [timer, setTimer] = useState(300);
  const [width, setWidth] = useState(0);
  const store = searchParams.get("store");
  const thankYouUrl = store
    ? "https://" + searchParams.getAll("store").join("/")
    : "";
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (!store) {
      return;
    }
    getProducts().then((data) => {
      setGalleryData(data.galleryData);
      setStoreName(data.name);
      setLoading(false);
    });
    window.addEventListener('pagehide', () => {
      fetch(`${baseUrl}/partner/pageUnloaded`, {
        keepalive: true,
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
        },
        body: JSON.stringify({ shopifyId: store, orderId: orderId }),
      });
    });
  }, [store]);

  useEffect(() => {
    posthog.init("phc_2ae7wkmYFn97yhwqRkyfk186LsRqsVBeNYN2RfDfXKt", {
      api_host: "https://app.posthog.com",
    });
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  const getProducts = async () => {
    try {
      const result = await getPartners(store, orderId);
      return result.data;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const Timer = ({ seconds }) => {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return (
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <TextField
          defaultValue={minute < 10 ? "0" + minute : minute}
          InputProps={{
            readOnly: true,
            style: { fontSize: 30, margin: 10, width: 60 },
          }}
          size={"small"}
        />
        <text style={{ fontSize: 30 }}>:</text>
        <TextField
          defaultValue={second < 10 ? "0" + second : second}
          InputProps={{
            readOnly: true,
            style: { fontSize: 30, margin: 10, width: 60 },
          }}
          size={"small"}
        />
      </div>
    );
  };

  const timerText = (seconds) => {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${minute < 10 ? "0" + minute : minute} : ${
      second < 10 ? "0" + second : second
    }`;
  };

  useEffect(() => {
    if (!thankYouUrl) {
      return;
    }
    const interval = setInterval(() => {
      setTimer((timer) => {
        if (timer <= 0) {
          navigateToThankYou();
        }
        return Math.max(0, timer - 1);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [thankYouUrl]);

  const navigateToThankYou = async () => {
    await logUnloadPage(store, orderId);
    // window.location.href = thankYouUrl;
  };

  return (
    <div className={inter.className} style={{ margin: 20 }}>
      {/* <h1>{"Enerhealth"}</h1> */}
      <Image
        loader={() =>
          "https://enerhealthbotanicals.com/cdn/shop/files/New_Enerhealth_Logo_-_transparent_bkgd_1440_x_345_px_1_300x300_d1d5c59a-b1a6-4cfe-9f21-0d3ff709d40c.png?v=1683618248&width=300"
        }
        src={
          "https://enerhealthbotanicals.com/cdn/shop/files/New_Enerhealth_Logo_-_transparent_bkgd_1440_x_345_px_1_300x300_d1d5c59a-b1a6-4cfe-9f21-0d3ff709d40c.png?v=1683618248&width=300"
        }
        width={306}
        height={70}
        style={{
          marginLeft: -25,
        }}
      />
      <h2>You've paid for your order</h2>
      <Button style={{ textTransform: "none" }} onClick={navigateToThankYou}>
        View order confirmation {">"}
      </Button>
      <Divider />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div>
          <h1>You've earned these exclusive offers!</h1>
          <p>Checkout these products from our partnered stores. </p>
          {width <= 600 && (
            <p>
              Limited time offer expires in <b>{timerText(timer)}</b>
            </p>
          )}
        </div>
        {width > 600 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexGrow: 1,
              marginLeft: 20,
            }}
          >
            <h3>Limited time offer expires in:</h3>
            <Timer seconds={timer} />
          </div>
        )}
      </div>
      {loading && <Loading />}
      <Gallery galleryData={galleryData} store={store} customerId={orderId} />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
