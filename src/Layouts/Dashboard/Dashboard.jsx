import { Header, Menu } from '@/Layouts/';
import "./Dashboard.css";

export const Dashboard = ({ props }) => {
    const { children } = props;
    const { header } = props;

    return (
        <div className='dashboard'>
            <div className='sidebar'>
                <Menu />
            </div>
            <div className='header'>
                <Header props={ header }/>
            </div>
            <main className="main">
                { children }
            </main>
        </div>
    );
};
