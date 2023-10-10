import { BpkTypography } from '../tokens/typography';
import { BpkSpacing } from '../tokens/spacing';
import { buildSizeStringByUnit, UnitType, buildBpkPaddingValue } from "./sizeUtils";
import { kebabToCamelCase } from "./stringUtils";
import { buildColorString } from './colorUtils';
import { isImageNode } from "./isImageNode";

export type Property = {
  name: string;
  value: string | number;
}

export type Config = {
  className: string;
  properties: Property[];
};

export function findProperty(properties: Property[] | undefined, key: string) {
  return properties?.find(prop => prop.name === key)?.value;
}

const justifyContentRowValues = {
  MIN: "Alignment.Start",
  MAX: "Alignment.End",
  CENTER: "Alignment.CenterVertically",
  SPACE_BETWEEN: "Alignment.CenterVertically",
};

const justifyContentColumnValues = {
  MIN: "Alignment.Start",
  MAX: "Alignment.End",
  CENTER: "Alignment.CenterHorizontally",
  SPACE_BETWEEN: "Alignment.CenterHorizontally",
};

const textAlignValues = {
  LEFT: "Start",
  RIGHT: "End",
  CENTER: "Center",
  JUSTIFIED: "Justify",
};

const textDecorationValues = {
  UNDERLINE: "Underline",
  STRIKETHROUGH: "LineThrough",
};

