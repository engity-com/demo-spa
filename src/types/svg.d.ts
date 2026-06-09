declare module '*.svg' {
    import type * as React from 'react';
    const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & {
            className?: string | undefined;
            id?: string | undefined;
            title?: string | undefined;
            alt?: string | undefined;
        }
    >;
    // noinspection JSUnusedGlobalSymbols
    export default ReactComponent;
}
