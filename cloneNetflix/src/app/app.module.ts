import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common'; 


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { AccountComponent } from './components/account/account.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthServiceConfig ,SocialLoginModule} from '@abacritt/angularx-social-login';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { LoginComponent } from './components/login/login.component';
import { GoogleLoginComponent } from './components/login/google-login/google-login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModificaPianoComponent } from './components/account/modifica-piano/modifica-piano.component';
import { AbbonamentoComponent } from './components/account/abbonamento/abbonamento.component';
import { UtentExtraComponent } from './components/account/utent-extra/utent-extra.component';
import { GestisciPagamentoComponent } from './components/account/gestisci-pagamento/gestisci-pagamento.component';
import { GestisciDispositiviComponent } from './components/account/gestisci-dispositivi/gestisci-dispositivi.component';
import { AggiornaPasswordComponent } from './components/account/aggiorna-password/aggiorna-password.component';
import { ImpostazioniComponent } from './components/account/impostazioni/impostazioni.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SicurezzaComponent } from './components/account/sicurezza/sicurezza.component';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { MovieModalComponent } from './components/movie-modal/movie-modal.component';
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,

    FooterComponent,
    HomeComponent,
    AccountComponent,
    ProfileComponent,
    NavbarComponent,
    LoginComponent,
    GoogleLoginComponent,
    ModificaPianoComponent,
    AbbonamentoComponent,
    UtentExtraComponent,
    GestisciPagamentoComponent,
    GestisciDispositiviComponent,
    AggiornaPasswordComponent,
    ImpostazioniComponent,
    SidebarComponent,
    SicurezzaComponent,
    SearchResultsComponent,
    MovieModalComponent,
    
  ],
  imports: [
    BrowserModule,    
    CommonModule,
    AppRoutingModule,
    ModalModule.forRoot(),
    CarouselModule.forRoot(),
    FormsModule,
    HttpClientModule,
    SocialLoginModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgbModule,
    BrowserAnimationsModule,
  ],
  providers: [  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  },
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '800518808424-6uhijj53k3b0qq0butjpjc0m3mcver38.apps.googleusercontent.com', {
              scopes: 'openid profile email',
            }
          )
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('clientId')
        }
      ],
      onError: (err) => {
        console.error(err);
      }
    } as SocialAuthServiceConfig,
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
