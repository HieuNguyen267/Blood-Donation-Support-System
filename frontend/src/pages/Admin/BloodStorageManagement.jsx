import React, { useState } from "react";
import Header from "../../components/admin/Header";
import Sidebar from "../../components/admin/Sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './BloodStorageManagement.css';
import { validateBloodStorage, getStatusStyle } from './utils';
import { bloodStockAPI } from '../../services/api';

const bloodDataInit = [
  { code: "BP001", group: "Rh NULL", collect: "11/4/2024, 10:30", expire: "11/4/2027, 09:30", amount: 12, status: "Mới", quality: "Tốt", temp: "2 -6 °C" },
  { code: "BP002", group: "O-", collect: "15/4/2024, 09:30", expire: "15/4/2028, 08:30", amount: 15, status: "Đang sử dụng", quality: "Tốt", temp: "6-10 °C" },
  { code: "BP003", group: "O+", collect: "4/11/2025, 16:35", expire: "4/11/2028, 15:35", amount: 20, status: "Mới", quality: "Tốt", temp: "20-24 °C" },
  { code: "BP004", group: "AB+", collect: "27/5/2025, 11:30", expire: "27/5/2028, 10:30", amount: 25, status: "Hết hạn", quality: "Đã tiêu huỷ", temp: "4 °C" },
  { code: "BP005", group: "AB-", collect: "27/5/2025, 11:45", expire: "27/5/2028, 10:45", amount: 35, status: "Mới", quality: "Tốt", temp: "4 °C" },
  { code: "BP006", group: "A+", collect: "15/4/2024, 09:30", expire: "15/4/2027, 08:30", amount: 30, status: "Đang sử dụng", quality: "Tốt", temp: "2 -6 °C" },
  { code: "BP007", group: "B-", collect: "15/4/2024, 09:30", expire: "15/4/2028, 08:30", amount: 16, status: "Mới", quality: "Tốt", temp: "6 °C" },
  { code: "BP008", group: "A-", collect: "27/5/2025, 11:45", expire: "27/5/2028, 10:45", amount: 18, status: "Hết hạn", quality: "Đã đông", temp: "2 -6 °C" },
  { code: "BP009", group: "B+", collect: "27/5/2025, 11:45", expire: "27/5/2028, 10:45", amount: 10, status: "Mới", quality: "Tốt", temp: "10 °C" },
];

const qualityColors = {
  "Tốt": "success",
  "Đã tiêu huỷ": "danger",
  "Đã đông": "warning"
};

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Rh NULL", "Bombay"];
const statuses = ["Mới", "Đang sử dụng", "Hết hạn"];
const qualities = ["Tốt", "Đã tiêu huỷ", "Đã đông"];

const PAGE_SIZE = 8;

