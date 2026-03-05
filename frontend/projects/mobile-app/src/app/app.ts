import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, pawOutline, businessOutline, personOutline } from 'ionicons/icons';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonRouterOutlet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mobile-app');
  showTabs = signal(false);

  constructor(private router: Router) {
    addIcons({ homeOutline, pawOutline, businessOutline, personOutline });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showTabs.set(!e.urlAfterRedirects.startsWith('/login'));
      });
  }
}
