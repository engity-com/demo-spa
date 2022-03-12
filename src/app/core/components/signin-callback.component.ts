import {Component, OnInit} from "@angular/core";
import {Router} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Component({
    selector: "app-signin-callback",
    template: `
        <header>
            <img src='/logo.svg' alt="Logo" height="96" />
            <h1>Engity IdP Demo</h1>
            <p>This pages demonstrates the power of a Single Page Application
               together with our Engity IdP.</p>
        </header>
        <div class="forms">
            <div class="control">
                <label for="status">Status</label>
                <ul class="statuses input-like">
                    <li>Finalizing sign in. Please wait...</li>
                </ul>
            </div>

            <div class="button-bar">
                <button disabled>Login</button>
                <button disabled>Renew Token</button>
                <button disabled>Logout</button>
            </div>

        </div>
    `,
    styles: [],
})
export class SigninCallbackComponent implements OnInit {
    constructor(private readonly _router: Router, private readonly _authService: AuthService) {
    }

    async ngOnInit() {
        await this._authService.userManager.signinCallback();
        await this._router.navigate(['']);
    }
}
