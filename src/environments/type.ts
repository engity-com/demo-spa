export interface EnvironmentVariant {
    readonly subPath?: string | undefined;
    readonly stsAuthority: string;
    readonly clientId: string;
    readonly afterLogoutUrl?: string;
}

export interface NamedEnvironmentVariant extends EnvironmentVariant {
    readonly key: string;
}

export interface Environment {
    readonly production: boolean;
    readonly clientRoot: string;
    readonly variants: Record<string, EnvironmentVariant>;
}
