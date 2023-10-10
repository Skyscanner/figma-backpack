export default class BpkText implements BpkComponent {
  public text: string;
  public color: string;
  public textDecoration: string;
  public textAlign: string;
  public style: string;

  constructor(
    text: string,
    color: string,
    textDecoration: string,
    textAlign: string,
    style: string
  ) {
    this.text = text;
    this.color = color;
    this.textDecoration = textDecoration;
    this.textAlign = textAlign;
    this.style = style;
  }

  getContent(modifier: string): string {
    let result = "BpkText(\n";
    result += "\tmodifier = " + modifier + ",\n";
    result += '\ttext = "' + this.text + '",\n';
    if (this.textDecoration) result += "\ttextDecoration = " + this.textDecoration + ",\n";
    if (this.textAlign) result += "\ttextAlign = " + this.textAlign + ",\n";
    if (this.color) result += "\tcolor = " + this.color + ",\n";
    if (this.style) result += "\tstyle = " + this.style + "\n";
    result += ")";
    return result;
  }
}