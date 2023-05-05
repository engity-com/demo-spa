import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'oidc-client-ts';
import { firstValueFrom, Observable } from 'rxjs';
import { Contact } from '../model/model';
import { AuthService } from './auth.service';
import { Variant } from './variant.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private readonly httpClient: HttpClient, private readonly authService: AuthService) {}

    public async triggerVerifyContact(variant: Variant, contact: Contact): Promise<void> {
        const metadata = await this.authService.metadata(variant);
        const url = metadata['trigger_verify_contact'];
        if (!url) {
            throw `Remote IdP does not support trigger_verify_contact method.`;
        }
        await this.callApi(variant, (client, authorization) =>
            client.put(
                url,
                {
                    contact: contact,
                },
                {
                    headers: new HttpHeaders({
                        Accept: 'application/json',
                        Authorization: authorization,
                    }),
                }
            )
        );
    }

    private async callApi(variant: Variant, rc: RequestCreator) {
        const user = await this.authService.getUser(variant);
        if (user && user.access_token) {
            return await this._callApi(variant, rc, user.access_token);
        }
        if (user) {
            const renewedUser = await this.authService.renewToken(variant);
            if (renewedUser) {
                return await this._callApi(variant, rc, renewedUser.access_token);
            }
        }
        throw new Error('user is not logged in');
    }

    private async _callApi(variant: Variant, rc: RequestCreator, token: string, run: number = 0) {
        try {
            return firstValueFrom(rc(this.httpClient, 'Bearer ' + token, variant.authority.apiRoot));
        } catch (result) {
            if (result instanceof HttpErrorResponse && result.status === 401 && run < 5) {
                console.warn(
                    "Looks like we're don't have any longer access to the target API. Try to refresh the tokens..."
                );
                return this.authService.renewToken(variant).then((user: User) => {
                    return this._callApi(variant, rc, user.access_token, run + 1);
                });
            }
            throw result;
        }
    }
}

declare type RequestCreator = (client: HttpClient, authorization: string, root: string) => Observable<any>;
