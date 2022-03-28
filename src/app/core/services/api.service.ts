import {
    HttpClient,
    HttpErrorResponse,
    HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'oidc-client-ts';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Contact } from '../model/model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(
        private readonly httpClient: HttpClient,
        private readonly authService: AuthService
    ) {}

    public triggerVerifyContact(contact: Contact): Promise<void> {
        return this.authService.metadata
            .then((metadata) => {
                const url = metadata['trigger_verify_contact'];
                if (!url) {
                    throw `Remote IdP does not support trigger_verify_contact method.`;
                }
                return url;
            })
            .then((url) =>
                this.callApi((client, authorization) =>
                    client.put(url, contact, {
                        headers: new HttpHeaders({
                            Accept: 'application/json',
                            Authorization: authorization,
                        }),
                    })
                )
            );
    }

    private callApi(rc: RequestCreator): Promise<any> {
        return this.authService.getUser().then((user: User) => {
            if (user && user.access_token) {
                return this._callApi(rc, user.access_token);
            } else if (user) {
                return this.authService.renewToken().then((user: User) => {
                    return this._callApi(rc, user.access_token);
                });
            } else {
                throw new Error('user is not logged in');
            }
        });
    }

    private _callApi(rc: RequestCreator, token: string, run: number = 0) {
        const headers = new HttpHeaders({
            Accept: 'application/json',
            Authorization: 'Bearer ' + token,
        });

        return firstValueFrom(
            rc(this.httpClient, 'Bearer ' + token, environment.apiRoot)
        ).catch((result: HttpErrorResponse) => {
            if (result.status === 401 && run < 5) {
                console.warn(
                    "Looks like we're don't have any longer access to the target API. Try to refresh the tokens..."
                );
                return this.authService.renewToken().then((user: User) => {
                    return this._callApi(rc, user.access_token, run + 1);
                });
            }
            throw result;
        });
    }
}

declare type RequestCreator = (
    client: HttpClient,
    authorization: string,
    root: string
) => Observable<any>;
