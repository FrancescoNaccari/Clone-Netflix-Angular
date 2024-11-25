import { Component } from '@angular/core';

@Component({
  selector: 'app-aggiorna-password',
  templateUrl: './aggiorna-password.component.html',
  styleUrls: ['./aggiorna-password.component.scss']
})
export class AggiornaPasswordComponent {
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  logoutDevices: boolean = false;

  modificaPassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('Le nuove password non corrispondono.');
      return;
    }

    console.log('Password aggiornata con successo:', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      logoutDevices: this.logoutDevices,
    });

    // Qui puoi chiamare il servizio per aggiornare la password
  }

  annulla() {
    console.log('Operazione annullata.');
    // Reindirizza o resetta il form
  }
}
