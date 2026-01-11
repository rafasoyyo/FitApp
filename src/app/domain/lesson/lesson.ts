
type lessonType = {
  id: string;
  absents: Set<string>;
  agendaId: string;
  assistant: Set<string>;
  date: string;
  color: string;
  guest: Set<string>;
  name: string;
  note: string;
  status: 'planned' | 'canceled' | 'active' | 'finished';
}

export class Lesson {
  private constructor(
    private _id: string,
    private _absents: Set<string>,
    private _agendaId: string,
    private _assistant: Set<string>,
    private _date: string,
    private _guest: Set<string>,
    private _name: string,
    private _note: string,
    private _status: 'planned' | 'canceled' | 'active' | 'finished'
  ) { }

  static statusColor(status: 'planned' | 'canceled' | 'active' | 'finished'): string {
    const colors = {
      planned: '#facc15',
      canceled: '#ef4444',
      active: '#22c55e',
      finished: '#b1b1b1ff'
    };
    return colors[status];
  }

  get id(): string {
    return this._id;
  }

  get absents(): Set<string> {
    return this._absents;
  }

  get agendaId(): string {
    return this._agendaId;
  }

  get assistant(): Set<string> {
    return this._assistant;
  }

  get date(): string {
    return this._date;
  }

  get closed(): boolean {
    return this.date < new Date().toISOString().split('T')[0];
  }

  get color(): string {
    return Lesson.statusColor(this._status);
  }

  get guest(): Set<string> {
    return this._guest;
  }

  get name(): string {
    return this._name || '';
  }

  get note(): string {
    return this._note || '';
  }

  get status(): 'planned' | 'canceled' | 'active' | 'finished' {
    return this.closed ? 'finished' : this._status;
  }

  static fromJson(json: lessonType): Lesson {
    return new Lesson(
      json.id,
      new Set(json.absents),
      json.agendaId,
      new Set(json.assistant),
      json.date,
      new Set(json.guest),
      json.name,
      json.note,
      json.status
    );
  }

  toJson(): any {
    return {
      id: this.id,
      absents: Array.from(this.absents),
      agendaId: this.agendaId,
      assistant: Array.from(this.assistant),
      date: this.date,
      guest: Array.from(this.guest),
      name: this.name,
      note: this.note,
      status: this.status
    };
  }
}