export default function BloodStorageManagement() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteIdx, setDeleteIdx] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [bloodType, setBloodType] = useState("Tất cả");
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchBloodStock = async () => {
      try {
        setLoading(true);
        const stock = await bloodStockAPI.getStock();
        
        // Group by blood group and sum volumes
        const groupedStock = stock.reduce((acc, item) => {
          const bloodGroupKey = item.bloodGroupName || `${item.aboType}${item.rhFactor === 'positive' ? '+' : item.rhFactor === 'negative' ? '-' : item.rhFactor}`;
          
          if (!acc[bloodGroupKey]) {
            acc[bloodGroupKey] = {
              id: item.stockId,
              group: bloodGroupKey,
              volume: 0,
              temp: item.temperatureRange || getTemperatureRange(item.aboType, item.rhFactor)
            };
          }
          
          acc[bloodGroupKey].volume += item.volume || 0;
          return acc;
        }, {});
        
        // Convert to array format
        const formattedData = Object.values(groupedStock).map((item, index) => ({
          id: index + 1,
          group: item.group,
          volume: item.volume,
          temp: item.temp
        }));
        
        setData(formattedData);
      } catch (error) {
        console.error('Error fetching blood stock:', error);
        // Fallback to sample data if API fails
        setData(bloodDataInit.map(item => ({
          id: item.code,
          group: item.group,
          volume: item.amount,
          temp: item.temp
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchBloodStock();
  }, []);

  // Helper function to get temperature range based on blood group
  const getTemperatureRange = (aboType, rhFactor) => {
    const bloodGroup = aboType + (rhFactor === 'positive' ? '+' : rhFactor === 'negative' ? '-' : rhFactor);
    
    switch (bloodGroup) {
      case "A+":
      case "A-":
        return "2-6 °C";
      case "B+":
      case "B-":
        return "6-10 °C";
      case "AB+":
      case "AB-":
        return "4 °C";
      case "O+":
      case "O-":
        return "20-24 °C";
      case "Rh_Null":
        return "2-6 °C";
      case "Bombay":
        return "4 °C";
      default:
        return "2-6 °C";
    }
  };

  // Filter logic (chỉ search theo nhóm máu)
  const filtered = data.filter(d => {
    const matchSearch = d.group.toLowerCase().includes(search.toLowerCase());
    const matchBlood = bloodType === "Tất cả" || d.group === bloodType;
    return matchSearch && matchBlood;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  React.useEffect(() => { setPage(1); }, [search]);

  // Edit logic
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({...filtered[idx]});
    setValidationErrors({});
  };
  const handleSaveEdit = () => {
    const errors = validateBloodStorage(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    const globalIdx = data.findIndex(d => d === filtered[editIdx]);
    const newData = [...data];
    newData[globalIdx] = editData;
    setData(newData);
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelEdit = () => {
    setEditIdx(null);
    setEditData(null);
    setValidationErrors({});
  };
  
  // Delete logic
  const handleDelete = (idx) => { setDeleteIdx(idx); };
  const handleConfirmDelete = () => {
    const globalIdx = data.findIndex(d => d === filtered[deleteIdx]);
    setData(data.filter((_, i) => i !== globalIdx));
    setDeleteIdx(null);
  };
  const handleCancelDelete = () => { setDeleteIdx(null); };

  // Add logic
  const handleAdd = () => {
    setAddMode(true);
    setEditIdx(null);
    setEditData({
      code: '', group: 'A+', collect: '', expire: '', amount: '', status: 'Mới', quality: 'Tốt', temp: ''
    });
    setValidationErrors({});
  };
  const handleSaveAdd = () => {
    const errors = validateBloodStorage(editData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setData([editData, ...data]);
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };
  const handleCancelAdd = () => {
    setAddMode(false);
    setEditData(null);
    setValidationErrors({});
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <Header />
        <div className="dashboard-main">
          <Sidebar />
          <main className="blood-page-root">
            <div className="blood-header">
              <h2 className="blood-title">Quản lý kho máu</h2>
              <div className="blood-subtitle">Chi tiết kho máu</div>
            </div>
            <div className="text-center p-4">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      <Header />
      <div className="dashboard-main">
        <Sidebar />
        <main className="blood-page-root">
          <div className="blood-header">
            <h2 className="blood-title">Quản lý kho máu</h2>
            <div className="blood-subtitle">Chi tiết kho máu</div>
          </div>
          <div className="blood-toolbar">
            <input className="blood-search" placeholder="🔍 Tìm kiếm nhóm máu ....." value={search} onChange={e=>setSearch(e.target.value)} />
            <select className="blood-filter" value={bloodType} onChange={e=>setBloodType(e.target.value)}>
              <option value="Tất cả">Tất cả</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="Rh NULL">Rh NULL</option>
              <option value="Bombay">Bombay</option>
            </select>
            <button className="blood-filter-btn">⏷</button>
            <button className="blood-export">⭳ Xuất tệp</button>
          </div>
          <div className="donor-table-card">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center" style={{minWidth: 60}}>Mã</th>
                  <th className="text-center">Nhóm máu</th>
                  <th className="text-center">Số lượng trong kho</th>
                  <th className="text-center">Phạm vi nhiệt độ</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((d, i) => (
                  <tr key={i}>
                    <td className="text-center">{d.id || (i+1+(page-1)*PAGE_SIZE)}</td>
                    <td className="text-center">{d.group}</td>
                    <td className="text-center">{d.volume + ' ml'}</td>
                    <td className="text-center">{d.temp}</td>
                  </tr>
                ))}
                {paged.length === 0 && (
                  <tr><td colSpan={4} className="text-center text-secondary">Không có dữ liệu phù hợp</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-3">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>Trước</button>
                </li>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(p => (
                  <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>Sau</button>
                </li>
              </ul>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
} 