import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';

import { RouterLink } from '@angular/router';

import { AgendaService } from '../../domain/agenda/agenda.service';
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
        SelectModule,
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
    allLessons = signal<any[]>([]);
    groupedLessons = signal<{ weekLabel: string, lessons: any[] }[]>([]);
    allUsers = signal<User[]>([]);
    alumnos = signal<User[]>([]);
    loggedUser = signal<User | null>(null);
    selectedStudent = signal<User | null>(null);
    isAdmin = signal<boolean>(false);

    ngOnInit () {
        this.loadData();
    }

    async loadData () {
        const user = await this.userService.getLoggedUser();
        if (!user) return;

        this.loggedUser.set(user);
        this.isAdmin.set(user.role === 'admin');

        const users = await this.userService.list();
        this.allUsers.set(users.sort((a, b) => a.name.localeCompare(b.name)));
        this.alumnos.set(users.filter(u => u.role === 'user').sort((a, b) => a.name.localeCompare(b.name)));

        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);

        const startStr = today.toISOString().split('T')[ 0 ];
        const endStr = thirtyDaysLater.toISOString().split('T')[ 0 ];

        const [ agendas, lessons ] = await Promise.all([
            this.agendaService.list(),
            this.lessonService.listByRange(startStr, endStr)
        ]);

        const processedLessons: any[] = [];
        const upcoming: any[] = [];

        for (const lesson of lessons) {
            if (lesson.status !== 'active') continue;

            const agenda = agendas.find(a => a.id === lesson.agendaId);
            if (!agenda) continue;

            const lessonData = {
                id: lesson?.id,
                agendaId: lesson.agendaId,
                date: lesson.date,
                displayDate: new Date(lesson.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
                name: lesson?.name || 'Clase',
                startHour: agenda.startHour,
                endHour: agenda.endHour,
                status: lesson.status,
                members: lesson.members,
                note: lesson?.note || ''
            };

            processedLessons.push(lessonData);

            if (!this.isAdmin() && lesson.members.has(user.id)) {
                upcoming.push(lessonData);
            }
        }

        this.allLessons.set(processedLessons);
        this.updateGroupedLessons();
    }

    updateGroupedLessons () {
        const userId = this.isAdmin() ? this.selectedStudent()?.id : this.loggedUser()?.id;
        if (!userId) {
            this.groupedLessons.set([]);
            return;
        }

        const filtered = this.allLessons().filter(l => l.members.has(userId));

        // Sort by date and then hour
        filtered.sort((a, b) => {
            if (a.date !== b.date) return a.date.localeCompare(b.date);
            return a.startHour.localeCompare(b.startHour);
        });

        const groups: { [key: string]: any[] } = {};
        const weekLabels: string[] = [];

        filtered.forEach(lesson => {
            const date = new Date(lesson.date);
            const weekInfo = this.getWeekRange(date);
            if (!groups[weekInfo.label]) {
                groups[weekInfo.label] = [];
                weekLabels.push(weekInfo.label);
            }
            groups[weekInfo.label].push(lesson);
        });

        const result = weekLabels.map(label => ({
            weekLabel: label,
            lessons: groups[label]
        }));

        this.groupedLessons.set(result);
    }

    private getWeekRange (date: Date): { start: Date, end: Date, label: string } {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - (day === 0 ? 6 : day - 1); // Monday
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);

        const formatDate = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        return { start, end, label: `Semana ${formatDate(start)} - ${formatDate(end)}` };
    }

    getMemberData (memberIds: Set<string>): User[] {
        const ids = Array.from(memberIds);
        return this.allUsers().filter(u => ids.includes(u.id));
    }
}
