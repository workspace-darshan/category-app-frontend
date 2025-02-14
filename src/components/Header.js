import React from 'react';
import { Link } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { MdLogout } from "react-icons/md";
import { useApi } from '../context/AuthContext';

const Header = () => {
    const { logout, isLoggedIn } = useApi();

    return (
        <>
            <div className="header">
                <div style={{ width: isLoggedIn ? "auto" : "100%", textAlign: isLoggedIn ? "left" : "center" }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                        Multi-Level Category Management App
                    </Typography>
                </div>
                {isLoggedIn ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div className="navigation">
                            <Link>All Categories</Link>
                            <Link>All Subcategories</Link>
                        </div>
                        <div className="logout-button">
                            <button onClick={() => logout()}>
                                <MdLogout style={{ fontWeight: "bold", fontSize: "17px", color: "white" }} />
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default Header;
