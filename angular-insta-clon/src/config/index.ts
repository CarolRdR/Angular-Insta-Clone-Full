import { environment } from '../environments/environment';

const API_URL: string = `http://${environment.HOST}:${environment.SERVER_PORT}/`;

export { API_URL };
