import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./News.css";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";


const newsDataInit = [
  { 
    title: "Hiến máu cứu người - Nghĩa cử cao đẹp", 
    summary: "Phong trào hiến máu cứu người lan tỏa mạnh mẽ...", 
    content: "Nội dung bài viết 1...", 
    author: "Lữ Phước Nhật Tú", 
    date: "2024-07-01", 
    status: "Công khai",
    image: "/images/z6758844071397_c4dce00bce3e5234e29795f4668b3eec.jpg"
  },
  { 
    title: "Ngày hội hiến máu toàn quốc", 
    summary: "Sự kiện lớn thu hút hàng ngàn người tham gia...", 
    content: "Nội dung bài viết 2...", 
    author: "Nguyễn Gia Triệu", 
    date: "2024-06-20", 
    status: "Công khai",
    image: "/images/z6758856043908_bb04d851bb979fe5ea93fb2e1d32eb8a.jpg"
  },
  { 
    title: "Thông báo lịch hiến máu tháng 8", 
    summary: "Lịch hiến máu tháng 8 đã được cập nhật...", 
    content: "Nội dung bài viết 3...", 
    author: "Lữ Phước Nhật Tú", 
    date: "2024-06-15", 
    status: "Công khai",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
  },
  { 
    title: "Câu chuyện người hiến máu cứu sống bệnh nhân", 
    summary: "Một người hiến máu đã giúp cứu sống một bệnh nhân nguy kịch...", 
    content: "Nội dung bài viết 4...", 
    author: "Nguyễn Gia Triệu", 
    date: "2024-06-10", 
    status: "Công khai",
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"
  },
  { 
    title: "Lợi ích sức khỏe khi tham gia hiến máu", 
    summary: "Hiến máu không chỉ cứu người mà còn mang lại nhiều lợi ích sức khỏe...", 
    content: "Nội dung bài viết 5...", 
    author: "Lữ Phước Nhật Tú", 
    date: "2024-06-05", 
    status: "Công khai",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=600&q=80"
  },
  { 
    title: "Sự kiện hiến máu tại trường đại học X", 
    summary: "Sinh viên trường X tích cực tham gia ngày hội hiến máu...", 
    content: "Nội dung bài viết 6...", 
    author: "Nguyễn Gia Triệu", 
    date: "2024-05-28", 
    status: "Công khai",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"
  },
  { 
    title: "Tuyên dương người hiến máu tiêu biểu năm 2024", 
    summary: "Nhiều cá nhân được vinh danh vì đóng góp tích cực cho phong trào hiến máu...", 
    content: "Nội dung bài viết 7...", 
    author: "Lữ Phước Nhật Tú", 
    date: "2024-05-20", 
    status: "Công khai",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
  },
  { 
    title: "Hướng dẫn đăng ký hiến máu trực tuyến", 
    summary: "Các bước đơn giản để đăng ký hiến máu qua hệ thống online...", 
    content: "Nội dung bài viết 8...", 
    author: "Nguyễn Gia Triệu", 
    date: "2024-05-10", 
    status: "Công khai",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
  },
];

export default function News() {
  const [news] = useState(newsDataInit);
  const [detailIdx, setDetailIdx] = useState(null);

  // Chỉ hiển thị tin "Công khai"
  const filtered = news.filter(n => n.status === "Công khai");

  return (
    <>
      <Header />
      <div className="news-container container py-4">
        <h2 className="news-title mb-4 text-center">Tin tức hiến máu</h2>
        <div className="row g-4">
          {filtered.length === 0 && (
            <div className="col-12 text-center text-secondary">Không có tin tức phù hợp</div>
          )}
          {filtered.map((n, i) => (
            <div className="col-md-6" key={i}>
              <div className="card h-100 news-card">
                {n.image && (
                  <img src={n.image} alt={n.title} className="news-card-img-top" />
                )}
                <div className="card-body d-flex flex-column">
                  <h5
                    className="card-title news-card-title"
                    onClick={() => setDetailIdx(i)}
                    title="Xem chi tiết"
                  >
                    {n.title}
                  </h5>
                  <div className="card-text mb-3 text-truncate news-card-summary">{n.summary}</div>
                  <div className="mt-auto d-flex justify-content-between align-items-center">
                    <span className="badge bg-danger bg-gradient">{n.author}</span>
                    <span className="text-muted news-card-date">{n.date}</span>
                    <button className="btn news-card-btn-detail btn-sm" onClick={() => setDetailIdx(i)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                  {filtered[detailIdx].image && (
                    <img src={filtered[detailIdx].image} alt={filtered[detailIdx].title} className="news-modal-img mb-3" />
                  )}
                  <div className="news-modal-summary-label">Tóm tắt:</div>
                  <div className="news-modal-summary">{filtered[detailIdx].summary}</div>
                  <div className="news-modal-content-label">Nội dung:</div>
                  <div className="news-modal-content">{filtered[detailIdx].content}</div>
                  <div className="news-modal-footer-info">Tác giả: {filtered[detailIdx].author} | Ngày đăng: {filtered[detailIdx].date}</div>
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