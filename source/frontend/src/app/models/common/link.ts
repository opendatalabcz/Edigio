export type LinkValueType = string | any[]

export class Link {

  private _isAbsolute: boolean

  private _value: LinkValueType = ''

  constructor(value: LinkValueType, isAbsolute: boolean = false) {
    this._isAbsolute = isAbsolute
    this.value = value
  }

  public linkValueAndIsAbsoluteComboValid(value: LinkValueType, isAbsolute: boolean) : boolean{
    //While relative link might contain an array, which is passable to routerLink,
    //absolute link must be already passable as complete url, therefore only string is valid!
    return !isAbsolute || typeof value === "string"
  }

  get isAbsolute(): boolean {
    return this._isAbsolute;
  }

  set isAbsolute(value: boolean) {
    this._isAbsolute = value;
  }

  public get value() : LinkValueType {
    return this._value
  }

  private set value(linkValue: LinkValueType) {
    if(!this.linkValueAndIsAbsoluteComboValid(linkValue, this.isAbsolute)) {
      throw new Error('Value of absolute link cannot be an array!')
    }
    this._value = linkValue
  }
}
