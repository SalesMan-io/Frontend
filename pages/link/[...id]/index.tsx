import { useRouter } from "next/router";
import { useEffect } from "react";
import { incrementLinkClicks } from "../../../api/api";

export default function RedirectPage() {
  const router = useRouter();
  const id = router.query.id as string[];
  useEffect(() => {
    if (id) {
      (async () => {
        const result = await incrementLinkClicks(id);
        window.location.href = result?.data.url;
      })();
    }
  }, [id]);

  return <>redirecting...</>;
}
