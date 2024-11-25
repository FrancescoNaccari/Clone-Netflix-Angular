import { Component } from '@angular/core';

@Component({
  selector: 'app-gestisci-pagamento',
  templateUrl: './gestisci-pagamento.component.html',
  styleUrls: ['./gestisci-pagamento.component.scss']
})
export class GestisciPagamentoComponent {
  metodoPagamento = {
    tipo: 'Mastercard',
    numero: '****8523',
  };

  aggiornaMetodo() {
    console.log('Aggiorna metodo di pagamento');
    // Logica per aggiornare il metodo di pagamento
  }

  aggiungiMetodo() {
    console.log('Aggiungi un nuovo metodo di pagamento');
    // Logica per aggiungere un nuovo metodo di pagamento
  }
}
