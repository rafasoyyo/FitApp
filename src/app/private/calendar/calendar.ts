import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';

import { AgendaService } from '../../domain/agenda/agenda.service';
import { LessonService } from '../../domain/lesson/lesson.service';
import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, DialogModule, ButtonModule, SplitButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class Calendar implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  currentDate = signal<any>(null);
  visibleDialog = signal(false);
  selectedClasses = signal<any[]>([]);
  selectedDate = signal<string>('');
  users = signal<User[]>([]);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    // themeSystem: 'bootstrap5',
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
    private lessonService: LessonService
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
      lessonId: lesson?.id,
      date: date,
      status: expired ? 'finished' : lesson?.status || 'planned',
      lessonName: lesson?.name || 'Clase',
      startHour: agenda.startHour,
      endHour: agenda.endHour,
      members: lesson ? lesson.assistant : agenda.members
    };

    this.selectedClasses.set([displayItem]);
    this.visibleDialog.set(true);
  }

  getStatusLabel(status: string) {
    if (status === 'active') return 'Activada';
    if (status === 'canceled') return 'Cancelada';
    return 'Planeada';
  }

  getStatusIcon(status: string) {
    if (status === 'active') return 'pi pi-check';
    if (status === 'canceled') return 'pi pi-times';
    return 'pi pi-clock';
  }

  getStatusMenuItems(item: any): MenuItem[] {
    return [
      {
        label: 'Activar',
        icon: 'pi pi-check',
        visible: item.status !== 'active',
        command: () => this.updateLessonStatus(item, 'active')
      },
      {
        label: 'Planear',
        icon: 'pi pi-clock',
        visible: item.status !== 'planned',
        command: () => this.updateLessonStatus(item, 'planned')
      },
      {
        label: 'Cancelar',
        icon: 'pi pi-times',
        visible: item.status !== 'canceled',
        command: () => this.updateLessonStatus(item, 'canceled')
      }
    ];
  }

  async updateLessonStatus(item: any, newStatus: 'planned' | 'canceled' | 'active') {
    try {
      let lesson;
      if (item.lessonId) {
        lesson = await this.lessonService.update(item.lessonId, { status: newStatus } as any);
      } else {
        const newLesson = {
          agendaId: item.agendaId,
          date: item.date,
          status: newStatus,
          name: item.lessonName,
          note: '',
        } as any;
        lesson = await this.lessonService.create(newLesson);
      }

      this.calendarComponent.getApi().refetchEvents();
      this.visibleDialog.set(false);
    } catch (error) {
      console.error('Error updating lesson status:', error);
    }
  }
}
