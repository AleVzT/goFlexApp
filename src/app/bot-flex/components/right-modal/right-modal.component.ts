import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserServices } from '../../services/users.service';
import { User } from '../../interfaces/user.interface';
import { catchError } from 'rxjs';


@Component({
  selector: 'app-right-modal',
  templateUrl: './right-modal.component.html',
  styles: [
  ]
})
export class RightModalComponent implements OnInit{
  @Output() closeModal = new EventEmitter<void>()
  @Input() user: User;

  public userForm = new FormGroup({
    _id: new FormControl<string>(''),
    fullname: new FormControl<string>('', { nonNullable: true }),
    email: new FormControl<string>('', { nonNullable: true }),
    password: new FormControl<string>('', { nonNullable: true }),
    comment: new FormControl<string>('', { nonNullable: true }),
    telefono: new FormControl<string>('', { nonNullable: true }),
    active: new FormControl<boolean>(true), 
    type: new FormControl<string>('USER'), 
  });

  constructor(
    private userServices: UserServices,
    private snackbar: MatSnackBar,
  ) {}

  get currentUser (): User {
    const user = this.userForm.value as User;
    return user;
  }

  ngOnInit(): void {
    if ( !this.user ) return; 
    this.userForm.reset( this.user );
  }

  onSubmit(): void {
    if ( this.userForm.invalid ) return;
    
    if ( this.currentUser._id ) {
      this.userServices.updateUser(this.currentUser)
        .pipe(
          catchError( error => {
            this.onCloseModal();
            this.showSnackBar(error.error.msg);
            return [];
          })
        )
        .subscribe( user => {
          this.showSnackBar(`${ user.fullname } update!` )
          this.onCloseModal();
        });
      return;
    }

    this.userServices.addUser( this.currentUser )
      .pipe(
        catchError( error => {
          this.onCloseModal();
          this.showSnackBar(error.error.msg);
          return [];
        })
      )
      .subscribe( user => {
        this.onCloseModal();
        this.showSnackBar(`${ user.fullname } created!`);
      })
  }

  onCloseModal() {
    this.closeModal.emit();
  }

  showSnackBar( message: string ):void {
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }

}
