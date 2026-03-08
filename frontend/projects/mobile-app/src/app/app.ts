import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonMenuToggle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, pawOutline, businessOutline, personOutline, logOutOutline, menuOutline, menu } from 'ionicons/icons';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [IonApp, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonMenuToggle],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('mobile-app');
  showTabs = signal(false);

  constructor(private router: Router) {
    addIcons({ homeOutline, pawOutline, businessOutline, personOutline, logOutOutline, menuOutline, menu });

    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.showTabs.set(!e.urlAfterRedirects.startsWith('/login'));
      });
  }
}
