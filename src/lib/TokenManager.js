import { jwtDecode } from 'jwt-decode';

export class TokenManager {
    static decodeToken(token) {
        try {
            let data = jwtDecode(token);
            return data;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}