import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { TagModule } from 'primeng/tag';

import { RouterLink } from '@angular/router';

import { Agenda } from '../../domain/agenda/agenda';
import { AgendaService } from '../../domain/agenda/agenda.service';
import { Lesson } from '../../domain/lesson/lesson';
import { LessonService } from '../../domain/lesson/lesson.service';
import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

@Component({
    selector: 'app-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AvatarModule,
        BadgeModule,
        ButtonModule,
        RouterLink,
        TagModule
    ],
    templateUrl: './list.component.html',
    styleUrl: './list.component.css'
})
export class List implements OnInit {
    private agendaService = inject(AgendaService);
    private userService = inject(UserService);
    private lessonService = inject(LessonService);

    upcomingLessons = signal<any[]>([]);
    allUsers = signal<User[]>([]);
    loggedUser = signal<User | null>(null);

    ngOnInit () {
        this.loadData();
    }

    async loadData () {
        const user = await this.userService.getLoggedUser();
        if (!user) return;

        this.loggedUser.set(user);
        const users = await this.userService.list();
        this.allUsers.set(users);

        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        const startStr = today.toISOString().split('T')[ 0 ];
        const endStr = thirtyDaysLater.toISOString().split('T')[ 0 ];

        const [ agendas, lessons ] = await Promise.all([
            this.agendaService.list(),
            this.lessonService.listByRange(startStr, endStr)
        ]);

        const upcoming: any[] = [];
        for (const lesson of lessons) {
            if (lesson.status !== 'active') continue;

            const agenda = agendas.find(a => a.id === lesson.agendaId);
            if (!agenda) continue;

            const members = lesson.members;
            const isMember = members.has(user.id);
            const status = lesson.status;

            if (isMember) {
                upcoming.push({
                    id: lesson?.id,
                    agendaId: lesson.agendaId,
                    date: lesson.date,
                    displayDate: new Date(lesson.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
                    name: lesson?.name || 'Clase',
                    startHour: agenda.startHour,
                    endHour: agenda.endHour,
                    status: status,
                    members: members,
                    note: lesson?.note || ''
                });
            }
        }

        // Sort by date and then hour
        upcoming.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.startHour.localeCompare(b.startHour);
        });

        this.upcomingLessons.set(upcoming);
    }

    getMemberData (memberIds: Set<string>): User[] {
        const ids = Array.from(memberIds);
        return this.allUsers().filter(u => ids.includes(u.id));
    }
}
