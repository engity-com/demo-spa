import type { ReactElement } from 'react';
import './Columns.css';

interface ColumnsProps {
    readonly columns: '2' | 2 | '3' | 3 | '4' | 4;
    readonly children: ReactElement[];
}

export function Columns(props: ColumnsProps) {
    const columns = typeof props.columns === 'string' ? Number.parseInt(props.columns) : props.columns;
    if (props.children.length % columns !== 0) {
        throw Error(`An amount of child elements which is a multiply of ${columns}; but got: ${props.children.length}.`);
    }

    return (
        <ul className='Columns' data-columns={columns}>
            {props.children.map((c, i) => (
                <li key={c.key || `c${i}`}>{c}</li>
            ))}
        </ul>
    );
}
