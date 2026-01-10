
type lessonType = {
  id: string;
  name: string;
  note: string;
  agendaId: string;
  guest: string[];
  assistant: string[];

}

export class Lesson {
  private constructor(
    private _id: string,
    private _name: string,
    private _note: string,
    private _agendaId: string,
    private _guest: Set<string>,
    private _assistant: Set<string>
  ) { }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get note(): string {
    return this._note;
  }

  get agendaId(): string {
    return this._agendaId;
  }

  get guest(): Set<string> {
    return this._guest;
  }

  get assistant(): Set<string> {
    return this._assistant;
  }


  static fromJson(json: lessonType): Lesson {
    return new Lesson(
      json.id,
      json.name,
      json.note,
      json.agendaId,
      new Set(json.guest),
      new Set(json.assistant)
    );
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      note: this.note,
      agendaId: this.agendaId,
      guest: Array.from(this.guest),
      assistant: Array.from(this.assistant)
    };
  }
}
