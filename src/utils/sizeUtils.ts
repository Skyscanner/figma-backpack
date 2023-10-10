import { BpkSpacing } from '../tokens/spacing';

export type UnitType = "dp" | "px" | "rem" | "remAs10px";

export function buildSizeStringByUnit(
  pixelValue: number,
  type: UnitType
): string {
  if (type === "px") {
    return pixelValue + "px";
  }
  if (type === "dp") {
    return pixelValue + ".dp";
  }
  if (type === "rem") {
    return pixelValue / 16 + "rem";
  }
  return pixelValue / 10 + "rem";
}

export function buildBpkPaddingValue(
  pixelValue: number,
  type: UnitType
): string {
  let bpkKey = Object.keys(BpkSpacing)[Object.values(BpkSpacing).indexOf(pixelValue)]
  if(bpkKey){
    return 'BpkSpacing.'+bpkKey;
  }
  if (type === "px") {
    return pixelValue + "px";
  }
  if (type === "dp") {
    return pixelValue + ".dp";
  }
  if (type === "rem") {
    return pixelValue / 16 + "rem";
  }
  return pixelValue / 10 + "rem";
}
