import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./News.css";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { newsAPI } from "../../../services/api";
import { Spin, message } from "antd";


// Fallback data khi không có dữ liệu từ API
const fallbackNewsData = [
  { 
    title: "Hiến máu cứu người - Nghĩa cử cao đẹp", 
    brief: "Phong trào hiến máu cứu người lan tỏa mạnh mẽ...", 
    content: "Nội dung bài viết 1...", 
    authorName: "Lữ Phước Nhật Tú", 
    updatedAt: "2024-07-01", 
    status: "public",
    imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  }
];

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailIdx, setDetailIdx] = useState(null);

  // Load dữ liệu từ API
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        const newsData = await newsAPI.getPublicNews();
        setNews(newsData || fallbackNewsData);
      } catch (error) {
        console.error('Error loading news:', error);
        message.error('Không thể tải tin tức. Vui lòng thử lại sau.');
        setNews(fallbackNewsData);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  // Chỉ hiển thị tin có status "public"
  const filtered = news.filter(n => n.status === "public");

  return (
    <>
      <Header />
      <div className="news-container container py-4">
        <h2 className="news-title mb-4 text-center">Tin tức hiến máu</h2>
        
        {loading ? (
          <div className="text-center py-5">
            <Spin size="large" />
            <div className="mt-3">Đang tải tin tức...</div>
          </div>
        ) : (
        <div className="row g-4">
          {filtered.length === 0 && (
            <div className="col-12 text-center text-secondary">Không có tin tức phù hợp</div>
          )}
          {filtered.map((n, i) => (
              <div className="col-md-6" key={n.newsId || i}>
              <div className="card h-100 news-card">
                  {n.imageUrl && (
                    <img src={n.imageUrl} alt={n.title} className="news-card-img-top" />
                )}
                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title news-card-title"
                    onClick={() => setDetailIdx(i)}
                    title="Xem chi tiết"
                  >
                    {n.title}
                  </h5>
                    <div className="card-text mb-3 text-truncate news-card-summary">{n.brief}</div>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                      <span className="badge bg-danger bg-gradient">{n.authorName}</span>
                                          <span className="text-muted news-card-date">
                      {new Date(n.updatedAt).toLocaleDateString('vi-VN')}
                    </span>
                    <button className="btn news-card-btn-detail btn-sm" onClick={() => setDetailIdx(i)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
        {/* Modal xem chi tiết tin tức */}
        {detailIdx !== null && filtered[detailIdx] && (
          <div className="modal fade show" style={{display:'block',background:'rgba(0,0,0,0.3)'}} tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header news-modal-header">
                  <h5 className="modal-title">{filtered[detailIdx].title}</h5>
                  <button type="button" className="btn-close" onClick={()=>setDetailIdx(null)}></button>
                </div>
                <div className="modal-body">
                  {filtered[detailIdx].imageUrl && (
                    <img src={filtered[detailIdx].imageUrl} alt={filtered[detailIdx].title} className="news-modal-img mb-3" />
                  )}
                  <div className="news-modal-summary-label">Tóm tắt:</div>
                  <div className="news-modal-summary">{filtered[detailIdx].brief}</div>
                  <div className="news-modal-content-label">Nội dung:</div>
                  <div className="news-modal-content">{filtered[detailIdx].content}</div>
                  <div className="news-modal-footer-info">
                    Tác giả: {filtered[detailIdx].authorName} | Ngày đăng: {new Date(filtered[detailIdx].updatedAt).toLocaleDateString('vi-VN')}
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={()=>setDetailIdx(null)}>Đóng</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
} 