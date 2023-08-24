import { useEffect, useState } from "react";
import { Gallery } from "../../components/gallery";
import { getPartners } from "../../api/api";
import { useRouter } from "next/router";
import { Button, Divider } from "@mui/material";
import Loading from "../../components/loading";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function PostPurchasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [galleryData, setGalleryData] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [orderId, setOrderId] = useState("");
  const [storeName, setStoreName] = useState("");
  const store = router.query.store;

  useEffect(() => {
    if (!store) return;
    getProducts().then((data) => {
      setDiscountCode(data.suppliers[0].discountCode);
      setSupplier(data.suppliers[0].name);
      setGalleryData(data.suppliers[0].products);
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
      <h1>Checkout these products from {supplier}</h1>
      <p>
        These are some of our favourite products from our partnered stores.{" "}
        {discountCode && (
          <text>
            Use the code <text style={{ color: "red" }}>{discountCode}</text> to
            enjoy special discounts!
          </text>
        )}
      </p>
      <br />
      {loading && <Loading />}
      <Gallery
        galleryData={galleryData}
        supplier={supplier}
        customerId={orderId}
      />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
