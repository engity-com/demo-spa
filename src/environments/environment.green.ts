export const environment = {
    production: true,
    clientRoot: 'https://demo.engity.green/',
    authorities: {
        '': {
            stsAuthority: 'https://id.demo.engity.green/v1/',
            clientId: '9b867675-0acf-4781-b971-e128b3810310',
        },
        'magic-link': {
            stsAuthority: 'https://id.demo.engity.green/magic-link/v1/',
            clientId: '9b867675-0acf-4781-b971-d128b3810310',
        },
    },
};
