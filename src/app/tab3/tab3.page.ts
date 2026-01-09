import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText } from '@ionic/angular/standalone';
import { FeatureFlagsService } from '../core/services/feature-flags.service';

@Component({
  selector: 'app-tab3',
  standalone: true,
  templateUrl: 'tab3.page.html',
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton, IonText],
})
export class Tab3Page {
  constructor(public flags: FeatureFlagsService) {}

  async refresh() {
    await this.flags.refresh();
  }
}