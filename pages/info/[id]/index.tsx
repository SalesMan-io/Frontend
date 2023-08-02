import { useRouter } from "next/router";
import Header from "../../../components/header";
import { useEffect, useState } from "react";
import { getLinkInfo } from "../../../api/api";
import Link from "next/link";

export default function PostPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const [redirectUrl, setRedirectUrl] = useState("");
  const [data, setData] = useState({ url: "", clicksCount: 0 });
  useEffect(() => {
    setRedirectUrl(
      window.location.protocol + "//" + window.location.host + "/link/" + id
    );
    if (id) {
      (async () => {
        const result = await getLinkInfo(id);
        setData(result?.data);
      })();
    }
  }, [id]);

  return (
    <>
      <Header />
      <h1>
        Affiliate Link: <Link href={redirectUrl}>{redirectUrl}</Link>
      </h1>
      <p>
        Business Url: <Link href={data.url}>{data.url}</Link>
      </p>
      <p>Clicks: {data.clicksCount}</p>
    </>
  );
}
