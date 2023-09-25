import { Component, computed } from '@angular/core';
import { AuthServices } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [
  ]
})
export class LayoutPageComponent {

  public sidebarItems = [
    { label: 'Board', icon: 'dashboard', url: './board' },
    { label: 'Controller', icon: 'view_list', url: './controller' },
    { label: 'Admin', icon: 'settings', url: './admin' },
  ];

  constructor(
    private authService: AuthServices,
    private router: Router
  ) { }

  public user= computed( () => this.authService.currentUser() );

  onLogout() {
    this.authService.logout()
    this.router.navigate(['/auth/login'])

  }

}
