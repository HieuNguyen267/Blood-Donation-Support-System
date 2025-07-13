import React, { useState } from "react";
import { Form, Button, Typography, Card, Checkbox, message } from "antd";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/user/Header";
import Footer from "../../../components/user/Footer";
import { donorAPI, donationRegisterAPI } from "../../../services/api";
import "./index.css";

const { Title } = Typography;

const questions = [
  {
    label: "Bạn có đang bị cảm, sốt hoặc ho không?",
    name: "hasFluFeverCough",
    options: [
      { label: "Không có triệu chứng", value: "khong_co_trieu_chung", safe: true },
      { label: "Sốt nhẹ", value: "sot_nhe", safe: false },
      { label: "Ho khan", value: "ho_khan", safe: false },
      { label: "Sốt cao, ho nhiều", value: "sot_cao_ho_nhieu", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị đau họng hoặc viêm họng không?",
    name: "hasSoreThroat",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Đau nhẹ", value: "dau_nhe", safe: false },
      { label: "Viêm họng nặng", value: "viem_hong_nang", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị tiêu chảy hoặc rối loạn tiêu hóa không?",
    name: "hasDiarrheaDigestiveIssues",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Tiêu chảy nhẹ", value: "tieu_chay_nhe", safe: false },
      { label: "Rối loạn tiêu hóa kéo dài", value: "roi_loan_tieu_hoa_keo_dai", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị đau đầu, chóng mặt hoặc mệt mỏi bất thường không?",
    name: "hasHeadacheDizzinessFatigue",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Đau đầu nhẹ", value: "dau_dau_nhe", safe: false },
      { label: "Chóng mặt, mệt mỏi nhiều", value: "chong_mat_met_moi_nhieu", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị dị ứng nghiêm trọng hoặc phát ban không?",
    name: "hasAllergicReactions",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Dị ứng nhẹ", value: "di_ung_nhe", safe: true },
      { label: "Dị ứng nặng/phát ban", value: "di_ung_nang_phat_ban", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị nhiễm trùng hoặc vết thương hở không?",
    name: "hasInfectionOpenWounds",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Vết thương nhỏ đã lành", value: "vet_thuong_nho_da_lanh", safe: true },
      { label: "Nhiễm trùng/vết thương hở", value: "nhiem_trung_vet_thuong_ho", safe: false },
    ],
  },
  {
    label: "Bạn có đang sử dụng thuốc kháng sinh hoặc thuốc điều trị bệnh không?",
    name: "usesAntibioticsMedication",
    options: [
      { label: "Không sử dụng thuốc", value: "khong_su_dung_thuoc", safe: true },
      { label: "Thuốc cảm cúm thông thường", value: "thuoc_cam_cum_thong_thuong", safe: true },
      { label: "Kháng sinh/điều trị bệnh mãn tính", value: "khang_sinh_dieu_tri_benh_man_tinh", safe: false },
    ],
  },
  {
    label: "Bạn có tiền sử mắc các bệnh truyền nhiễm như viêm gan B, C, HIV không?",
    name: "hasInfectiousDiseaseHistory",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Đã điều trị ổn định", value: "da_dieu_tri_on_dinh", safe: false },
      { label: "Đang điều trị", value: "dang_dieu_tri", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị cao huyết áp hoặc bệnh tim mạch không?",
    name: "hasHypertensionHeartDisease",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Huyết áp cao đã kiểm soát", value: "huyet_ap_cao_kiem_soat_tot", safe: true },
      { label: "Huyết áp cao chưa kiểm soát/bệnh tim", value: "huyet_ap_cao_chua_kiem_soat_benh_tim_mach", safe: false },
    ],
  },
  {
    label: "Bạn có đang bị bệnh tiểu đường hoặc các bệnh mãn tính khác không?",
    name: "hasDiabetesChronicDiseases",
    options: [
      { label: "Không có", value: "khong_co", safe: true },
      { label: "Tiểu đường kiểm soát tốt", value: "tieu_duong_kiem_soat_tot", safe: true },
      { label: "Tiểu đường không kiểm soát/bệnh mãn tính khác", value: "tieu_duong_khong_kiem_soat_benh_man_tinh_khac", safe: false },
    ],
  },
];

export default function BloodDonationEligibility() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Lấy thông tin donor từ profile API
      const profile = await donorAPI.getProfile();
      const donorId = profile.donorId || profile.donor_id;
      
      if (!donorId) {
        message.error('Không tìm thấy thông tin donor. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      // Kiểm tra điều kiện đủ điều kiện hiến máu
      const isEligible = questions.every(q => {
        const answer = values[q.name];
        const selectedOption = q.options.find(opt => opt.value === answer[0]);
        return selectedOption && selectedOption.safe;
      });

      // Chuẩn bị dữ liệu để gửi lên server
      const surveyData = {
        donorId: donorId,
        ...values,
        // Chuyển đổi từ array sang string vì backend expect string
        hasFluFeverCough: values.hasFluFeverCough[0],
        hasSoreThroat: values.hasSoreThroat[0],
        hasDiarrheaDigestiveIssues: values.hasDiarrheaDigestiveIssues[0],
        hasHeadacheDizzinessFatigue: values.hasHeadacheDizzinessFatigue[0],
        hasAllergicReactions: values.hasAllergicReactions[0],
        hasInfectionOpenWounds: values.hasInfectionOpenWounds[0],
        usesAntibioticsMedication: values.usesAntibioticsMedication[0],
        hasInfectiousDiseaseHistory: values.hasInfectiousDiseaseHistory[0],
        hasHypertensionHeartDisease: values.hasHypertensionHeartDisease[0],
        hasDiabetesChronicDiseases: values.hasDiabetesChronicDiseases[0],
        overallEligibility: isEligible ? 'du_dieu_kien' : 'khong_du_dieu_kien',
        deferralReason: isEligible ? null : 'Không đủ điều kiện sức khỏe để hiến máu'
      };

      // Gửi dữ liệu khảo sát lên server
      const surveyRes = await donorAPI.createSurvey(surveyData);
      // Lưu kết quả vào localStorage để hiển thị ở trang đăng ký
      localStorage.setItem('healthCheckAnswers', JSON.stringify(values));
      localStorage.setItem('isEligible', isEligible);

      if (!isEligible) {
        message.error('Rất tiếc, bạn không đủ điều kiện hiến máu vào lúc này.');
        navigate('/');
        return;
      }

      // Nếu đủ điều kiện, tiếp tục tạo đơn đăng ký hiến máu
      // Lấy dữ liệu từ localStorage
      const donationFormData = JSON.parse(localStorage.getItem('donationFormData'));
      if (!donationFormData) {
        message.error('Không tìm thấy thông tin đăng ký hiến máu. Vui lòng quay lại bước trước.');
        setLoading(false);
        return;
      }
      // Chuẩn bị dữ liệu cho bảng donation_register
      const registerData = {
        donorId: donorId,
        timeId: donationFormData.timeId,
        appointmentDate: donationFormData.appointment_date,
        preDonationSurvey: {
          surveyId: surveyRes.surveyId || surveyRes.survey_id
        },
        weightKg: donationFormData.weight_kg,
        status: 'pending',
        // Các trường khác nếu cần: quantityMl, staffId, ...
      };
      await donorAPI.registerDonation(registerData);
      // Xóa bộ đệm
      localStorage.removeItem('donationFormData');
      message.success('Đăng ký hiến máu thành công!');
      navigate('/registerdonate');
    } catch (error) {
      console.error('Error saving survey or registration:', error);
      message.error('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Header />
      <div className="step-progress-wrapper" style={{ marginTop: 32, marginBottom: 32 }}>
        <div className="step-progress-wrapper">
          <div className="step-progress">
            {[1,2,3,4].map((num, idx) => {
              const isActive = num < 2+1; // currentStep=2
              const isCurrent = num === 2;
              return (
                <React.Fragment key={num}>
                  <div className={`step-item${isActive ? ' active' : ''}${isCurrent ? ' current active' : ''}`}>
                    <div className="step-circle">{isActive && num !== 2 ? '✓' : num}</div>
                    <p className="step-title">{['Đăng ký','Kiểm tra sàng lọc','Hiến máu','Nghỉ ngơi'][num-1]}</p>
                    <p className="step-desc">{[
                      'Điền thông tin và kiểm tra điều kiện',
                      'Kiểm tra sức khỏe và xét nghiệm',
                      'Quá trình hiến máu (15–20 phút)',
                      'Nghỉ ngơi và chờ giấy chứng nhận',
                    ][num-1]}</p>
                  </div>
                  {idx < 3 && <div className="step-connector"></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className="eligibility-form-wrapper">
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Kiểm tra điều kiện hiến máu (Sức khỏe)
        </Title>
        <Card className="eligibility-card" variant="outlined">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            {questions.map((q, idx) => (
              <div className="question-box" key={q.name}>
                <div className="question-header">{idx + 1}. {q.label}</div>
                <div className="question-content">
                  <Form.Item
                    name={q.name}
                    rules={[{ required: true, message: "Vui lòng chọn đáp án!" }]}
                    style={{ marginBottom: 0 }}
                  >
                    <Checkbox.Group options={q.options.map(opt => ({ label: opt.label, value: opt.value }))} />
                  </Form.Item>
                </div>
              </div>
            ))}
            <Form.Item>
              <div className="btn-group-right">
                <Button
                  className="btn-outline-green"
                  style={{ order: 1, flex: 1 }}
                  onClick={() => navigate(-1)}
                >
                  Quay về
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="check-btn btn-green"
                  size="large"
                  style={{ order: 2, flex: 1 }}
                  loading={loading}
                >
                  Đăng ký
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <Footer />
    </div>
  );
} 