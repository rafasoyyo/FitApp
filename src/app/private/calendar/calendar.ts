import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';

import { ListboxModule } from 'primeng/listbox';
import { AgendaService } from '../../domain/agenda/agenda.service';
import { Lesson } from '../../domain/lesson/lesson';
import { LessonService } from '../../domain/lesson/lesson.service';
import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule, DialogModule, ButtonModule, CheckboxModule, ListboxModule, SplitButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class Calendar implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  currentDate = signal<any>(null);
  visibleDialog = signal(false);
  visibleEditDialog = signal(false);
  selectedClass = signal<any[]>([]);
  selectedDate = signal<string>('');
  users = signal<User[]>([]);
  selectedMembers = signal<User[]>([]);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    firstDay: 1,
    weekends: false,
    plugins: [dayGridPlugin, interactionPlugin],
    locale: 'es',
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Agenda'
    },
    titleFormat: { year: 'numeric', month: 'long' },
    eventClick: (info) => this.handleEventClick(info),
    events: (arg, successCallback, failureCallback) => {
      this.currentDate.set(arg);
      this.loadLessonsEvents(arg, successCallback, failureCallback);
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false
    }
  };

  constructor(
    private agendaService: AgendaService,
    private userService: UserService,
    private lessonService: LessonService,
  ) { }

  ngOnInit(): void {
    this.userService.list().then(users => this.users.set(users));
  }

  getMemberNames(memberIds: Set<string> | string[]): string[] {
    const ids = Array.from(memberIds);
    return this.users()
      .filter(u => ids.includes(u.id))
      .map(u => u.name);
  }

  getMembers(memberIds: Set<string> | string[]): User[] {
    const ids = Array.from(memberIds);
    return this.users().filter(u => ids.includes(u.id));
  }

  async loadLessonsEvents(info: any, successCallback: any, failureCallback: any): Promise<void> {
    // console.log('loadLessonsEvents');
    const dayMap = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const agendaDayMap = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const startStr = formatDate(info.start);
    const endStr = formatDate(info.end);

    try {
      const [agendaItems, lessons] = await Promise.all([
        this.agendaService.list(),
        this.lessonService.listByRange(startStr, endStr)
      ]);

      const events: any[] = [];
      const currentDate = new Date(info.start);
      currentDate.setHours(0, 0, 0, 0);
      const endDate = new Date(info.end);

      while (currentDate < endDate) {
        const dayOfWeek = currentDate.getDay();
        const dayName = dayMap[dayOfWeek];

        if (agendaDayMap.includes(dayName)) {
          const dateStr = formatDate(currentDate);

          const todaysAgenda = agendaItems.filter(item =>
            item.day === dayName &&
            dateStr >= item.startDay &&
            dateStr <= item.endDay
          );

          todaysAgenda.forEach(agenda => {
            const lesson = lessons.find(l => l.agendaId === agenda.id && l.date === dateStr);

            const expired = currentDate < new Date();
            const color = expired ? '#b1b1b1ff' : lesson?.color || '#facc15';
            events.push({
              id: `${agenda.id}-${dateStr}`,
              title: lesson?.name || 'Clase',
              start: `${dateStr}T${agenda.startHour}`,
              end: `${dateStr}T${agenda.endHour}`,
              color: color,
              extendedProps: {
                agenda: agenda,
                lesson: lesson,
                date: dateStr
              }
            });
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      successCallback(events);
    } catch (error) {
      console.error('Error loading agenda events:', error);
      failureCallback(error);
    }
  }

  handleEventClick(info: any) {
    const agenda = info.event.extendedProps.agenda;
    const lesson = info.event.extendedProps.lesson;
    const date = info.event.extendedProps.date;
    const eventDate = info.event.start;

    this.selectedDate.set(eventDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }));

    const expired = eventDate < new Date();

    const displayItem = {
      agendaId: agenda.id,
      id: lesson?.id,
      date: date,
      status: expired ? 'finished' : lesson?.status || 'planned',
      name: lesson?.name || 'Clase',
      startHour: agenda.startHour,
      endHour: agenda.endHour,
      agendaMembers: agenda.members,
      members: lesson?.members || agenda.members
    };

    this.selectedClass.set([displayItem]);
    this.selectedMembers.set(this.getMembers(lesson?.assistants || []));
    this.visibleDialog.set(true);
  }

  getStatusLabel(status: string) {
    if (status === 'active') return 'Activada';
    if (status === 'canceled') return 'Cancelada';
    if (status === 'finished') return 'Finalizada';
    return 'Planeada';
  }

  onMembersChange(event: any) {
    this.selectedMembers.set(event.value);
  }

  async updateLessonStatus() {
    const membersIds = this.selectedMembers().map(u => u.id);
    const input = this.selectedClass()[0];
    const lesson = Lesson.fromJson({ ...input, assistants: membersIds });
    if (!lesson) return;
    try {
      input.id
        ? await this.lessonService.update(input.id, lesson)
        : await this.lessonService.create(lesson);

      this.calendarComponent.getApi().refetchEvents();
      this.visibleEditDialog.set(false);
    } catch (error) {
      console.error('Error updating lesson status:', error);
    }
  }
}
