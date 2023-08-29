import { Grid } from "@mui/material";
import { GalleryImage } from "./galleryImage";

export function Gallery({ galleryData, customerId }) {
  const redirectUrl =
    typeof window !== "undefined" &&
    window.location.protocol + "//" + window.location.host;

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
                  `${redirectUrl}/link/${data.link}/${customerId}`,
                  "_blank"
                );
              }}
            >
              <GalleryImage data={data} />
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
