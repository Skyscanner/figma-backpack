import { BpkButtonIconPosition } from "./tokens/buttonIconPosition";
import { BpkButtonSize } from "./tokens/buttonSize";
import { BpkButtonStyle } from "./tokens/buttonType";

export default class BpkButton implements BpkComponent {
  public icon: string;
  public position: BpkButtonIconPosition;
  public text: string;
  public size: BpkButtonSize;
  public style: BpkButtonStyle;

  constructor(
    icon: string,
    position: BpkButtonIconPosition,
    text: string,
    size: BpkButtonSize,
    style: BpkButtonStyle
  ) {
    this.icon = icon 
    this.position = position
    this.text = text
    this.size = size
    this.style = style
  };

  getContent(modifier: string): string {
    let icon = "BpkIcon." + this.icon;
    let iconPosition = "BpkButtonIconPosition." + this.position;
    let buttonSize = "BpkButtonSize." + this.size;
    let buttonStyle = "BpkButtonStyle." + this.getButtonStyle(this.style);
    let result = "BpkButton(\n";
    result += "\tmodifier = " + modifier + ",\n";
    result += '\ttext = \"' + this.text + '\",\n';
    if (this.icon) result += "\ticon = " + icon + ",\n";
    if (this.icon && this.position) result += "\tposition = " + iconPosition + ",\n";
    if (this.size) result += "\tsize = " + buttonSize + ",\n";
    if (this.style) result += "\tstyle = " + buttonStyle + "\n";
    result += ")";
    return result;
  }

  getButtonStyle(value: string): string {
    let keys : string[] = Object.values(BpkButtonStyle)
    return Object.keys(BpkButtonStyle)[keys.indexOf(value)];
 }
}