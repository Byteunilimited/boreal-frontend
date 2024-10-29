import { TableHead } from "./TableHead";
import { TableBody } from "./TableBody";
import { TableFoot } from "./TableFoot";
import './Table.css';

export const Table = ({ style, props }) => {
    const head = props?.head || {};
    const body = props?.data || {};
    const foot = props?.foot || {};

    return (
        <table className={`${style || ''}Table`}>
            <thead>
                <TableHead data={head} />
            </thead>
            <tbody>
                <TableBody data={body} />
            </tbody>
            <tfoot>
                <TableFoot data={foot} />
            </tfoot>
        </table>
    );
}
