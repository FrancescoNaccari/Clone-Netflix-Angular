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
      data: '25/11/24, 18:38 GMT+1',
      attuale: true,
    },
    {
      nome: 'PC Chrome - Browser web',
      profilo: 'Concetta (ultima visione)',
      data: '25/11/24, 12:03 GMT+1',
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
    {
      nome: 'LG - Smart TV',
      profilo: 'Vincenzo (ultima visione)',
      data: '24/11/24, 22:07 GMT+1',
      attuale: false,
    },
  ];

  disconnetti(device: any) {
    const conferma = confirm(`Sei sicuro di voler disconnettere ${device.nome}?`);
    if (conferma) {
      console.log(`${device.nome} disconnesso.`);
      // Logica per rimuovere il dispositivo dalla lista
      this.dispositivi = this.dispositivi.filter((d) => d !== device);
    }
  }
}
