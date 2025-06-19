import React from "react";
import './Header.css';
import { UserCircle } from "lucide-react";

const Header = () => {
    return (
        <header className="main-header">
            <div className="main-header-title">Hiến máu tình nguyện</div>
            <div className="main-header-menu">☰</div>
            <div className="header-right">
                <a href="/login" className="login-link">
                <UserCircle size={20} />
                <span>Đăng nhập</span>
                </a>
            </div>
        </header>
    );
};

export default Header;