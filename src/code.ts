import { BpkButtonStyle } from "./components/button/tokens/buttonType";
import { BpkButtonSize } from "./components/button/tokens/buttonSize";
import { BpkButtonIconPosition } from "./components/button/tokens/buttonIconPosition";
import { Tag, buildTagTree, buildModifierTree } from "./utils/buildTagTree";
import { findProperty } from "./utils/getConfigForTag";
import BpkButton from "./components/button/button";
import BpkText from "./components/text/text";
import BpkBadge from "./components/badge/badge";

const getBackPackCode = (tag: Tag): string => {
  let result = '';
  var bpkComponent: BpkComponent;
  switch (tag.name) {
    case "BpkButton":
      bpkComponent = new BpkButton(
        findProperty(tag.children.find(b => b.isImg)?.properties, "src") as string,
        findProperty(tag.config?.properties, "iconPosition") as BpkButtonIconPosition,
        tag.children.find(b => b.isText)?.textCharacters as string,
        findProperty(tag.config?.properties, "size") as BpkButtonSize,
        findProperty(tag.config?.properties, "style") as BpkButtonStyle
      );
      return bpkComponent.getContent(buildModifierTree(tag));
    case "BpkText":
      bpkComponent = new BpkText(
        tag.textCharacters,
        findProperty(tag.config?.properties, "color") as string,
        findProperty(tag.config?.properties, "textDecoration") as string,
        findProperty(tag.config?.properties, "textAlign") as string,
        findProperty(tag.config?.properties, "textStyle") as string,
      );
      return bpkComponent.getContent(buildModifierTree(tag));
    case "BpkBadge":
      bpkComponent = new BpkBadge(
        tag.children.find(b => b.isText)?.textCharacters as string,
        findProperty(tag.config?.properties, "style") as BpkBadgeType,
        findProperty(tag.children.find(b => b.isImg)?.properties, "src") as string,
      );
      return bpkComponent.getContent(buildModifierTree(tag));
    default:
      result = "Component not found in BackPack";
  }
  return result;
};

figma.codegen.on("generate", (e: CodegenEvent) => {
  const node = e.node as InstanceNode;
  const tag = buildTagTree(node, "dp")
  let bpkCode = 'No component selected'
  if(tag)
    bpkCode = getBackPackCode(tag);
  
  return [
    {
      title: e.language,
      code: bpkCode,
      language: "SWIFT",
    }
  ];
});
