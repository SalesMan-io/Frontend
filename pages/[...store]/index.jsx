import { useEffect, useState } from "react";
import { Gallery } from "../../components/gallery";
import { getPartners } from "../../api/api";
import { Button, Divider, TextField } from "@mui/material";
import Loading from "../../components/loading";
import { Inter } from "next/font/google";
import { useSearchParams } from "next/navigation";

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
  const totalProductCount = 12;
  const orderId = searchParams.get("orderId");

  const getRandom = (arr, n) => {
    var len = arr.length;
    n = Math.max(Math.min(n, len), 0);
    var result = new Array(n);
    var taken = new Array(len);
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  useEffect(() => {
    if (!store) {
      return;
    }
    getProducts().then((data) => {
      const supplierProductCount = Math.floor(
        totalProductCount / data.suppliers.length
      );
      const galleryData = [];
      data.suppliers.forEach((supplier) => {
        const products = getRandom(supplier.products, supplierProductCount);
        products.forEach((product) => {
          product.supplier = supplier.name;
          product.discountCode = supplier.discountCode;
        });
        galleryData.push(...products);
      });
      if (galleryData.length < totalProductCount) {
        const remaining = totalProductCount - galleryData.length;
        const products = getRandom(
          data.suppliers[data.suppliers.length - 1].products.filter(
            (item) => !galleryData.includes(item)
          ),
          remaining
        );
        products.forEach((product) => {
          product.supplier = data.suppliers[data.suppliers.length - 1].name;
          product.discountCode =
            data.suppliers[data.suppliers.length - 1].discountCode;
        });
        galleryData.push(...products);
      }
      galleryData.sort((a, b) => {
        return -(a.discountPercent - b.discountPercent);
      });
      setGalleryData(galleryData);
      setStoreName(data.name);
      setLoading(false);
    });
  }, [store]);

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  const getProducts = async () => {
    try {
      const result = await getPartners(store);
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

  const navigateToThankYou = () => {
    window.location.href = thankYouUrl;
  };

  return (
    <div className={inter.className} style={{ margin: 20 }}>
      <h1>{storeName}</h1>
      <h2>You've paid for your order</h2>
      <Button style={{ textTransform: "none" }} onClick={navigateToThankYou}>
        View order confirmation {">"}
      </Button>
      <Divider />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div>
          <h1>You've earned these exclusive deals!</h1>
          <p>
            Checkout these products from our partnered stores.{" "}
          </p>
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
