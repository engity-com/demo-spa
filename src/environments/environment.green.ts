export const environment = {
    production: true,
    clientRoot: 'https://demo.engity.green/',
    authorities: {
        default: {
            stsAuthority: 'https://id.demo.engity.green/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664b',
        },
        magicLink: {
            stsAuthority: 'https://id.demo.engity.green/magic-link/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664c',
        },
        username: {
            stsAuthority: 'https://id.demo.engity.green/username/v1/',
            clientId: '12f95feb-9e3e-11ec-93d7-f02f741c664d',
        },
    },
};
