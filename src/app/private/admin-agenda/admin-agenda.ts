import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';

import { Agenda } from '../../domain/agenda/agenda';
import { AgendaService } from '../../domain/agenda/agenda.service';
import { User } from '../../domain/user/user';
import { UserService } from '../../domain/user/user.service';

type AgendaWithMembers = Agenda & { memberNames: string[] };

@Component({
  selector: 'app-admin-agenda',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ListboxModule,
    CardModule,
    ConfirmDialogModule,
    DialogModule,
    SelectModule,
    InputTextModule,
    MultiSelectModule
  ],
  providers: [ConfirmationService],
  templateUrl: './admin-agenda.html',
  styleUrl: './admin-agenda.css',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AdminAgenda implements OnInit {
  agendaItems = signal<AgendaWithMembers[]>([]);
  users = signal<User[]>([]);
  showAddDialog = signal(false);
  showMembersDialog = signal(false);
  selectedAgendaItem = signal<Agenda | null>(null);
  selectedMemberIds = signal<string[]>([]);

  days = [
    { label: 'Lunes', value: 'lunes' },
    { label: 'Martes', value: 'martes' },
    { label: 'Miércoles', value: 'miercoles' },
    { label: 'Jueves', value: 'jueves' },
    { label: 'Viernes', value: 'viernes' }
  ];

  newItem: any = {
    day: 'lunes',
    startDay: null,
    endDay: null,
    startHour: null,
    endHour: null
  };

  constructor(
    private agendaService: AgendaService,
    private userService: UserService,
    private confirmationService: ConfirmationService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getUserList();
    await this.getAgendaList();
  }

  getMemberNames(memberIds: Set<string> | string[]): string[] {
    const ids = Array.from(memberIds);
    return this.users()
      .filter(u => ids.includes(u.id))
      .map(u => u.name);
  }

  getUserList() {
    this.userService.list().then(users => {
      this.users.set(users);
    });
  }

  getAgendaList(): Promise<AgendaWithMembers[]> {
    return this.agendaService.list()
      .then(items => {
        // Sort by day and then by hour
        const dayOrder: any = { 'lunes': 1, 'martes': 2, 'miercoles': 3, 'jueves': 4, 'viernes': 5 };
        const sortedItems = items.sort((a, b) => {
          if (dayOrder[a.day] !== dayOrder[b.day]) {
            return dayOrder[a.day] - dayOrder[b.day];
          }
          return a.startHour.localeCompare(b.startHour);
        }) as AgendaWithMembers[];
        sortedItems.forEach(item => item.memberNames = this.getMemberNames(item.members));
        this.agendaItems.set(sortedItems);
        return sortedItems;
      });
  }

  openNew() {
    this.newItem = {
      day: 'lunes',
      startDay: null,
      endDay: null,
      startHour: null,
      endHour: null
    };
    this.showAddDialog.set(true);
  }

  saveAgenda() {
    if (!this.newItem.startHour || !this.newItem.endHour || !this.newItem.startDay || !this.newItem.endDay) return;

    const data = {
      day: this.newItem.day,
      startDay: this.newItem.startDay,
      endDay: this.newItem.endDay,
      startHour: this.newItem.startHour,
      endHour: this.newItem.endHour,
      members: []
    } as any;

    this.agendaService.create(data).then(() => {
      this.showAddDialog.set(false);
      this.getAgendaList();
    });
  }

  openManageMembers(item: Agenda) {
    this.selectedAgendaItem.set(item);
    this.selectedMemberIds.set(Array.from(item.members));
    this.showMembersDialog.set(true);
  }

  saveMembers() {
    const item = this.selectedAgendaItem();
    if (item) {
      this.agendaService.update(item.id, {
        members: this.selectedMemberIds()
      } as any).then(() => {
        this.showMembersDialog.set(false);
        this.getAgendaList();
      });
    }
  }

  deleteAgenda(item: Agenda) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de que deseas eliminar la clase del ${item.day} a las ${item.startHour}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      rejectButtonProps: {
        severity: 'secondary',
        text: true
      },
      acceptButtonProps: {
        severity: 'danger'
      },
      accept: () => {
        this.agendaService.delete(item.id).then(() => {
          this.getAgendaList();
        });
      }
    });
  }
}
