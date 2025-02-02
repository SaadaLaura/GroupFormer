export class LoginResponse {
    constructor(
      public token: string,
      public first_connection: string
    ) {}
  }
  
  export class ChangePasswordResponse {
    constructor(
      public message: string,
      public token: string
    ) {}
  }