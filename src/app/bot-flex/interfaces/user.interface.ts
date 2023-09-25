
export interface User {
  _id:        string;
  fullname:   string;
  email:      string;
  comment:    string;
  password:   string;
  type:       TypeUser;
  telefono:   string;
  active:     boolean;
}

export enum TypeUser {
  USER = 'user',
  ADMIN = 'admin'
}

export enum BaseOn {
  HOURS = "HOURS",
  BLOCK = "BLOCK"
}