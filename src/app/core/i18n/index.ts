import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import * as de from './de.json';
import * as en from './en.json';

const languages = {
    en: en,
    de: de,
};

export class AppTranslateLoader extends TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        return of(languages[lang]);
    }
}
