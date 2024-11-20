import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  // { path: "", component: DashboardComponent , canActivate: [AuthGuard] },

  { path: "", component: LoginComponent },
  { path: "profilo", component: ProfileComponent , canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
