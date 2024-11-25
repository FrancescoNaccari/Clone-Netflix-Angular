import { Component } from '@angular/core';

@Component({
  selector: 'app-abbonamento',
  templateUrl: './abbonamento.component.html',
  styleUrls: ['./abbonamento.component.scss']
})
export class AbbonamentoComponent {
  prossimoPagamento = '23 dicembre 2024';
  metodoPagamento = '**** 9999';

  disdiciAbbonamento() {
    if (confirm('Sei sicuro di voler disdire l’abbonamento?')) {
      console.log('Abbonamento disdetto.');
    }
  }
}
