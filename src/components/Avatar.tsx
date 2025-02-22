import './Avatar.css';
import { Avatar as RAvatar } from 'radix-ui';
import { type AuthContextProps, useAuth } from 'react-oidc-context';

interface AvatarProps {
    readonly src?: string | undefined;
    readonly name: string;
    readonly initials: string;
}

export function Avatar(props: AvatarProps) {
    return (
        <RAvatar.Root className='Avatar' title={props.name}>
            <RAvatar.Image className='Image' src={props.src} alt={props.name} />
            <RAvatar.Fallback className='Fallback' delayMs={props.src ? 600 : 0}>
                {props.initials}
            </RAvatar.Fallback>
        </RAvatar.Root>
    );
}

export function CurrentUserAvatar() {
    const auth = useAuth();
    const name = extractName(auth) || 'Anonymous';
    const initials = extractInitials(auth) || 'AN';
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
