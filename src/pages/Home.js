import React, { lazy } from 'react'
const Tree = lazy(() => import("../components/Tree"));

const Home = () => {
    return (
        <div style={{ marginTop: "50px" }}>
            <Tree />
        </div>
    )
}

export default Home