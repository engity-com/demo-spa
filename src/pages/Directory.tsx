import { RouterOutlet } from '@/components/RouterOutlet';

export function Directory() {
    return <RouterOutlet onExactMatch={{ children: true }}>Moo</RouterOutlet>;
}
