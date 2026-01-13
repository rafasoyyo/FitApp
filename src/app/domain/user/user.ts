import { colorCombinations } from "./userUtils";

type UserType = {
  id: string;
  darkMode: boolean;
  email: string;
  name: string;
  phone: string;
  role: string;
  verified: boolean;
}

export class User {

  private constructor(
    private _id: string,
    private _bgColor: string,
    private _color: string,
    private _darkMode: boolean,
    private _email: string,
    private _name: string,
    private _phone: string,
    private _role: string,
    private _verified: boolean,
  ) { }

  get id(): string {
    return this._id;
  }

  get bgColor(): string {
    return this._bgColor;
  }

  get color(): string {
    return this._color;
  }

  get darkMode(): boolean {
    return this._darkMode;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get phone(): string {
    return this._phone;
  }

  get role(): string {
    return this._role;
  }

  get verified(): boolean {
    return this._verified;
  }

  get capitalLetter(): string {
    return (this.name || 'A').charAt(0).toUpperCase();
  }

  set name(name: string) {
    this._name = name;
  }

  set phone(phone: string) {
    this._phone = phone;
  }

  set darkMode(darkMode: boolean) {
    this._darkMode = darkMode;
  }

  static fromJson(json: UserType): User {
    const colorIndex = (json.name || 'a').toLocaleLowerCase().charCodeAt(0) - 97;
    const bgColor = colorCombinations[colorIndex][0];
    const color = colorCombinations[colorIndex][1];

    return new User(
      json.id,
      bgColor,
      color,
      json.darkMode,
      json.email,
      json.name,
      json.phone,
      json.role,
      json.verified
    );
  }

  toJson(): any {
    return {
      id: this.id,
      darkMode: this.darkMode,
      name: this.name,
      email: this.email,
      phone: this.phone,
      role: this.role,
      verified: this.verified,
    };
  }

}
