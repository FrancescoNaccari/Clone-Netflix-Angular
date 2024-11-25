import { Component } from '@angular/core';

@Component({
  selector: 'app-impostazioni',
  templateUrl: './impostazioni.component.html',
  styleUrls: ['./impostazioni.component.scss']
})
export class ImpostazioniComponent {
  animazioni: boolean = false;

  eliminaProfilo() {
    const conferma = confirm('Sei sicuro di voler eliminare questo profilo?');
    if (conferma) {
      console.log('Profilo eliminato.');
      // Aggiungi logica per eliminare il profilo
    }
  }
}
