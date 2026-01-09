import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { uid } from '../utils/id.util';

const KEY = 'tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private ready = false;

  private tasks$ = new BehaviorSubject<Task[]>([]);
  readonly tasksObs$ = this.tasks$.asObservable();

  constructor(private storage: Storage) {}

  async init(): Promise<void> {
    if (this.ready) return;
    await this.storage.create();
    const saved = (await this.storage.get(KEY)) as Task[] | null;
    this.tasks$.next(saved ?? []);
    this.ready = true;
  }

  getSnapshot(): Task[] {
    return this.tasks$.value;
  }

  async add(title: string, categoryId?: string): Promise<Task> {
    await this.init();

    const now = Date.now();
    const task: Task = {
      id: uid(),
      title: title.trim(),
      done: false,
      categoryId: categoryId || undefined,
      createdAt: now,
      updatedAt: now,
    };

    const list = [task, ...this.tasks$.value];
    await this.persist(list);
    return task;
  }

  async toggleDone(id: string): Promise<void> {
    await this.init();

    const now = Date.now();
    const list = this.tasks$.value.map(t =>
      t.id === id ? { ...t, done: !t.done, updatedAt: now } : t
    );
    await this.persist(list);
  }

  async update(id: string, patch: Partial<Pick<Task, 'title' | 'categoryId'>>): Promise<void> {
    await this.init();

    const now = Date.now();
    const list = this.tasks$.value.map(t => {
      if (t.id !== id) return t;
      return {
        ...t,
        title: patch.title !== undefined ? patch.title.trim() : t.title,
        categoryId: patch.categoryId !== undefined ? (patch.categoryId || undefined) : t.categoryId,
        updatedAt: now,
      };
    });

    await this.persist(list);
  }

  async delete(id: string): Promise<void> {
    await this.init();
    const list = this.tasks$.value.filter(t => t.id !== id);
    await this.persist(list);
  }

  // filtro simple para UI (sin recalcular en el template)
  getByCategory(categoryId?: string): Task[] {
    const list = this.tasks$.value;
    if (!categoryId) return list;
    return list.filter(t => t.categoryId === categoryId);
  }

  private async persist(list: Task[]): Promise<void> {
    await this.storage.set(KEY, list);
    this.tasks$.next(list);
  }

  async clearCategory(categoryId: string): Promise<void> {
  await this.init();

  const now = Date.now();
  const list = this.tasks$.value.map(t => {
    if (t.categoryId !== categoryId) return t;
    return { ...t, categoryId: undefined, updatedAt: now };
  });

  await this.persist(list);
}

}