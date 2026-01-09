import { Component } from '@angular/core';
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
export class Calendar {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    height: 'auto',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [
      { title: 'event 1', date: '2025-04-01' },
      { title: 'event 2', date: '2025-04-02' }
    ]
  };

  handleDateClick(arg: any) {
    alert('date click! ' + arg.dateStr)
  }
}
