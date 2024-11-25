import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  abbonamento = {
    piano: 'Piano Premium',
    prossimoPagamento: '23 dicembre 2024',
    carta: '**** 8523',
  };

  profili = [
    { nome: 'Profilo 1', img: 'url_to_image' },
    { nome: 'Profilo 2', img: 'url_to_image' },
  ];

  handleGestisciAbbonamento() {
    console.log('Gestisci abbonamento clicked');
  }
}
