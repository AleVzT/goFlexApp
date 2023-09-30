import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserServices } from '../../services/users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styles: [
  ]
})
export class AdminPageComponent implements OnInit {

  isModalOpen: boolean = false;
  users: User[] = [];
  private usersSubscription: Subscription;

  constructor( private userServices: UserServices) {}

  ngOnInit(): void {
    this.getUsers();
    this.usersSubscription = this.userServices.users$.subscribe((users) => {
      this.users = users;
    });
    
  }

  handleAdd(): void {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.getUsers();
  }

  getUsers() {
    this.userServices.getUsers();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

}
