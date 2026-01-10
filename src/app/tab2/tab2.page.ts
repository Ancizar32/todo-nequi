import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonIcon,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonSearchbar, IonBadge,
  IonFab, IonFabButton,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trashOutline, createOutline, pricetagOutline } from 'ionicons/icons';

import { CategoriesService } from '../core/services/categories.service';
import { TasksService } from '../core/services/tasks.service';
import { Category } from '../core/models/category.model';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonIcon,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonSearchbar, IonBadge,
    IonFab, IonFabButton,
  ],
})
export class Tab2Page implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  query = '';

  // cache: categoryId -> count
  private taskCountMap = new Map<string, number>();

  constructor(
    private categoriesService: CategoriesService,
    private tasksService: TasksService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add, trashOutline, createOutline, pricetagOutline });
  }

  trackByCategoryId(_: number, c: Category) {
    return c.id;
  }

  get withTasksCount(): number {
    return this.filteredCategories.filter(c => this.taskCount(c.id) > 0).length;
  }

  // funcion para inicializar la pagina
  async ngOnInit() {
    await this.categoriesService.init();
    await this.tasksService.init();

    this.categoriesService.categoriesObs$.subscribe(list => {
      this.categories = list;
      this.applyFilters();
    });

    this.tasksService.tasksObs$.subscribe(tasks => {
      this.rebuildTaskMap(tasks);
      this.cdr.markForCheck();
    });
  }

  onSearch(ev: any) {
    const value = (ev?.detail?.value ?? '').toString();
    this.query = value;
    this.applyFilters();
  }

  // funcion para aplicar filtros de busqueda
  private applyFilters() {
    const q = this.query.trim().toLowerCase();
    const base = !q
      ? this.categories
      : this.categories.filter(c => (c.name ?? '').toLowerCase().includes(q));

    // nuevo array para OnPush
    this.filteredCategories = [...base];
    this.cdr.markForCheck();
  }

  // funcion para reconstruir el mapa de conteo de tareas
  private rebuildTaskMap(tasks: any[]) {
    const map = new Map<string, number>();
    for (const t of tasks || []) {
      const key = t.categoryId || '';
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    this.taskCountMap = map;
  }

  taskCount(categoryId?: string): number {
    const key = categoryId || '';
    return this.taskCountMap.get(key) ?? 0;
  }

  // funcion para abrir modal de nueva categoria
  async openNewCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data?.name) {
      await this.categoriesService.upsert(data.name);
      this.cdr.markForCheck();
    }
  }

  // funcion para editar categoria
  async openEditCategoryModal(category: Category) {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
      componentProps: { category },
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data?.name) {
      await this.categoriesService.upsert(data.name, category.id);
      this.cdr.markForCheck();
    }
  }

  // funcion para eliminar categoria
  async deleteCategory(category: Category) {
    await this.categoriesService.delete(category.id);
    this.cdr.markForCheck();
  }
}