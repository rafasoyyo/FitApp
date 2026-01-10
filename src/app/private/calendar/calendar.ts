import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { AgendaService } from '../../domain/agenda/agenda.service';
import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, DialogModule, ButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class Calendar implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  visibleDialog = signal(false);
  selectedClasses = signal<any[]>([]);
  selectedDate = signal<string>('');
  users = signal<User[]>([]);

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    themeSystem: 'bootstrap5',
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
    eventClick: (info) => this.handleEventClick(info),
    eventSources: [this.loadAgendaEvents.bind(this)],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false,
      hour12: false
    }
  };

  constructor(
    private agendaService: AgendaService,
    private userService: UserService
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

  loadAgendaEvents(info: any, successCallback: any, failureCallback: any): void {
    const dayMap = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];

    this.agendaService.list()
      .then(agendaItems => {
        const events = agendaItems.map(item => ({
          title: 'Clase',
          daysOfWeek: [dayMap.indexOf(item.day) + 1],
          startTime: item.startHour,
          endTime: item.endHour,
          startRecur: item.startDay,
          endRecur: item.endDay,
          color: '#6366f1',
          extendedProps: {
            agenda: item
          }
        }));
        successCallback(events);
      })
      .catch(error => {
        console.error('Error loading agenda events:', error);
        failureCallback(error);
      });
  }

  handleEventClick(info: any) {
    const agenda = info.event.extendedProps.agenda;
    const eventDate = info.event.start;

    this.selectedDate.set(eventDate.toLocaleDateString('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }));
    this.selectedClasses.set([agenda]);
    this.visibleDialog.set(true);
  }
}
