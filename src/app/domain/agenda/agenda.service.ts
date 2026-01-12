import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Agenda } from './agenda';

@Injectable({
  providedIn: 'root'
})
export class AgendaService extends CrudService<Agenda> {
  protected override path = 'agendas';

  protected override fromJson(json: any): Agenda {
    return Agenda.fromJson(json);
  }
}
