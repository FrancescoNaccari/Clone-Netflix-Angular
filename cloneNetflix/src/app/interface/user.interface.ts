export interface User {
  idUser: number;
  nome: string;
  cognome: string;
  email: string;
  password?: string; // Solo se necessario per aggiornamenti
  username: string;
  avatar?: string; // URL dell'immagine avatar
  dataNascita: Date;
  provider?: string;
  telefono: string;
  indirizzo: string;
  codiceFiscale: string;
  statoUtente: string; // Es: "Attivo", "Sospeso", ecc.
  tipoUser: TipoUser;
    }
    
    // Enum per il TipoUser
    export enum TipoUser {
      ADMIN = 'ADMIN',
      USER = 'USER',

    }