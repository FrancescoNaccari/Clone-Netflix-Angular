import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profili = [
    { nome: 'Vincenzo', colore: '#007bff', tuo: false },
    { nome: 'Tiziana', colore: '#ffc107', tuo: false },
    { nome: 'Salvo', colore: '#dc3545', tuo: true },
    { nome: 'Concetta', colore: '#343a40', tuo: false },
    { nome: 'Massimo', colore: '#28a745', tuo: false },
  ];
}
