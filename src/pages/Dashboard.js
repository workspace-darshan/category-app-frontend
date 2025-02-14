import { lazy } from 'react';
import './App.css';
const Tree = lazy(() => import("./components/Tree"));
const Header = lazy(() => import("./components/Header"));

function Dashboard() {
    return (
        <div className="App">
            <div className="main">
                {/*header  */}
                <Header />
                {/* =================== */}

                {/* Tree */}
                <div style={{ width: "100%", marginTop: "50px" }}>
                    <Tree />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
