import { Component, OnInit } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class Calendar implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    themeSystem: 'bootstrap5',
    firstDay: 1,
    weekends: false,
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
  };

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    const days = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes'];
    const hours = [['18:00:00', '19:15:00'], ['19:15:00', '20:30:00'], ['20:30:00', '21:45:00']];
    const events = days
      .flatMap((day, dayIndex) => {
        return hours.map((hour) => {
          return {
            title: day,
            daysOfWeek: [dayIndex + 1],
            startTime: hour[0],
            endTime: hour[1],
            startRecur: '2026-01-01',
            endRecur: '2026-07-31',
          };
        });
      });
    this.calendarOptions.events = events;
  }

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }
}
