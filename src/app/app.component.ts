import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

declare const navigator: any;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
     document.addEventListener('deviceready', () => {
    try { navigator?.splashscreen?.hide(); } catch {}
  });

  // Fallback duro
  setTimeout(() => {
    try { navigator?.splashscreen?.hide(); } catch {}
  }, 1200);
  }
}
