import type { Environment } from './type';

export const environment: Environment = {
    production: false,
    clientRoot: 'https://local.engity.dev:4200/',
    variants: {
        default: {
            stsAuthority: 'https://id.local.engity.dev:8988/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe2',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'https://id.local.engity.dev:8988/magic-link/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe3',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'https://id.local.engity.dev:8988/username/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe4',
        },
        tfaRequired: {
            subPath: 'tfa-required',
            stsAuthority: 'https://id.local.engity.dev:8988/tfa-required/v1/',
            clientId: '9KjGEminbyhUB5sXAn3bBT',
        },
        tfaForbidden: {
            subPath: 'tfa-forbidden',
            stsAuthority: 'https://id.local.engity.dev:8988/tfa-forbidden/v1/',
            clientId: '6Ud9hjFmUQfHQTQp1o4KQH',
        },
        exposeExistence: {
            subPath: 'existence-expose',
            stsAuthority: 'https://id.local.engity.dev:8988/existence-expose/v1/',
            clientId: 'ExpsjPRjj6oVhaJTqvYvN9',
        },
    },
};
