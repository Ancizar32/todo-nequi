import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonItem, IonLabel, IonInput, IonText } from '@ionic/angular/standalone';
import { ModalController } from '@ionic/angular/standalone';
import { Category } from '../../core/models/category.model';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButtons, IonButton, IonItem, IonLabel, IonInput, IonText
  ],
  templateUrl: './category-modal.component.html',
})
export class CategoryModalComponent {
  @Input() category?: Category;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  constructor(private fb: FormBuilder, private modalCtrl: ModalController, public flags: FeatureFlagsService) {}

  ngOnInit() {
    if (this.category) {
      this.form.patchValue({ name: this.category.name });
    }
  }

  cancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.modalCtrl.dismiss({ name: this.form.value.name!.trim() }, 'save');
  }
}