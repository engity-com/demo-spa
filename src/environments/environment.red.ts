import type { Environment } from './type';

export const environment: Environment = {
    production: true,
    clientRoot: 'https://demo.engity.app/',
    variants: {
        default: {
            stsAuthority: 'https://id.demo.engity.app/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664b',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'https://id.demo.engity.app/magic-link/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664c',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'https://id.demo.engity.app/username/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664d',
        },
    },
};
