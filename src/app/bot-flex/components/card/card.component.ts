import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserServices } from '../../services/users.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'users-user-card',
  templateUrl: './card.component.html',
  styles: [
  ]
})
export class CardComponent implements OnInit {

  isModalOpen: boolean = false;

  @Input()
    public user!: User;
  @Output() 
    public updateList = new EventEmitter<void>()

  constructor(
    private userServices: UserServices,
    private snackbar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    if ( !this.user ) throw Error('User property is required')
  }

  handleChangeState(user: User): void {
    const customerUser = {
      ...user,
      active: !user.active
    };
    this.userServices.updateUser(customerUser)
    .subscribe( resp => {
      this.showSnackBar(`${ user.fullname } update!` )
    });
    this.updateList.emit();
  }

  handleEdit(user: User): void {
    this.isModalOpen = true;
  }

  handleDelete(user: User): void {
    this.userServices.deleteUserById(user._id)
      .subscribe( resp => {
        if (resp) {
          this.showSnackBar(`Usuario ${ user.fullname } Eliminado!` )
        } else {
          this.showSnackBar(`Error al intentar eliminar el usuario!` )
        }
      });
    this.updateList.emit();
  }

  closeModal() {
    this.isModalOpen = false;
    this.updateList.emit();
  }

  showSnackBar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }

}
