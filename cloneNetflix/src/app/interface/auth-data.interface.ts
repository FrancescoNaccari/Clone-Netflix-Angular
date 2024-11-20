import { User } from "./user.interface";

export interface AuthData {
    accessToken: string;
    user: User;
}
