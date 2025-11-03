import React from 'react';
import SideBar from './SideBar';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
    return (
        <div style={styles.wrapper}>
            <SideBar />
            <div style={styles.content}>
                <Outlet />
            </div>
        </div>
    );
};

const styles = {
    wrapper: { display: 'flex', padding: '0 220px'/*, minHeight: '100vh'*/ },
    content: {
        flex: 1,
        padding: '20px',
        marginLeft: '240px',
    },
};




export default MainLayout;
