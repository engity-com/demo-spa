import './Avatar.css';
import { Avatar as RAvatar } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { type AuthContextProps, useAuth } from 'react-oidc-context';

interface AvatarProps {
    readonly src?: string | undefined;
    readonly name: string;
    readonly initials: string;
}

export function Avatar(props: AvatarProps) {
    return <RAvatar fallback={props.initials} src={props.src} className='Avatar' radius='full' />;
}

export function CurrentUserAvatar() {
    const { t } = useTranslation();
    const auth = useAuth();
    const name = extractName(auth) || t('anonymous');
    const initials = extractInitials(auth) || t('anonymous.initials');
    return <Avatar name={name} initials={initials} />;
}

function extractName(auth: AuthContextProps): string | undefined {
    const user = auth.user;
    if (!user) {
        return undefined;
    }
    const profile = user.profile;
    if (profile.name) {
        return profile.name;
    }
    if (profile.given_name && profile.family_name) {
        return `${profile.given_name} ${profile.family_name}`;
    }
    if (profile.given_name) {
        return profile.given_name;
    }
    if (profile.family_name) {
        return profile.family_name;
    }
    if (profile.email) {
        return profile.email;
    }
    return undefined;
}

function extractInitials(auth: AuthContextProps): string | undefined {
    const user = auth.user;
    if (!user) {
        return undefined;
    }
    const profile = user.profile;
    if (profile.given_name && profile.family_name) {
        return profile.given_name[0].toUpperCase() + profile.family_name[0].toUpperCase();
    }
    if (profile.given_name) {
        return profile.given_name[0].toUpperCase();
    }
    if (profile.family_name) {
        return profile.family_name[0].toUpperCase();
    }
    if (profile.name) {
        const parts = profile.name.split(/[,;. ]+/);
        if (parts.length === 1) {
            return parts[0].toUpperCase();
        }
        return parts[0].toUpperCase() + parts[parts.length - 1].toUpperCase();
    }
    if (profile.email) {
        return profile.email;
    }
    return undefined;
}
