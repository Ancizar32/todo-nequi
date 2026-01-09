import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category.model';
import { uid } from '../utils/id.util';

const KEY = 'categories';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private ready = false;

  private categories$ = new BehaviorSubject<Category[]>([]);
  readonly categoriesObs$ = this.categories$.asObservable();

  constructor(private storage: Storage) {}

  async init(): Promise<void> {
    if (this.ready) return;
    await this.storage.create();
    const saved = (await this.storage.get(KEY)) as Category[] | null;
    this.categories$.next(saved ?? []);
    this.ready = true;
  }

  getSnapshot(): Category[] {
    return this.categories$.value;
  }

  async upsert(name: string, id?: string): Promise<Category> {
    await this.init();

    const now = Date.now();
    const list = [...this.categories$.value];

    if (id) {
      const idx = list.findIndex(c => c.id === id);
      if (idx === -1) throw new Error('Category not found');
      list[idx] = { ...list[idx], name: name.trim(), updatedAt: now };
      await this.persist(list);
      return list[idx];
    }

    const cat: Category = {
      id: uid(),
      name: name.trim(),
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(cat);
    await this.persist(list);
    return cat;
  }

  async delete(id: string): Promise<void> {
    await this.init();
    const list = this.categories$.value.filter(c => c.id !== id);
    await this.persist(list);
  }

  private async persist(list: Category[]): Promise<void> {
    await this.storage.set(KEY, list);
    this.categories$.next(list);
  }
}