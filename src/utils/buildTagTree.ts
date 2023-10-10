import { UnitType } from "./sizeUtils";
import { kebabToCamelCase } from "./stringUtils";
import { Config, findProperty, getConfigForTag } from "./getConfigForTag";
import { isImageNode } from "./isImageNode";

type Property = {
  name: string;
  value: string;
  notStringValue?: boolean;
};

export type Tag = {
  name: string;
  isText: boolean;
  textCharacters: string;
  isImg: boolean;
  properties: Property[];
  config: Config | null;
  children: Tag[];
  node: SceneNode;
  isComponent?: boolean;
};

export function buildModifierTree(tag: Tag): string {
  let modifierTree = "Modifier";
  let width = findProperty(tag.config?.properties, "width");
  let padding = findProperty(tag.config?.properties, "padding");
  let paddingStart = findProperty(tag.config?.properties, "paddingStart");
  let paddingEnd = findProperty(tag.config?.properties, "paddingEnd");
  let paddingTop = findProperty(tag.config?.properties, "paddingTop");
  let paddingBottom = findProperty(tag.config?.properties, "paddingBottom");
  let paddingHorizontal = findProperty(tag.config?.properties, "paddingHorizontal");
  let paddingVertical = findProperty(tag.config?.properties, "paddingVertical");

  if(width)
    modifierTree += width == "MAX" ? "\n\t\t.fillMaxWidth()" : `\n\t\t.width(${width})`;

  if(padding){
    modifierTree += `\n\t\t.padding(${padding})`;
  }else if(paddingStart || paddingEnd || paddingTop || paddingBottom){
    modifierTree += `\n\t\t.padding(\n\t\t\tstart = ${paddingStart}, \n\t\t\tend = ${paddingEnd}, \n\t\t\ttop = ${paddingTop}, \n\t\t\tbottom = ${paddingBottom})`;
  }else if(paddingHorizontal || paddingVertical){
    modifierTree += `\n\t\t.padding(\n\t\t\thorizontal = ${paddingHorizontal}, \n\t\t\tvertical = ${paddingVertical}\n\t\t)`;
  }
  return modifierTree;
}

export function buildTagTree(node: SceneNode, unitType: UnitType): Tag | null {
  if (!node.visible) {
    return null;
  }

  const isImg = isImageNode(node);
  const properties: Property[] = [];

  if (isImg) {
    properties.push({ name: "src", value: "Icon" }); // to add sources later
  }

  const childTags: Tag[] = [];
  if ("children" in node && !isImg) {
    node.children.forEach((child) => {
      const childTag = buildTagTree(child, unitType);
      if (childTag) {
        childTags.push(childTag);
      }
    });
  }
  let className = kebabToCamelCase(node.name.replace(/[^A-Za-z]+/g, ""));
  if (isImageNode(node)) {
    className = "BpkImage";
  }

  if (node.type === "TEXT") {
    className = "BpkText";
  }
  const tag: Tag = {
    name: className,
    isText: node.type === "TEXT",
    textCharacters: node.type === "TEXT" ? node.characters : "",
    isImg,
    config: getConfigForTag(node, unitType),
    properties,
    children: childTags,
    node,
  };
  return tag;
}
