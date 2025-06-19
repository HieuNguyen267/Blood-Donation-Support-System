import React from "react";
import "./index.css";
import { Container, Grid } from "@mui/material";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <Container className="footer-container">
        <Grid container spacing={8}>
          <Grid item xs={12} md={6}>
            <h4>Liên hệ</h4>
            <div className="footer-info">
              <div><MapPin size={18} /> <span>123 Đường ABC, Quận XYZ, TP.HCM</span></div>
              <div><Phone size={18} /> <span>Hotline: 1900-xxxx</span></div>
              <div><Mail size={18} /> <span>info@hienmauvietnam.vn</span></div>
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <h4>Thông tin</h4>
            <div className="footer-links">
              <a href="/about">Giới thiệu</a>
              <a href="/news">Tin tức</a>
              <a href="/activities">Hoạt động</a>
            </div>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
}
