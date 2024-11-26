import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  pianoAbbonamento = {
    nome: 'Piano Premium',
    prossimoPagamento: '23 dicembre 2024',
    metodoPagamento: '**** 8523',
  };

  profili = [
    { nome: 'Profilo 1', colore: 'blue' },
    { nome: 'Profilo 2', colore: 'red' },
    { nome: 'Profilo 3', colore: 'green' },
    { nome: 'Profilo 4', colore: 'yellow' },
    { nome: 'Profilo 5', colore: 'gray' },
  ];

  gestisciAbbonamento() {
    console.log('Gestisci abbonamento cliccato');
  }

  modificaPiano() {
    console.log('Modifica piano cliccato');
  }
}
