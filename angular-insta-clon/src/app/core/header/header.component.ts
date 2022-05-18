import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuNavigationI } from 'src/models/interfaces';
import { StoreService } from 'src/services/store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  menuNavigation: Array<MenuNavigationI>;
  constructor(public store: StoreService, public router: Router) {
    this.menuNavigation = [
      {
        path: '/post/:id',
        label: '/assets/images/profile2.png',
        imageAlt: 'Profile',
      },
      {
        path: '/community',
        label: '/assets/images/pictures.png',
        imageAlt: 'Posts',
      },
      // {
      //   path: '/logout',
      //   label: '/assets/images/logout.png',
      //   imageAlt: 'Logout',
      // },
    ];
  }

  ngOnInit(): void {}

  logout(): void {
    this.store.logoutUser();
    this.router.navigate([`login`]);
  }
}
