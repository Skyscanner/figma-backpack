export default class BpkText implements BpkComponent {
  public text: string;
  public type: BpkBadgeType;
  public icon: string;

  constructor(
    text: string,
    type: BpkBadgeType,
    icon: string
  ) {
    this.text = text;
    this.type = type;
    this.icon = icon;
  }

  getContent(modifier: string): string {
    let result = "BpkBadge(\n";
    result += "\tmodifier = " + modifier + ",\n";
    result += '\ttext = "' + this.text + '",\n';
    if (this.type) result += "\ttype = BpkBadgeType." + this.type + ",\n";
    if (this.icon) result += "\ticon = BpkIcon." + this.icon + ",\n";
    result += ")";
    return result;
  }
}

