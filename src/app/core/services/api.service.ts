import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Contact } from '../model/model';
import { AuthService } from './auth.service';
import { Variant, VariantService } from './variant.service';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(
        private readonly _httpClient: HttpClient,
        private readonly _authService: AuthService,
        private readonly _translateService: TranslateService,
        private readonly _variantService: VariantService,
    ) {}

    async triggerVerifyContact(contact: Contact): Promise<void> {
        const metadata = await this._authService.metadata;
        const url = metadata['trigger_verify_contact'];
        if (!url) {
            throw `Remote IdP does not support trigger_verify_contact method.`;
        }
        await this._callApi((client, authorization) =>
            client.put(
                url,
                {
                    contact: contact,
                },
                {
                    headers: new HttpHeaders({
                        Accept: 'application/json',
                        Authorization: authorization,
                        'Accept-Language': this._translateService.currentLang,
                    }),
                },
            ),
        );
    }

    private async _callApi(rc: RequestCreator): Promise<any> {
        const variant = await firstValueFrom(this._variantService.active);
        const user = await firstValueFrom(this._authService.user);
        if (user && user.access_token) {
            return await this._callApiWithVariant(variant, rc, user.access_token);
        }
        if (user) {
            const renewedUser = await this._authService.renew();
            if (renewedUser) {
                return await this._callApiWithVariant(variant, rc, renewedUser.access_token);
            }
        }
        throw new Error('user is not logged in');
    }

    private async _callApiWithVariant(variant: Variant, rc: RequestCreator, token: string, run: number = 0) {
        try {
            return firstValueFrom(rc(this._httpClient, 'Bearer ' + token, variant.authority.apiRoot));
        } catch (result) {
            if (result instanceof HttpErrorResponse && result.status === 401 && run < 5) {
                console.warn(
                    "Looks like we're don't have any longer access to the target API. Try to refresh the tokens...",
                );
                const user = await this._authService.renew();
                return await this._callApiWithVariant(variant, rc, user.access_token, run + 1);
            }
            throw result;
        }
    }
}

declare type RequestCreator = (client: HttpClient, authorization: string, root: string) => Observable<any>;
