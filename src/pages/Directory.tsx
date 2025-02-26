import { RouterOutlet } from '@/components';

export function Directory() {
    return <RouterOutlet onExactMatch={{ children: true }}>Moo</RouterOutlet>;
}
