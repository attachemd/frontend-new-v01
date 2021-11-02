import { Component } from '@angular/core';
import {Event, NavigationEnd, NavigationError, NavigationStart, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend-new-v01';
  constructor(private router: Router) {

    this.router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        console.log("%c ROUTER EVENT ", 'background: #0000FF; color: #fff; padding: 0 10px;')
        console.log("event.url: ", event.url);
      }

      if (event instanceof NavigationEnd) {

      }

      if (event instanceof NavigationError) {

        // Present error to user
        console.log("%c ROUTER EVENT ERROR ", 'background: red; color: #fff; padding: 0 10px;')
        console.log(event.error);
      }
    });

  }
}
