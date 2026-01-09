import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel,
  IonFab, IonFabButton, IonIcon,
  IonItemSliding, IonItemOptions, IonItemOption,
} from '@ionic/angular/standalone';
import { ModalController, AlertController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';
import { ChangeDetectionStrategy } from '@angular/core';
import { CategoriesService } from '../core/services/categories.service';
import { Category } from '../core/models/category.model';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { TasksService } from '../core/services/tasks.service';

@Component({
  selector: 'app-tab2',
  standalone: true,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel,
    IonFab, IonFabButton, IonIcon,
    IonItemSliding, IonItemOptions, IonItemOption,
  ],
})
export class Tab2Page implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoriesService: CategoriesService,
    private tasksService: TasksService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add, trash, create });
  }

  async ngOnInit() {
    await this.categoriesService.init();
    this.categoriesService.categoriesObs$.subscribe(list => {
      this.categories = [...list];   // nuevo array (importante con OnPush)
      this.cdr.markForCheck();       // refresca vista
    });
  }

  async openNewCategoryModal() {
    const modal = await this.modalCtrl.create({
      component: CategoryModalComponent,
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'save' && data?.name) {
      await this.categoriesService.upsert(data.name);
      this.cdr.markForCheck();
    }
  }

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

  async confirmDelete(category: Category, sliding?: IonItemSliding) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Eliminar "${category.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.categoriesService.delete(category.id);
            await this.tasksService.clearCategory(category.id);
            this.cdr.markForCheck();
          },
        },
      ],
    });

    await alert.present();
    if (sliding) await sliding.close();
  }

  async trackByCategoryId(_: number, c: Category) {
    return c.id;
  }
}