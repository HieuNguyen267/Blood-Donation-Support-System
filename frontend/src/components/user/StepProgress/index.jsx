import React from 'react';
import "./index.css";

export default function StepProgress({ currentStep = 1 }) {
  const steps = [
    { number: 1, title: 'Đăng ký', description: 'Điền thông tin và kiểm tra điều kiện' },
    { number: 2, title: 'Kiểm tra sàng lọc', description: 'Kiểm tra sức khỏe và xét nghiệm' },
    { number: 3, title: 'Hiến máu', description: 'Quá trình hiến máu (15–20 phút)' },
    { number: 4, title: 'Nghỉ ngơi', description: 'Nghỉ ngơi và chờ giấy chứng nhận' },
  ];

  return (
    <div className="step-progress-wrapper">
      <div className="step-progress">
        {steps.map((step, index) => {
          const isActive = step.number <= currentStep;
          const isCurrent = step.number === currentStep;
          return (
            <React.Fragment key={step.number}>
              <div className={`step-item${isActive ? ' active' : ''}${isCurrent ? ' current' : ''}`}>
                <div className="step-circle">{step.number}</div>
                <p className="step-title">{step.title}</p>
                <p className="step-desc">{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className="step-connector"></div>}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
