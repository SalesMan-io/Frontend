import { CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        position: "absolute",
        x: 0,
        y: 0,
        backgroundColor: "white",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </div>
  );
}
