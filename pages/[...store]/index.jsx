import { useEffect, useState } from "react";
import { Gallery } from "../../components/gallery";
import { getPartners } from "../../api/api";
import { useRouter } from "next/router";
import { Button } from "@mui/material";
import Loading from "../../components/loading";

export default function PostPurchasePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [galleryData, setGalleryData] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [orderId, setOrderId] = useState("");
  const store = router.query.store;
  console.log(router.query)

  useEffect(() => {
    if (!store) return;
    getProducts().then((data) => {
      setDiscountCode(data.suppliers[0].discountCode);
      setSupplier(data.suppliers[0].name);
      setGalleryData(data.suppliers[0].products);
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
    <div>
      <h1 level={1}>Checkout these products from {supplier}</h1>
      <p>These are some of our favourite products from our partnered stores</p>
      {discountCode && (
        <p>
          Use the code <text style={{ color: "red" }}>{discountCode}</text> to
          enjoy special discounts
        </p>
      )}
      <br />
      {loading && <Loading />}
      <Gallery
        galleryData={galleryData}
        supplier={supplier}
        customerId={orderId}
      />
      <br />
      <br />
      <Button
        onClick={() => {
          window.location = "https://" + store.join("/");
        }}
      >
        Continue to order status page
      </Button>
      <br />
      <br />
    </div>
  );
}
