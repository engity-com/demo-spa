export const environment = {
    production: false,
    clientRoot: 'http://localhost:4200/',
    variants: {
        default: {
            stsAuthority: 'http://local.engity.green:8987/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664b',
        },
        magicLink: {
            subPath: 'magic-link',
            stsAuthority: 'http://local.engity.green:8987/magic-link/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664c',
        },
        username: {
            subPath: 'username',
            stsAuthority: 'http://local.engity.green:8987/username/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664d',
        },
    },
};
