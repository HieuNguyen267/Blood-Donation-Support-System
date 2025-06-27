import React from "react";
import './ChartPlaceholder.css';

const ChartPlaceholder = () => (
  <div className="chart-placeholder">
    <div style={{fontWeight:600, marginBottom:8}}>Hospital Survey</div>
    <div style={{height:180, background:'#e3eafc', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#888'}}>[Biểu đồ Placeholder]</div>
  </div>
);

export default ChartPlaceholder; 