import { Injectable } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { CrudService } from '../crud.service';
import { Lesson } from './lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService extends CrudService<Lesson> {
  protected override path = 'lessons';

  listByRange(start: string, end: string): Promise<Lesson[]> {
    return this.list([
      where('date', '>=', start),
      where('date', '<=', end)
    ]);
  }

  protected override fromJson(json: any): Lesson {
    return Lesson.fromJson(json);
  }
}
