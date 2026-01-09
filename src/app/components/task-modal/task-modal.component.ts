import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Category } from '../../core/models/category.model';
import { Task } from '../../core/models/task.model';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
})
export class TaskModalComponent {
  @Input() task?: Task;
  @Input() categories: Category[] = [];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    categoryId: [''],
  });

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    public flags: FeatureFlagsService
  ) {}

  ngOnInit() {
    if (this.task) {
      this.form.patchValue({
        title: this.task.title,
        categoryId: this.task.categoryId ?? '',
      });
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
    this.modalCtrl.dismiss(
      {
        title: this.form.value.title!.trim(),
        categoryId: this.form.value.categoryId || undefined,
      },
      'save'
    );
  }
}