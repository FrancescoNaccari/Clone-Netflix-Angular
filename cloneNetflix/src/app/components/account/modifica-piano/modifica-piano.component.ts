import { Component } from '@angular/core';

@Component({
  selector: 'app-modifica-piano',
  templateUrl: './modifica-piano.component.html',
  styleUrls: ['./modifica-piano.component.scss']
})
export class ModificaPianoComponent {
  selezione: string | null = null;

  scegliPiano(piano: string) {
    this.selezione = piano;
    console.log(`Hai selezionato il piano: ${piano}`);
  }
}
