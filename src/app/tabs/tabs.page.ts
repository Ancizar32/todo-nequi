import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { FeatureFlagsService } from '../core/services/feature-flags.service';
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [CommonModule, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet, RouterLink],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor(public flags: FeatureFlagsService) {
    addIcons({ triangle, ellipse, square });
  }

}
