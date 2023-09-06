import { useEffect, useState } from "react";

export default function Logo({ storeName, store, height }) {
  const [hasLogo, setHasLogo] = useState(true);
  useEffect(() => {
    setHasLogo(true);
  }, [store]);
  return hasLogo ? (
    <img
      src={`/${store}.png`}
      height={height}
      style={{
        cursor: "pointer",
        objectFit: "contain",
      }}
      onClick={() => {
        window.open("https://" + store, "_blank");
      }}
      onError={() => {
        setHasLogo(false);
      }}
    />
  ) : (
    <h1 style={{ textAlign: "center", display: "inline-block" }}>
      {storeName}
    </h1>
  );
}
