import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { LoginService } from '../Service/loginService/login.service';

export const guardGuard: CanActivateFn = (route, state) => {
  const loginService=inject(LoginService)
  
  if(loginService.isLoggedIn())
  {
    return true;
  }
  
  return false;
};
