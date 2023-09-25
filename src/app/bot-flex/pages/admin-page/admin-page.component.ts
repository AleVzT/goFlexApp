import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserServices } from '../../services/users.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styles: [
  ]
})
export class AdminPageComponent implements OnInit {

  isModalOpen: boolean = false;
  public users: User[] = [];

  constructor( private userServices: UserServices) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userServices.getUsers()
    .subscribe( users => this.users = users );
  }

  handleAdd(): void {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.getUsers();
  }



}
