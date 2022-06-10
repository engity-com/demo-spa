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

    public async triggerVerifyContact(contact: Contact): Promise<void> {
        const metadata = await this.authService.metadata;
        const url = metadata['trigger_verify_contact'];
        if (!url) {
            throw `Remote IdP does not support trigger_verify_contact method.`;
        }
        await this.callApi((client, authorization) =>
            client.put(url, contact, {
                headers: new HttpHeaders({
                    Accept: 'application/json',
                    Authorization: authorization,
                }),
            })
        );
    }

    private async callApi(rc: RequestCreator) {
        const user = await this.authService.getUser();
        if (user && user.access_token) {
            return await this._callApi(rc, user.access_token);
        }
        if (user) {
            const renewedUser = await this.authService.renewToken();
            if (renewedUser) {
                return await this._callApi(rc, renewedUser.access_token);
            }
        }
        throw new Error('user is not logged in');
    }

    private async _callApi(rc: RequestCreator, token: string, run: number = 0) {
        try {
            return firstValueFrom(
                rc(this.httpClient, 'Bearer ' + token, environment.apiRoot)
            );
        } catch (result) {
            if (
                result instanceof HttpErrorResponse &&
                result.status === 401 &&
                run < 5
            ) {
                console.warn(
                    "Looks like we're don't have any longer access to the target API. Try to refresh the tokens..."
                );
                return this.authService.renewToken().then((user: User) => {
                    return this._callApi(rc, user.access_token, run + 1);
                });
            }
            throw result;
        }
    }
}

declare type RequestCreator = (
    client: HttpClient,
    authorization: string,
    root: string
) => Observable<any>;
