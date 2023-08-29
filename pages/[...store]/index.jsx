import { useEffect, useState } from "react";
import { Gallery } from "../../components/gallery";
import { getPartners } from "../../api/api";
import { useRouter } from "next/router";
import {
  Button,
  Divider,
  TextField,
} from "@mui/material";
import Loading from "../../components/loading";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function PostPurchasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [galleryData, setGalleryData] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [storeName, setStoreName] = useState("");
  const [timer, setTimer] = useState(300);
  const [width, setWidth] = useState(0);
  const [discountCode, setDiscountCode] = useState("");
  const store = router.query.store;
  const totalProductCount = 12;

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
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    if (!store) return;
    getProducts().then((data) => {
      console.log(data)
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
      setGalleryData(galleryData);
      setDiscountCode(data.suppliers[0].discountCode);
      setStoreName(data.name);
      setLoading(false);
    });
  }, [store]);

  useEffect(() => {
    setOrderId(router.query.orderId);
  }, [router.query]);

  const getProducts = async () => {
    const result = await getPartners(store[0]);
    return result.data;
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
    const interval = setInterval(() => {
      setTimer((timer) => {
        if (timer <= 0) {
          window.location = "https://" + store.join("/");
        }
        return timer - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={inter.className} style={{ margin: 20 }}>
      <h1>{storeName}</h1>
      <h2>You've paid for your order</h2>
      <Button
        style={{ textTransform: "none" }}
        onClick={() => {
          window.location = "https://" + store.join("/");
        }}
      >
        View order confirmation {">"}
      </Button>
      <Divider />
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <div>
          <h1>Checkout these limited deals!</h1>
          <p>
            These are some of our favourite products from our partnered stores.{" "}
            {discountCode && (
              <text>
                Use the code{" "}
                <text style={{ color: "red" }}>{discountCode}</text> to enjoy
                special discounts!
              </text>
            )}
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
      <Gallery galleryData={galleryData} customerId={orderId} />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
