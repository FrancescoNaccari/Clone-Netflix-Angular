import { Component } from '@angular/core';

@Component({
  selector: 'app-gestisci-dispositivi',
  templateUrl: './gestisci-dispositivi.component.html',
  styleUrls: ['./gestisci-dispositivi.component.scss']
})
export class GestisciDispositiviComponent {
  dispositivi = [
    {
      nome: 'PC Chrome - Browser web',
      profilo: 'Nessun profilo da mostrare',
      data: '26/11/24, 12:11 GMT+1',
      attuale: true,
    },
    {
      nome: 'PC Chrome - Browser web',
      profilo: 'Concetta (ultima visione)',
      data: '26/11/24, 00:33 GMT+1',
      attuale: false,
    },
    {
      nome: 'Akai - Smart TV',
      profilo: 'Nessun profilo da mostrare',
      data: '25/11/24, 07:14 GMT+1',
      attuale: false,
    },
    {
      nome: 'Samsung - Smart TV',
      profilo: 'Tiziana (ultima visione)',
      data: '24/11/24, 23:57 GMT+1',
      attuale: false,
    },
  ];

  disconnettiDispositivo(dispositivo: any) {
    if (confirm(`Sei sicuro di voler disconnettere ${dispositivo.nome}?`)) {
      console.log(`Dispositivo disconnesso: ${dispositivo.nome}`);
      this.dispositivi = this.dispositivi.filter((d) => d !== dispositivo);
    }
  }

  disconnettiTutti() {
    if (confirm('Sei sicuro di voler disconnettere tutti i dispositivi?')) {
      console.log('Tutti i dispositivi disconnessi.');
      this.dispositivi = [];
    }
  }
}
