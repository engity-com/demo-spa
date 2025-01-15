export const environment = {
    production: false,
    clientRoot: 'https://local.engity.dev:4200/',
    variants: {
        default: {
            stsAuthority: 'https://id.local.engity.dev:8988/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664b',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'https://id.local.engity.dev:8988/magic-link/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664c',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'https://id.local.engity.dev:8988/username/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664d',
        },
    },
};
