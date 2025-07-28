import React from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { adminDonationProcessAPI } from '../../services/admin/donationProcess';
import { bloodRequestAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Select, Button, Card, Table, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import * as XLSX from 'xlsx';

const MONTHS = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
const COLORS = ['#60a5fa', '#fbbf24', '#f87171', '#10b981'];

export default function Statistics() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [donationCount, setDonationCount] = React.useState(0);
  const [requestCount, setRequestCount] = React.useState(0);
  const [emergencyCount, setEmergencyCount] = React.useState(0);
  const [bloodReceived, setBloodReceived] = React.useState(0);
  const [bloodSent, setBloodSent] = React.useState(0);
  const [monthlyData, setMonthlyData] = React.useState([]);
  
  // State cho báo cáo
  const [reportType, setReportType] = React.useState('month'); // 'month' hoặc 'year'
  const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);
  const [reportData, setReportData] = React.useState({
    donationCount: 0,
    requestCount: 0,
    emergencyCount: 0,
    bloodReceived: 0,
    bloodSent: 0
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        // Lấy cả hai loại dữ liệu cùng lúc
        const [donationProcesses, requests] = await Promise.all([
          adminDonationProcessAPI.getAllForProcessManagement(),
          bloodRequestAPI.getAllAdminBloodRequests()
        ]);

        // Tính toán dữ liệu người hiến máu
        const donationCount = donationProcesses.filter(d => {
          let dateStr = d.donateDate || d.donationDate || d.appointment_date || d.appointmentDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        }).length;
        setDonationCount(donationCount);

        // Tính tổng lượng máu đã nhận trong tháng (trạng thái hoàn thành)
        const receivedBlood = donationProcesses.filter(d => {
          let dateStr = d.donateDate || d.donationDate || d.appointment_date || d.appointmentDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          const isCompleted = d.donation_status === 'completed' || d.donationStatus === 'completed';
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear && isCompleted;
        }).reduce((total, d) => {
          const quantity = d.quantity_ml || d.quantityMl || 0;
          return total + (parseInt(quantity) || 0);
        }, 0);
        setBloodReceived(receivedBlood);

        // Tính toán dữ liệu đơn yêu cầu máu
        const requestCount = requests.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear;
        }).length;
        setRequestCount(requestCount);

        // Đếm đơn khẩn cấp
        const emergencyCount = requests.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          const isEmergency = r.isEmergency === true || r.isEmergency === 'true' || r.is_emergency === true || r.is_emergency === 'true';
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear && isEmergency;
        }).length;
        setEmergencyCount(emergencyCount);

        // Tính tổng lượng máu đã gửi trong tháng (processing_status completed)
        const completedRequests = requests.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          const isCompleted = r.processingStatus === 'completed' || r.processingStatus === 'Hoàn thành' || r.processing_status === 'completed';
          return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear && isCompleted;
        });

        console.log('Completed requests this month:', completedRequests.length);
        completedRequests.forEach((r, index) => {
          console.log(`Request ${index + 1}:`, {
            id: r.requestId,
            processingStatus: r.processingStatus,
            quantityRequested: r.quantityRequested,
            requiredBy: r.requiredBy
          });
        });

        const sentBlood = completedRequests.reduce((total, r) => {
          const quantity = r.quantityRequested || r.quantity_requested || 0;
          return total + (parseInt(quantity) || 0);
        }, 0);
        setBloodSent(sentBlood);

        // Cập nhật dữ liệu báo cáo
        setReportData({
          donationCount: donationCount,
          requestCount: requestCount,
          emergencyCount: emergencyCount,
          bloodReceived: receivedBlood,
          bloodSent: sentBlood
        });

        // Tính toán dữ liệu cho biểu đồ cột
        const donationCounts = Array(12).fill(0);
        donationProcesses.forEach(d => {
          let dateStr = d.donateDate || d.donationDate || d.appointment_date || d.appointmentDate;
          if (!dateStr) return;
          const date = new Date(dateStr);
          if (date.getFullYear() !== currentYear) return;
          donationCounts[date.getMonth()]++;
        });

        const requestCounts = Array(12).fill(0);
        requests.forEach(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return;
          const date = new Date(dateStr);
          if (date.getFullYear() !== currentYear) return;
          requestCounts[date.getMonth()]++;
        });

        // Cập nhật monthlyData
        setMonthlyData(MONTHS.map((m, i) => ({ 
          month: m, 
          "Người hiến": donationCounts[i], 
          "Đơn yêu cầu": requestCounts[i] 
        })));

      } catch (error) {
        console.error('Error fetching stats:', error);
        setDonationCount(0);
        setRequestCount(0);
        setEmergencyCount(0);
        setBloodReceived(0);
        setBloodSent(0);
        setMonthlyData(MONTHS.map(m => ({ month: m, "Người hiến": 0, "Đơn yêu cầu": 0 })));
      }
    };
    fetchStats();
  }, [currentMonth, currentYear]);

  // Hàm tính toán dữ liệu báo cáo theo thời gian được chọn
  const calculateReportData = React.useCallback(async () => {
    try {
      const donationProcesses = await adminDonationProcessAPI.getAllForProcessManagement();
      const requests = await bloodRequestAPI.getAllAdminBloodRequests();
      
      let filteredDonations, filteredRequests;
      
      if (reportType === 'month') {
        // Lọc theo tháng cụ thể
        filteredDonations = donationProcesses.filter(d => {
          let dateStr = d.donateDate || d.donationDate || d.appointment_date || d.appointmentDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
        });
        
        filteredRequests = requests.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
        });
      } else {
        // Lọc theo năm
        filteredDonations = donationProcesses.filter(d => {
          let dateStr = d.donateDate || d.donationDate || d.appointment_date || d.appointmentDate;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getFullYear() === selectedYear;
        });
        
        filteredRequests = requests.filter(r => {
          let dateStr = r.requiredBy || r.required_by;
          if (!dateStr) return false;
          const date = new Date(dateStr);
          return date.getFullYear() === selectedYear;
        });
      }
      
      // Tính toán các chỉ số
      const donationCount = filteredDonations.length;
      const requestCount = filteredRequests.length;
      const emergencyCount = filteredRequests.filter(r => {
        const isEmergency = r.isEmergency === true || r.isEmergency === 'true' || r.is_emergency === true || r.is_emergency === 'true';
        return isEmergency;
      }).length;
      
      const bloodReceived = filteredDonations.filter(d => {
        const isCompleted = d.donation_status === 'completed' || d.donationStatus === 'completed';
        return isCompleted;
      }).reduce((total, d) => {
        const quantity = d.quantity_ml || d.quantityMl || 0;
        return total + (parseInt(quantity) || 0);
      }, 0);
      
      const bloodSent = filteredRequests.filter(r => {
        const isCompleted = r.processingStatus === 'completed' || r.processingStatus === 'Hoàn thành' || r.processing_status === 'completed';
        return isCompleted;
      }).reduce((total, r) => {
        const quantity = r.quantityRequested || r.quantity_requested || 0;
        return total + (parseInt(quantity) || 0);
      }, 0);
      
      setReportData({
        donationCount,
        requestCount,
        emergencyCount,
        bloodReceived,
        bloodSent
      });
    } catch (error) {
      console.error('Error calculating report data:', error);
    }
  }, [reportType, selectedMonth, selectedYear]);
  
  // Gọi hàm tính toán khi thay đổi thời gian
  React.useEffect(() => {
    calculateReportData();
  }, [calculateReportData]);

  // Hàm xuất Excel
  const exportToExcel = () => {
    try {
      const timeLabel = reportType === 'month' 
        ? `tháng ${selectedMonth}/${selectedYear}` 
        : `năm ${selectedYear}`;
      
      const title = `Báo cáo hiến và nhận máu (${timeLabel})`;
      
      // Tạo dữ liệu cho Excel
      const excelData = [
        [title],
        [''],
        ['Chỉ số', 'Số lượng', 'Đơn vị'],
        ['Số lượng người hiến máu', reportData.donationCount, 'người'],
        ['Số lượng đơn yêu cầu máu', reportData.requestCount, 'đơn'],
        ['Số lượng đơn yêu cầu máu khẩn cấp', reportData.emergencyCount, 'đơn'],
        ['Lượng máu đã nhận', reportData.bloodReceived, 'ml'],
        ['Lượng máu đã gửi', reportData.bloodSent, 'ml']
      ];
      
      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(excelData);
      
      // Định dạng tiêu đề
      ws['A1'] = { v: title, t: 's' };
      ws['A1'].s = { font: { bold: true, size: 16 }, alignment: { horizontal: 'center' } };
      
      // Merge cells cho tiêu đề (3 cột)
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];
      
      // Định dạng header bảng
      ws['A3'].s = { font: { bold: true } };
      ws['B3'].s = { font: { bold: true } };
      ws['C3'].s = { font: { bold: true } };
      
      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Báo cáo');
      
      // Xuất file
      const fileName = `bao_cao_hien_nhan_mau_${reportType === 'month' ? `${selectedMonth}_${selectedYear}` : selectedYear}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      message.success('Xuất Excel thành công!');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      message.error('Lỗi khi xuất Excel. Vui lòng thử lại.');
    }
  };

  // Dữ liệu cho biểu đồ tròn
  const pieData = [
    { name: 'Khẩn cấp', value: emergencyCount },
    { name: 'Bình thường', value: Math.max(requestCount - emergencyCount, 0) }
  ];

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="donor-page-root">
          <h2 className="donor-title">Thống kê tháng {currentMonth}/{currentYear}</h2>
          <div className="row" style={{marginBottom:32}}>
            <div className="col-md-4">
              <div className="stat-card" style={{background:'#e0f7fa'}}>
                <div style={{fontSize:18, color:'#1976d2'}}>Người hiến máu trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#1976d2'}}>{donationCount}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background:'#fff7e0'}}>
                <div style={{fontSize:18, color:'#fb923c'}}>Đơn yêu cầu máu trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#fb923c'}}>{requestCount}</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-card" style={{background:'#ffe0e0'}}>
                <div style={{fontSize:18, color:'#dc2626'}}>Đơn yêu cầu máu khẩn cấp trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#dc2626'}}>{emergencyCount}</div>
              </div>
            </div>
          </div>
          
          {/* Hàng thứ 2 - Thống kê lượng máu */}
          <div className="row" style={{marginBottom:32}}>
            <div className="col-md-6">
              <div className="stat-card" style={{background:'#f0f9ff'}}>
                <div style={{fontSize:18, color:'#0369a1'}}>Lượng máu đã nhận trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#0369a1'}}>{bloodReceived} ml</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="stat-card" style={{background:'#fef3c7'}}>
                <div style={{fontSize:18, color:'#d97706'}}>Lượng máu đã gửi trong tháng</div>
                <div style={{fontSize:36, fontWeight:700, color:'#d97706'}}>{bloodSent} ml</div>
              </div>
            </div>
          </div>
          
          {/* Biểu đồ cột và tròn nằm ngang */}
          <div style={{display:'flex', gap:32, justifyContent:'center', alignItems:'flex-start', flexWrap:'wrap', marginBottom:32}}>
            <div className="card p-4" style={{flex:'1 1 480px', minWidth:320, maxWidth:600}}>
              <h5 style={{marginBottom:24}}>Số lượng người hiến máu và đơn yêu cầu máu theo tháng ({currentYear})</h5>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={monthlyData} barGap={0} barCategoryGap={4}>
                  <XAxis dataKey="month" axisLine={{ stroke: '#e5e7eb' }} tickLine={false} style={{ fontSize: 14, fill: '#222' }} />
                  <YAxis allowDecimals={false} axisLine={{ stroke: '#e5e7eb' }} tickLine={false} style={{ fontSize: 14, fill: '#222' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Người hiến" fill="#60a5fa" radius={[6, 6, 0, 0]} maxBarSize={100} />
                  <Bar dataKey="Đơn yêu cầu" fill="#fbbf24" radius={[6, 6, 0, 0]} maxBarSize={100} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card p-4" style={{flex:'1 1 480px', minWidth:320, maxWidth:600}}>
              <h5 style={{marginBottom:24}}>Tỉ lệ đơn yêu cầu máu khẩn cấp trong tháng</h5>
              <ResponsiveContainer width="100%" height={345}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#f87171' : '#60a5fa'} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Bảng báo cáo */}
          <Card title="Báo cáo chi tiết" style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Loại báo cáo:</label>
                <Select
                  value={reportType}
                  onChange={setReportType}
                  style={{ width: 120 }}
                  options={[
                    { value: 'month', label: 'Theo tháng' },
                    { value: 'year', label: 'Theo năm' }
                  ]}
                />
              </div>
              
              {reportType === 'month' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Tháng:</label>
                  <Select
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    style={{ width: 100 }}
                    options={Array.from({ length: 12 }, (_, i) => ({
                      value: i + 1,
                      label: `Tháng ${i + 1}`
                    }))}
                  />
                </div>
              )}
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Năm:</label>
                <Select
                  value={selectedYear}
                  onChange={setSelectedYear}
                  style={{ width: 100 }}
                  options={Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i;
                    return { value: year, label: year.toString() };
                  })}
                />
              </div>
              
              <Button 
                type="primary" 
                icon={<DownloadOutlined />}
                onClick={exportToExcel}
                style={{ marginTop: 24 }}
              >
                Xuất Excel
              </Button>
            </div>
            
            <Table
              dataSource={[
                {
                  key: '1',
                  indicator: 'Số lượng người hiến máu',
                  value: reportData.donationCount,
                  unit: 'người'
                },
                {
                  key: '2',
                  indicator: 'Số lượng đơn yêu cầu máu',
                  value: reportData.requestCount,
                  unit: 'đơn'
                },
                {
                  key: '3',
                  indicator: 'Số lượng đơn yêu cầu máu khẩn cấp',
                  value: reportData.emergencyCount,
                  unit: 'đơn'
                },
                {
                  key: '4',
                  indicator: 'Lượng máu đã nhận',
                  value: reportData.bloodReceived,
                  unit: 'ml'
                },
                {
                  key: '5',
                  indicator: 'Lượng máu đã gửi',
                  value: reportData.bloodSent,
                  unit: 'ml'
                }
              ]}
              columns={[
                {
                  title: 'Chỉ số',
                  dataIndex: 'indicator',
                  key: 'indicator',
                  width: '60%'
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'value',
                  key: 'value',
                  width: '20%',
                  render: (value) => <span style={{ fontWeight: 600, color: '#1890ff' }}>{value}</span>
                },
                {
                  title: 'Đơn vị',
                  dataIndex: 'unit',
                  key: 'unit',
                  width: '20%'
                }
              ]}
              pagination={false}
              size="middle"
            />
          </Card>
        </main>
      </div>
    </div>
  );
} 