import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { Profile } from './pages/profile/profile';
import { AuthGuard } from './guards/auth.guard';
import { PostDetails } from './pages/post-details/post-details';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [AuthGuard],
  },
  { path: 'post/:id', component: PostDetails },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
