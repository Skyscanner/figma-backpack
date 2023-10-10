import { BpkColors } from "../tokens/colors";

function rgbValueToHex(value: number) {
    return Math.floor(value * 255)
      .toString(16)
      .padStart(2, "0");
  }
  
export function buildColorString(paint: Paint) {
    let color;
    if (paint.type === "SOLID") {
      color = `#${rgbValueToHex(paint.color.r)}${rgbValueToHex(
        paint.color.g
      )}${rgbValueToHex(paint.color.b)}` as any;
      color = color.toUpperCase();
      let bpkColor =
        Object.values(BpkColors)[Object.keys(BpkColors).indexOf(color)];
      if (bpkColor) {
        color = `BpkTheme.colors.` + bpkColor;
      }
      return color;
    }
    return "BpkTheme.colors.textPrimary";
  }
  