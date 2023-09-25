import { User } from './user-login.interface';


export interface CheckTokenResponse {
  user: User;
  token: string;
}