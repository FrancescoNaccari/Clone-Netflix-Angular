import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { ModificaPianoComponent } from './components/account/modifica-piano/modifica-piano.component';
import { AbbonamentoComponent } from './components/account/abbonamento/abbonamento.component';
import { UtentExtraComponent } from './components/account/utent-extra/utent-extra.component';

const routes: Routes = [
  // { path: "", component: DashboardComponent , canActivate: [AuthGuard] },

  { path: "", component: LoginComponent },
  { path: 'home', component: HomeComponent },
  {path: 'account', component: AccountComponent},
  { path: "profilo", component: ProfileComponent , canActivate: [AuthGuard] },
  {path:'modifica-piano', component: ModificaPianoComponent},
  {path:'abbonamento', component: AbbonamentoComponent},
  {path:'utentExtra', component: UtentExtraComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
