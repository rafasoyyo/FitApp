import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Lesson } from './lesson';

@Injectable({
  providedIn: 'root'
})
export class LessonService extends CrudService<Lesson> {
  protected override path = 'lessons';

  protected override fromJson(json: any): Lesson {
    return Lesson.fromJson(json);
  }
}
