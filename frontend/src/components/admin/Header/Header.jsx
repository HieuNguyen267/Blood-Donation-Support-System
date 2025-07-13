import React, { useState, useEffect, useRef } from "react";
import './Header.css';
import { FaBell, FaEnvelope, FaSearch, FaUserCircle, FaCog, FaUserEdit, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAdmin } from '../../../contexts/AdminContext';

const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const { adminInfo } = useAdmin();
    
    // Debug log
    console.log('Header received adminInfo from context:', adminInfo);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login', { replace: true });
    };

    return (
        <header className="main-header">
            {/* Left Section: Logo and Title */}
            <div className="header-left">
                <div className="header-logo">
                    <img src="/blood-drop.svg" alt="Logo" /> 
                </div>
                <div className="header-title">Hiến máu tình nguyện</div>
            </div>

            {/* Center Section: Search Bar */}
            <div className="header-center">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input type="text" placeholder="Tìm kiếm chức năng, báo cáo..." />
                </div>
            </div>

            {/* Right Section: Icons and User */}
            <div className="header-right">
                <div className="header-icon-group">
                    <button className="icon-button">
                        <FaEnvelope />
                    </button>
                    <button className="icon-button">
                        <FaBell />
                        <span className="notification-badge">3</span>
                    </button>
                </div>

                {/* --- User Profile with Dropdown --- */}
                <div className="user-profile-wrapper" ref={dropdownRef}>
                    <Link to="/admin/profile" className="user-profile-link">
                        <FaUserCircle size={28} />
                        <span>{adminInfo?.fullName || adminInfo?.full_name || "Admin"}</span>
                    </Link>
                    <button className="dropdown-toggle-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        <FaCaretDown />
                    </button>

                    {isDropdownOpen && (
                        <div className="profile-dropdown">
                            <div className="dropdown-header">
                                <FaUserCircle size={40} className="dropdown-avatar" />
                                <div className="user-info">
                                    <span className="user-name">{adminInfo?.fullName || adminInfo?.full_name || "Admin"}</span>
                                    <span className="user-email">{adminInfo?.email || ""}</span>
                                </div>
                            </div>
                            <div className="dropdown-body">
                                <Link to="/admin/profile" className="dropdown-item">
                                    <FaUserEdit className="dropdown-icon" />
                                    <span>Thông tin tài khoản</span>
                                </Link>
                                <Link to="/admin/settings" className="dropdown-item">
                                    <FaCog className="dropdown-icon" />
                                    <span>Cài đặt</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="dropdown-item dropdown-item-logout">
                                    <FaSignOutAlt className="dropdown-icon" />
                                    <span>Đăng xuất</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;