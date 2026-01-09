import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonCheckbox,
  IonFab, IonFabButton, IonIcon,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonSelect, IonSelectOption, IonButtons, IonButton,
} from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash } from 'ionicons/icons';
import { FeatureFlagsService } from '../core/services/feature-flags.service';
import { TasksService } from '../core/services/tasks.service';
import { CategoriesService } from '../core/services/categories.service';
import { Task } from '../core/models/task.model';
import { Category } from '../core/models/category.model';
import { TaskModalComponent } from '../components/task-modal/task-modal.component';
import { ChangeDetectionStrategy } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tab1',
  standalone: true,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonCheckbox,
    IonFab, IonFabButton, IonIcon,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonSelect, IonSelectOption, IonButtons, IonButton,
  ],
})
export class Tab1Page implements OnInit {
  tasks: Task[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = '';

  constructor(
    public flags: FeatureFlagsService,
    private tasksService: TasksService,
    private categoriesService: CategoriesService,
    private modalCtrl: ModalController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add, trash });
  }

  async trackByTaskId(_: number, t: Task) {
    return t.id;
  }

  async ngOnInit() {
    await this.categoriesService.init();
    await this.tasksService.init();

    this.categoriesService.categoriesObs$.subscribe(list => {
      this.categories = list;
      this.refreshTasks();
    });

    this.tasksService.tasksObs$.subscribe(() => {
      this.refreshTasks();
    });
  }

  onCategoryChange(value: string) {
    this.selectedCategoryId = value ?? '';
    this.refreshTasks();
  }

  refreshTasks() {
  const cat = this.selectedCategoryId || undefined;
  // IMPORTANTE: crea SIEMPRE un array nuevo
  this.tasks = [...this.tasksService.getByCategory(cat)];
  this.cdr.markForCheck();
}

  async openNewTaskModal() {
    console.log('openNewTaskModal() click');
    const modal = await this.modalCtrl.create({
      component: TaskModalComponent,
      componentProps: {
        categories: this.categories,
      },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role === 'save' && data?.title) {
      await this.tasksService.add(data.title, data.categoryId);
    }
  }

  async toggleDone(task: Task) {
    await this.tasksService.toggleDone(task.id);
  }

  async deleteTask(task: Task, sliding?: IonItemSliding) {
    await this.tasksService.delete(task.id);
    if (sliding) await sliding.close();
  }

  categoryName(categoryId?: string): string {
    if (!categoryId) return 'Sin categoría';
    return this.categories.find(c => c.id === categoryId)?.name ?? 'Sin categoría';
  }
}