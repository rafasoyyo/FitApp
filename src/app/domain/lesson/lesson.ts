
export type MemberRequest = {
  memberId: string;
  requestDate: string;
}

type lessonType = {
  id: string;
  agendaId: string;
  assistants: string[];
  date: string;
  color: string;
  members: string[];
  name: string;
  note: string;
  status: 'planned' | 'canceled' | 'active' | 'finished';
  requests: MemberRequest[];
  teacher: string;
}

export class Lesson {
  private constructor(
    private _id: string,
    private _agendaId: string,
    private _assistants: Set<string>,
    private _date: string,
    private _members: Set<string>,
    private _name: string,
    private _note: string,
    private _status: 'planned' | 'canceled' | 'active' | 'finished',
    private _requests: MemberRequest[],
    private _teacher: string
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

  get agendaId(): string {
    return this._agendaId;
  }

  get assistants (): Set<string> {
    return this._assistants;
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

  get members (): Set<string> {
    return this._members;
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

  get requests (): MemberRequest[] {
    return this._requests || [];
  }

  get teacher (): string {
    return this._teacher;
  }

  static fromJson(json: lessonType): Lesson {
    return new Lesson(
      json.id,
      json.agendaId,
      new Set(json.assistants),
      json.date,
      new Set(json.members),
      json.name,
      json.note,
      json.status,
      json.requests || [],
      json.teacher
    );
  }

  toJson(): any {
    return {
      id: this.id,
      agendaId: this.agendaId,
      assistants: Array.from(this.assistants),
      date: this.date,
      members: Array.from(this.members),
      name: this.name,
      note: this.note,
      status: this.status,
      requests: this.requests,
      teacher: this.teacher
    };
  }
}
