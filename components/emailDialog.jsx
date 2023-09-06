import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Logo from "./logo";
import { useEffect, useState } from "react";
import { addEmail, logEvent } from "../api/api";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function EmailDialog({ suppliers, store, storeName, orderId }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [width, setWidth] = useState(0);
  const handleClose = async () => {
    setOpen(false);
    await logEvent(store, orderId, "Email Dialog Closed");
  };
  const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

  const handleJoin = () => {
    if (email && email.match(isValidEmail)) {
      setError("");
      addEmail(store, email);
      handleClose();
    } else {
      setError("Please enter a valid email address");
    }
  };

  useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
    setTimeout(() => {
      setOpen(true);
    }, 3000);
  }, []);

  return (
    <Dialog className={inter.className} open={open} onClose={handleClose}>
      <CloseIcon
        variant="text"
        onClick={handleClose}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          margin: 10,
          cursor: "pointer",
        }}
      >
        x
      </CloseIcon>
      <DialogTitle
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <Logo store={store} storeName={storeName} height={50} />
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
        }}
      >
        <h2>
          Claim more exclusive offers and discounts from our partnered stores!
        </h2>
        <FormGroup>
          {suppliers.map((supplier) => (
            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label={supplier.name}
            />
          ))}
        </FormGroup>
        <br />
        <text style={{ color: "red" }}>{error}</text>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <TextField
            autoFocus
            id="email"
            type="email"
            placeholder="Email Address"
            variant="outlined"
            style={{
              display: "flex",
              flexGrow: 1,
            }}
            sx={{ fieldset: { borderColor: "black !important" } }}
            InputProps={{
              style: { borderRadius: 0 },
            }}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />
          <Button
            variant="contained"
            onClick={handleJoin}
            style={{
              borderRadius: 0,
              backgroundColor: "black",
              color: "white",
            }}
          >
            {width > 600 ? "Claim Now" : "Claim"}
          </Button>
        </div>
        <br />
        <br />
        <br />
        <Button
          style={{ textTransform: "none", color: "grey" }}
          onClick={handleClose}
        >
          No thanks
        </Button>
      </DialogContent>
    </Dialog>
  );
}
