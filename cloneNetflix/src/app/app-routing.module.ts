import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guard/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { ModificaPianoComponent } from './components/account/modifica-piano/modifica-piano.component';
import { AbbonamentoComponent } from './components/account/abbonamento/abbonamento.component';
import { UtentExtraComponent } from './components/account/utent-extra/utent-extra.component';
import { AggiornaPasswordComponent } from './components/account/aggiorna-password/aggiorna-password.component';
import { GestisciDispositiviComponent } from './components/account/gestisci-dispositivi/gestisci-dispositivi.component';
import { GestisciPagamentoComponent } from './components/account/gestisci-pagamento/gestisci-pagamento.component';
import { ImpostazioniComponent } from './components/account/impostazioni/impostazioni.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SicurezzaComponent } from './components/account/sicurezza/sicurezza.component';

const routes: Routes = [
  // { path: "", component: DashboardComponent , canActivate: [AuthGuard] },

  { path: "login", component: LoginComponent },
  { path: '', component: HomeComponent },
  // {path: 'account', component: AccountComponent},
  // { path: "profilo", component: ProfileComponent },
  // {path:'modifica-piano', component: ModificaPianoComponent},
  // {path:'abbonamento', component: AbbonamentoComponent},
  // {path:'utentExtra', component: UtentExtraComponent},
  // {path:'aggiorna-password', component: AggiornaPasswordComponent},
  // {path:'gestisci-dispositivi', component: GestisciDispositiviComponent},
  // {path:'gestisci-pagamenti', component: GestisciPagamentoComponent},
  // {path:'impostazioni', component: ImpostazioniComponent},
  // { path: 'sidebar',component: SidebarComponent},



  {
    path: 'sidebar',
    component: SidebarComponent, // Layout principale per la sezione Account
    children: [
      {path: 'account', component: AccountComponent},
      {path: 'sicurezza', component: SicurezzaComponent},
      { path: 'abbonamento', component: AbbonamentoComponent },
      { path: "profilo", component: ProfileComponent },
      {path:'modifica-piano', component: ModificaPianoComponent},
      {path:'abbonamento', component: AbbonamentoComponent},
      {path:'utentExtra', component: UtentExtraComponent},
      {path:'aggiorna-password', component: AggiornaPasswordComponent},
      {path:'gestisci-dispositivi', component: GestisciDispositiviComponent},
      {path:'gestisci-pagamenti', component: GestisciPagamentoComponent},
      {path:'impostazioni', component: ImpostazioniComponent},
      { path: '', redirectTo: 'account', pathMatch: 'full' }, // Route predefinita
    ],
  },
  { path: '', redirectTo: '/sidebar', pathMatch: 'full' }, // Route principale

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
