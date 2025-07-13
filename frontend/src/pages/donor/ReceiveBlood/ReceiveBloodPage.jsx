import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';
import { UserCircle } from 'lucide-react';
import Footer from '../../../components/user/Footer';
import './ReceiveBloodPage.css';
import ReceiveBloodSuccess from '../../medicalfacility/ReceiveBlood/ReceiveBloodSuccess';

export default function ReceiveBloodPage() {
	const navigate = useNavigate();

	// Header logic
	const [isLoggedIn, setIsLoggedIn] = useState(
		localStorage.getItem('isLoggedIn') === 'true'
	);

	const handleLogout = () => {
		localStorage.clear();
		setIsLoggedIn(false);
		navigate('/');
	};

	useEffect(() => {
		const checkLoginStatus = () => {
			setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
		};

		window.addEventListener('storage', checkLoginStatus);
		checkLoginStatus(); // Initial check

		return () => {
			window.removeEventListener('storage', checkLoginStatus);
		};
	}, []);

	let userName = 'Đăng nhập';
	let showDropdown = false;
	if (isLoggedIn) {
		try {
			const userInfo = JSON.parse(localStorage.getItem('userInfo'));
			if (userInfo && userInfo.fullName) {
				userName = userInfo.fullName;
				showDropdown = true;
			} else {
				userName = 'Người dùng';
				showDropdown = true;
			}
		} catch {
			userName = 'Người dùng';
			showDropdown = true;
		}
	}

	const menu = (
		<div
			style={{
				background: 'white',
				border: '1px solid #d9d9d9',
				borderRadius: '6px',
				padding: '4px 0',
				boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
			}}
		>
			<div
				style={{
					padding: '8px 16px',
					cursor: 'pointer',
					borderBottom: '1px solid #f0f0f0',
				}}
				onClick={() => navigate('/medical-facility/profile')}
			>
				Thông tin cơ sở
			</div>
			<div
				style={{
					padding: '8px 16px',
					cursor: 'pointer',
					color: '#ff4d4f',
				}}
				onClick={handleLogout}
			>
				Đăng xuất
			</div>
		</div>
	);
	// End of Header logic

	const [submitted, setSubmitted] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		// For now, just show the success page
		setSubmitted(true);
	};

	if (submitted) {
		return <ReceiveBloodSuccess />;
	}

	return (
		<>
			{/* New Header Component */}
			<div className="header-wrapper">
				<div className="header-top">
					<div
						className="logo-title"
						style={{ cursor: 'pointer' }}
						onClick={() => navigate('/medical-facility')}
					>
						<span className="logo">🏥</span>
						<span className="system-title">Hệ thống Nhận Máu</span>
					</div>
					<div className="user-section">
						{showDropdown ? (
							<Dropdown overlay={menu} trigger={['click']}>
								<div className="login-link" style={{ cursor: 'pointer' }}>
									<UserCircle size={20} />
									<span>{userName} ▾</span>
								</div>
							</Dropdown>
						) : (
							<Link to="/login" className="login-link">
								<UserCircle size={20} />
								<span>Đăng nhập</span>
							</Link>
						)}
					</div>
				</div>
				<nav className="header-nav">
					<a href="/medical-facility">TRANG CHỦ</a>
					<a href="/receiveblood">YÊU CẦU MÁU</a>
					<a href="/medical-facility/history">LỊCH SỬ YÊU CẦU</a>
					<a href="#">TIN TỨC</a>
					<a href="/contact">LIÊN HỆ</a>
				</nav>
			</div>

			{/* Original Form Content */}
			<div className="receive-blood-container">
				<h2>Đăng ký nhận máu</h2>
				<div className="receive-blood-form">
					<p className="form-note">
						Vui lòng điền đầy đủ thông tin để đăng ký nhận máu của cơ sở y tế
						của bạn <span style={{ color: 'red' }}>(*)</span>
					</p>
					<form onSubmit={handleSubmit}>
						<label>Tên cơ sở</label>
						<input type="text" placeholder="Nhập tên cơ sở" required />

						<label>Người liên hệ</label>
						<input type="text" placeholder="Nhập tên người liên hệ" required />

						<label>Số điện thoại liên hệ</label>
						<input type="tel" placeholder="Nhập số điện thoại" required />

						<label>Nhóm máu cần</label>
						<select required>
							<option value="">Chọn nhóm máu</option>
							<option value="A+">A+</option>
							<option value="A-">A-</option>
							<option value="B+">B+</option>
							<option value="B-">B-</option>
							<option value="O+">O+</option>
							<option value="O-">O-</option>
							<option value="AB+">AB+</option>
							<option value="AB-">AB-</option>
						</select>

						<label>Số lượng máu cần (ml)</label>
						<input type="number" placeholder="Nhập số lượng (ml)" required />

						<label>Ngày cần máu</label>
						<input type="date" required />

						<label>Mục đích sử dụng</label>
						<select required>
							<option value="">Chọn mục đích sử dụng</option>
							<option value="1">Cấp cứu</option>
							<option value="2">Điều trị</option>
							<option value="3">Khác</option>
						</select>

						<label>Ghi chú thêm</label>
						<textarea placeholder="Nhập thông tin bổ sung nếu cần..."></textarea>

						<button type="submit" className="submit-btn">
							Gửi yêu cầu
						</button>
					</form>
				</div>
			</div>
			<Footer />
		</>
	);
}