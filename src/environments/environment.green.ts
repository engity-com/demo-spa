import type { Environment } from './type';

export const environment: Environment = {
    production: true,
    clientRoot: 'https://demo.engity.green/',
    variants: {
        default: {
            stsAuthority: 'https://id.demo.engity.green/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe2',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'https://id.demo.engity.green/magic-link/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe3',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'https://id.demo.engity.green/username/v1/',
            clientId: '3LtsS8SrpAwkAEs5eBUVe4',
        },
        tfaRequired: {
            subPath: 'tfa-required',
            stsAuthority: 'https://id.demo.engity.green/tfa-required/v1/',
            clientId: '9KjGEminbyhUB5sXAn3bBT',
        },
        tfaForbidden: {
            subPath: 'tfa-forbidden',
            stsAuthority: 'https://id.demo.engity.green/tfa-forbidden/v1/',
            clientId: '6Ud9hjFmUQfHQTQp1o4KQH',
        },
        exposeExistence: {
            subPath: 'existence-expose',
            stsAuthority: 'https://id.demo.engity.green/existence-expose/v1/',
            clientId: 'ExpsjPRjj6oVhaJTqvYvN9',
        },
    },
};
