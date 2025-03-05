export interface EnvironmentVariant {
    readonly subPath?: string | undefined;
    readonly stsAuthority: string;
    readonly clientId: string;
}

export interface NamedEnvironmentVariant extends EnvironmentVariant {
    readonly key: string;
}

export interface Environment {
    readonly production: boolean;
    readonly clientRoot: string;
    readonly afterLogoutUrl?: string;
    readonly variants: Record<string, EnvironmentVariant>;
}
