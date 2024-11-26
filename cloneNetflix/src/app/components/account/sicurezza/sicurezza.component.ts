import { Component } from '@angular/core';

@Component({
  selector: 'app-sicurezza',
  templateUrl: './sicurezza.component.html',
  styleUrls: ['./sicurezza.component.scss']
})
export class SicurezzaComponent {
  verificaNumero() {
    console.log('Verifica del numero di telefono avviata.');
    // Aggiungi qui la logica per la verifica del numero di telefono
  }

  eliminaAccount() {
    if (confirm('Sei sicuro di voler eliminare il tuo account?')) {
      console.log('Account eliminato.');
      // Aggiungi qui la logica per eliminare l'account
    }
  }
}
