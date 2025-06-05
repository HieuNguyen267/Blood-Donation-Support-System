import React, { useState, useEffect } from 'react';
import './App.css';
import { apiService } from './services/api';

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Đang kiểm tra...');
  const [backendData, setBackendData] = useState(null);
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    // Test kết nối với backend khi component mount
    testBackendConnection();
    checkBackendHealth();
  }, []);

  const testBackendConnection = async () => {
    try {
      const data = await apiService.testConnection();
      setBackendData(data);
      setConnectionStatus('Kết nối thành công!');
    } catch (error) {
      setConnectionStatus('Không thể kết nối với backend. Vui lòng kiểm tra server.');
      console.error('Connection error:', error);
    }
  };

  const checkBackendHealth = async () => {
    try {
      const data = await apiService.checkHealth();
      setHealthData(data);
    } catch (error) {
      console.error('Health check error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Blood Donation Support System</h1>
        
        {/* Status kết nối */}
        <div style={{ margin: '20px 0' }}>
          <h2>Trạng thái kết nối Backend:</h2>
          <p style={{ 
            color: connectionStatus.includes('thành công') ? '#4CAF50' : '#f44336' 
          }}>
            {connectionStatus}
          </p>
        </div>

        {/* Hiển thị dữ liệu từ backend */}
        {backendData && (
          <div style={{ margin: '20px 0', textAlign: 'left' }}>
            <h3>Dữ liệu từ Backend:</h3>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px',
              color: '#333'
            }}>
              {JSON.stringify(backendData, null, 2)}
            </pre>
          </div>
        )}

        {/* Hiển thị health check */}
        {healthData && (
          <div style={{ margin: '20px 0', textAlign: 'left' }}>
            <h3>Backend Health Status:</h3>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '5px',
              color: '#333'
            }}>
              {JSON.stringify(healthData, null, 2)}
            </pre>
          </div>
        )}

        {/* Buttons để test lại */}
        <div style={{ margin: '20px 0' }}>
          <button 
            onClick={testBackendConnection}
            style={{ 
              margin: '0 10px', 
              padding: '10px 20px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Test Kết Nối
          </button>
          <button 
            onClick={checkBackendHealth}
            style={{ 
              margin: '0 10px', 
              padding: '10px 20px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Check Health
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;
