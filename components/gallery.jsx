import { Grid } from "@mui/material";
import { GalleryImage } from "./galleryImage";
import { useEffect, useState } from "react";

export function Gallery({ galleryData, store, customerId }) {
  const redirectUrl =
    typeof window !== "undefined" &&
    window.location.protocol + "//" + window.location.host;

  const [aspectRatios, setAspectRatios] = useState(
    Array(galleryData.length).fill(0)
  );

  const [mostCommonAspectRatio, setMostCommonAspectRatio] = useState(0);

  useEffect(() => {
    if (aspectRatios.every((ratio) => ratio !== 0)) {
      const counts = {};
      aspectRatios.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });
      const countsArray = Object.values(counts);
      if (countsArray.length) {
        const mostCommonAspectRatio = countsArray.reduce((a, b) =>
          countsArray[a] > counts[b] ? a : b
        );
        console.log(mostCommonAspectRatio)
        setMostCommonAspectRatio(Math.min(1, mostCommonAspectRatio));
      }
    }
  }, [aspectRatios]);

  return (
    <Grid container spacing={2}>
      {galleryData.map((data, i) => {
        return (
          <Grid item xs={12} sm={4} md={3} lg={2} xl={2} key={i}>
            <div
              key={i}
              style={styles.productContainer}
              onClick={() => {
                window.open(
                  `${redirectUrl}/link/${data.link}/${store}/${customerId}`,
                  "_blank"
                );
              }}
            >
              <GalleryImage
                data={data}
                index={i}
                mostCommonAspectRatio={mostCommonAspectRatio}
                setAspectRatios={setAspectRatios}
              />
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

const styles = {
  productContainer: {
    borderWidth: 0,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    backgroundColor: "transparent",
    cursor: "pointer",
  },
};
