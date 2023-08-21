import Image from "next/image";
import { useEffect, useState } from "react";

export function GalleryImage({ data }) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [name, setName] = useState(data.name);
  const [description, setDescription] = useState(data.description);

  const adjustToScreenSize = () => {
    setTimeout(() => {
      wrapString({ name: data.name }, 1, setName);
      wrapString({ description: data.description }, 3, setDescription);
    }, 0);
  };

  window.addEventListener("resize", () => {
    adjustToScreenSize();
  });

  setTimeout(() => {
    adjustToScreenSize();
  }, 0);

  const wrapString = (text, lineLimit, setText) => {
    const varToString = (varObj) => Object.keys(varObj)[0];
    const stringVariable = varToString(text);
    const clientWidth =
      size.width && document.getElementById("description").clientWidth;
    const font = getCanvasFont(document.getElementById(stringVariable));
    const stringArray = text[stringVariable].split(" ");
    const lineArray = [];
    for (let i = 0; i < stringArray.length; i++) {
      if (lineArray.length > lineLimit) {
        break;
      }
      const possibleLine =
        lineArray[lineArray.length - 1] + " " + stringArray[i];
      if (
        lineArray.length &&
        getTextWidth(possibleLine, font) < clientWidth - 25
      ) {
        lineArray[lineArray.length - 1] = possibleLine;
      } else {
        lineArray.push(stringArray[i]);
      }
    }
    if (lineArray.length > lineLimit) {
      const lastLine = lineArray[lineLimit - 1] + " " + lineArray[lineLimit];
      for (let i = 0; i < lastLine.length; i++) {
        const truncatedString =
          lastLine.substring(0, lastLine.length - i) + "...";
        if (getTextWidth(truncatedString, font) < clientWidth - 25) {
          lineArray[lineLimit - 1] = truncatedString;
          break;
        }
      }
    }
    setText(lineArray.slice(0, lineLimit).join(" "));
  };

  const getTextWidth = (text, font) => {
    const canvas =
      getTextWidth.canvas ||
      (getTextWidth.canvas = document.createElement("canvas"));
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  };

  const getCssStyle = (element, prop) => {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
  };

  const getCanvasFont = (el = document.body) => {
    const fontWeight = getCssStyle(el, "font-weight") || "normal";
    const fontSize = getCssStyle(el, "font-size") || "16px";
    const fontFamily = getCssStyle(el, "font-family") || "Times New Roman";

    return `${fontWeight} ${fontSize} ${fontFamily}`;
  };

  const getDiscount = (price, discount) => {
    return price - (price * discount) / 100;
  };

  return (
    <div>
      {size && !size.width && !size.height ? (
        <Image
          loader={() => data.image}
          src={data.image}
          layout="fill"
          objectFit="contain"
          onLoadingComplete={({ naturalWidth, naturalHeight }) => {
            setSize({ width: naturalWidth, height: naturalHeight });
          }}
        />
      ) : (
        <Image
          loader={() => data.image}
          src={data.image}
          width={size.width}
          height={size.height}
        />
      )}
      <div style={styles.productInfo}>
        <h2 id={"name"} style={styles.infoText}>
          {name}
        </h2>
        <h3 style={styles.infoText}>{data.supplier}</h3>
        {data.discountPercent ? (
          <>
            <h4 style={styles.infoText}>
              <s style={{ color: "grey" }}>{formatter.format(data.price)}</s>{" "}
              <text style={{ color: "red" }}>
                {formatter.format(
                  getDiscount(data.price, data.discountPercent)
                )}
              </text>
            </h4>
          </>
        ) : (
          <h4 style={styles.infoText}>{formatter.format(data.price)}</h4>
        )}
        <p id={"description"} style={styles.infoText}>
          {description}
        </p>
      </div>
    </div>
  );
}

const styles = {
  productInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 10,
  },
  infoText: {
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "left",
  },
};
