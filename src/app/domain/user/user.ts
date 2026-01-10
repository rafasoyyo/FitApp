
type UserType = {
  id: string;
  name: string;
  email: string;
}

export class User {

  private constructor(
    private _id: string,
    private _name: string,
    private _email: string
  ) { }

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get email(): string { return this._email; }

  static fromJson(json: UserType): User {
    return new User(json.id, json.name, json.email);
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }

}
