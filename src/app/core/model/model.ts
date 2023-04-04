export enum ContactType {
    emailAddress = 'emailAddress',
    phoneNumber = 'phoneNumber',
}

export enum ContactState {
    unverified = 'unverified',
    verified = 'verified',
}

export interface Contact {
    type: ContactType;
    value: string;
    state?: ContactState;
}

export enum Variant {
    default = '',
    magicLink = 'magic-link',
}
