import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';

import { RouterLink } from '@angular/router';

import { Agenda } from '../../domain/agenda/agenda';
import { AgendaService } from '../../domain/agenda/agenda.service';
import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

@Component({
  selector: 'app-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        AccordionModule,
        AvatarModule,
        BadgeModule,
        ButtonModule,
        ListboxModule,
        RouterLink
    ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class List implements OnInit {
    private agendaService = inject(AgendaService);
    private userService = inject(UserService);

    enrolledClasses = signal<Agenda[]>([]);
    allUsers = signal<User[]>([]);
    loggedUser = signal<User | null>(null);

    ngOnInit() {
        this.loadData();
    }

    async loadData() {
        const [user, users, allAgenda] = await Promise.all([
            this.userService.getLoggedUser(),
            this.userService.list(),
            this.agendaService.list()
        ]);

        this.loggedUser.set(user);
        this.allUsers.set(users);

        if (user) {
            const myClasses = allAgenda.filter(a => a.members.has(user.id));
            // Sort by day and hour
            const dayOrder: any = { 'lunes': 1, 'martes': 2, 'miercoles': 3, 'jueves': 4, 'viernes': 5 };
            myClasses.sort((a, b) => {
                if (dayOrder[a.day] !== dayOrder[b.day]) {
                    return dayOrder[a.day] - dayOrder[b.day];
                }
                return a.startHour.localeCompare(b.startHour);
            });
            this.enrolledClasses.set(myClasses);
        }
    }

    getMemberData(memberIds: Set<string>): User[] {
        const ids = Array.from(memberIds);
        return this.allUsers().filter(u => ids.includes(u.id));
    }
}
