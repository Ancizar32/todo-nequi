import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText } from '@ionic/angular/standalone';
import { FeatureFlagsService } from '../core/services/feature-flags.service';
import { TasksService } from '../core/services/tasks.service';
import { CategoriesService } from '../core/services/categories.service';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText],
})
export class Tab3Page {
  constructor(public flags: FeatureFlagsService,
    private tasksService: TasksService,
    private categoriesService: CategoriesService,
  ) {}

  // funcion para refrescar Remote Config
  async refresh() {
    await this.flags.refresh();
  }

  // funcion para cargar datos demo
  async seedDemo() {
  await this.categoriesService.seedCategories(50);
  await this.tasksService.seedTasks(this.categoriesService.getAll(), 200);
}
}