export function getConfigForTag(
  node: SceneNode,
  unitType: UnitType
): Config | null {
  const properties: Config["properties"] = [];

  // skip vector since it's often displayed as an img tag
  if (node.visible && node.type !== "VECTOR") {
    if ("opacity" in node && (node?.opacity || 1) < 1) {
      properties.push({ name: "opacity", value: node.opacity || 1 });
    }
    if ("rotation" in node && node.rotation !== 0) {
      properties.push({ name: "transform", value: Math.floor(node.rotation) });
    }

    properties.push({
      name: "height",
      value: `${buildSizeStringByUnit(Math.floor(node.height), unitType)}`,
    });
    let width = (390 - Math.floor(node.width))  < 80 ? 'MAX' : `${buildSizeStringByUnit(Math.floor(node.width), unitType)}`;
    properties.push({
      name: "width",
      value: width,
    });

    if (
      node.type === "FRAME" ||
      node.type === "INSTANCE" ||
      node.type === "COMPONENT"
    ) {
      if (node.type == "INSTANCE" && node.componentProperties) {
        if (node.componentProperties.Style)
          properties.push({
            name: "style",
            value: `${node.componentProperties.Style.value}`,
          });
        if (node.componentProperties.Size)
          properties.push({
            name: "size",
            value: `${node.componentProperties.Size.value}`,
          });
        if (node.componentProperties.Type)
          properties.push({
            name: "type",
            value: `${node.componentProperties.Type.value}`,
          });
        if (node.componentProperties.Icon)
          properties.push({
            name: "iconPosition",
            value: `${node.componentProperties.Icon.value}`,
          });
      }

      if (node.layoutMode !== "NONE") {
        let isRow = node.layoutMode === "HORIZONTAL";
        properties.push({ name: "container", value: isRow ? "Row" : "Column" });
        properties.push({
          name: isRow ? "verticalAlignment" : "horizontalAlignment",
          value: isRow
            ? justifyContentRowValues[node.primaryAxisAlignItems]
            : justifyContentColumnValues[node.primaryAxisAlignItems],
        });

        if (
          node.paddingTop === node.paddingBottom &&
          node.paddingTop === node.paddingLeft &&
          node.paddingTop === node.paddingRight
        ) {
          if (node.paddingTop > 0) {
            properties.push({
              name: "padding",
              value: `${buildBpkPaddingValue(node.paddingTop, unitType)}`,
            });
          }
        } else if (
          node.paddingTop === node.paddingBottom &&
          node.paddingLeft === node.paddingRight
        ) {
          properties.push({
            name: "paddingVertical",
            value: `${buildBpkPaddingValue(node.paddingTop, unitType)}`,
          });
          properties.push({
            name: "paddingHorizontal",
            value: `${buildBpkPaddingValue(node.paddingLeft, unitType)}`,
          });
        } else {
          properties.push({
            name: "paddingStart",
            value: `${buildBpkPaddingValue(node.paddingLeft, unitType)}`,
          });
          properties.push({
            name: "paddingEnd",
            value: `${buildBpkPaddingValue(node.paddingRight, unitType)}`,
          });
          properties.push({
            name: "paddingTop",
            value: `${buildBpkPaddingValue(node.paddingTop, unitType)}`,
          });
          properties.push({
            name: "paddingBottom",
            value: `${buildBpkPaddingValue(node.paddingBottom, unitType)}`,
          });
        }

        if (
          node.primaryAxisAlignItems !== "SPACE_BETWEEN" &&
          node.itemSpacing > 0
        ) {
          properties.push({
            name: isRow ? "horizontalArrangement" : "verticalArrangement",
            value:
              "Arrangement.spacedBy(" +
              buildSizeStringByUnit(node.itemSpacing, unitType) +
              ")",
          });
        }
      } 
      
      if (
        (node.fills as Paint[]).length > 0 &&
        (node.fills as Paint[])[0].type !== "IMAGE"
      ) {
        const paint = (node.fills as Paint[])[0];
        properties.push({
          name: "backgroundColor",
          value: buildColorString(paint),
        });
      }

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0];
        const num: number = node.strokeWeight as number;
        properties.push({
          name: "border",
          value: `${buildSizeStringByUnit(num, unitType)}`,
        });
        properties.push({
          name: "borderColor",
          value: `${buildColorString(paint)}`,
        });
      }
    }

    if (node.type === "RECTANGLE") {
      properties.push({
        name: "height",
        value: buildSizeStringByUnit(Math.floor(node.height), unitType),
      });
      properties.push({
        name: "width",
        value: buildSizeStringByUnit(Math.floor(node.width), unitType),
      });

      if (
        (node.fills as Paint[]).length > 0 &&
        (node.fills as Paint[])[0].type !== "IMAGE"
      ) {
        const paint = (node.fills as Paint[])[0];
        properties.push({
          name: "backgroundColor",
          value: buildColorString(paint),
        });
      }

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0];
        const num: number = node.strokeWeight as number;
        properties.push({
          name: "border",
          value: `${buildSizeStringByUnit(num, unitType)}`,
        });
        properties.push({
          name: "borderColor",
          value: `${buildColorString(paint)}`,
        });
      }
    }

    if (node.type === "TEXT") {
      properties.push({
        name: "textAlign",
        value: "TextAlign." + textAlignValues[node.textAlignHorizontal],
      });
      let styleId = node.textStyleId as string;
      let textStyle = figma.getStyleById(styleId)?.name as BpkTypography;
      let typography = Object.keys(BpkTypography)[Object.values(BpkTypography).indexOf(textStyle)]
      if(typography){
        typography = "BpkTheme.typography."+typography;
        properties.push({
          name: "textStyle",
          value: typography,
        });
      }
      
      if (
        node.textDecoration === "STRIKETHROUGH" ||
        node.textDecoration === "UNDERLINE"
      ) {
        properties.push({
          name: "textDecoration",
          value:
            "TextDecoration." + textDecorationValues[node.textDecoration],
        });
      }
      if ((node.fills as Paint[]).length > 0) {
        const paint = (node.fills as Paint[])[0];
        properties.push({ name: "color", value: buildColorString(paint) });
      }
    }

    if (node.type === "LINE") {
      properties.push({
        name: "height",
        value: buildSizeStringByUnit(Math.floor(node.height), unitType),
      });
      properties.push({
        name: "width",
        value: buildSizeStringByUnit(Math.floor(node.width), unitType),
      });

      if ((node.strokes as Paint[]).length > 0) {
        const paint = (node.strokes as Paint[])[0];
        const num: number = node.strokeWeight as number;
        properties.push({
          name: "border",
          value: `${buildSizeStringByUnit(num, unitType)}`,
        });
        properties.push({
          name: "borderColor",
          value: `${buildColorString(paint)}`,
        });
      }
    }

    if (
      node.type === "GROUP" ||
      node.type === "ELLIPSE" ||
      node.type === "POLYGON" ||
      node.type === "STAR"
    ) {
      properties.push({
        name: "height",
        value: buildSizeStringByUnit(Math.floor(node.height), unitType),
      });
      properties.push({
        name: "width",
        value: buildSizeStringByUnit(Math.floor(node.width), unitType),
      });
    }
  }

  if (properties.length > 0) {
    let className = kebabToCamelCase(node.name.replace(/[^A-Za-z]+/g, ""));

    if (isImageNode(node)) {
      className = "BpkImage";
    }

    if (node.type === "TEXT") {
      className = "BpkText";
    }
    return {
      className,
      properties,
    };
  }
  return null;
}