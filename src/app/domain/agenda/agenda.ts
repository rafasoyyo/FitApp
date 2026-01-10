
type agendaType = {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday';
  startDay: string;
  endDay: string;
  startHour: string;
  endHour: string;
  members: string[];
}

export class Agenda {

  private constructor(
    private _id: string,
    private _day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday',
    private _startDay: string,
    private _endDay: string,
    private _startHour: string,
    private _endHour: string,
    private _members: Set<string>
  ) { }

  get id(): string { return this._id; }

  get day(): 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' {
    return this._day;
  }

  get startDay(): string {
    return this._startDay;
  }

  get endDay(): string {
    return this._endDay;
  }

  get startHour(): string {
    return this._startHour;
  }

  get endHour(): string {
    return this._endHour;
  }

  get members(): Set<string> {
    return this._members;
  }

  static fromJson(json: agendaType): Agenda {
    return new Agenda(
      json.id,
      json.day,
      json.startDay,
      json.endDay,
      json.startHour,
      json.endHour,
      new Set(json.members)
    );
  }

  toJson(): any {
    return {
      id: this.id,
      day: this.day,
      startDay: this.startDay,
      endDay: this.endDay,
      startHour: this.startHour,
      endHour: this.endHour,
      members: Array.from(this.members)
    };
  }

}
