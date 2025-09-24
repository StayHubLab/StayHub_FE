import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Dropdown } from 'antd';
import { LeftOutlined, RightOutlined, InfoCircleOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import './ScheduleBookingModal.css';

// Set dayjs to Vietnamese locale
dayjs.locale('vi');

const ScheduleBookingModal = ({ visible, onClose, onConfirm, roomData, userData }) => {
  const today = dayjs(); // Current date for comparison
  const [selectedDate, setSelectedDate] = useState(today.date()); // Default to today's date
  const [selectedTime, setSelectedTime] = useState('2:00 PM'); // Default selected time from design
  const [currentMonth, setCurrentMonth] = useState(dayjs()); // Make it stateful for month switching
  const [currentStep, setCurrentStep] = useState(1); // Step 1: Date/Time, Step 2: Confirm Info, Step 3: Complete

  // Sample room data (can be passed as props)
  const defaultRoomData = {
    name: "Phòng Trọ Hiện Đại Tầng 3 - K20/28 Nguyễn Hữu Thọ",
    price: 4500000,
    address: "K20/28 Nguyễn Hữu Thọ, Phường Hòa Cường Nam, Quận Hải Châu, Đà Nẵng"
  };

  // Sample user data (can be passed as props)
  const defaultUserData = {
    name: "Nguyễn Văn An",
    phone: "0123 456 789",
    email: "nguyen.van.an@email.com"
  };

  // Sample landlord data
  const landlordData = {
    name: "Chị Lan Anh",
    phone: "0987 654 321",
    email: "lananh@email.com",
    since: "Chủ trọ từ 2020"
  };

  const currentRoomData = roomData || defaultRoomData;
  const currentUserData = userData || defaultUserData;

  // Days of week in Vietnamese
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  // Handle confirm booking
  const handleConfirm = () => {
    onConfirm({
      date: selectedDate,
      time: selectedTime,
      month: currentMonth.format('MM/YYYY'),
      roomData: currentRoomData,
      userData: currentUserData
    });
    onClose();
  };

  // Vietnamese month names
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Get current month display
  const getCurrentMonthDisplay = () => {
    return `${monthNames[currentMonth.month()]} ${currentMonth.year()}`;
  };

  // Generate months dropdown items (only current year, from current month onwards)
  const generateMonthItems = () => {
    const currentYear = today.year();
    const currentMonthIndex = today.month();
    const items = [];
    
    for (let i = currentMonthIndex; i < 12; i++) {
      const monthDate = dayjs().year(currentYear).month(i);
      items.push({
        key: i.toString(),
        label: `${monthNames[i]} ${currentYear}`,
        onClick: () => handleMonthSelect(monthDate)
      });
    }
    
    return items;
  };

  // Handle month selection
  const handleMonthSelect = (selectedMonth) => {
    setCurrentMonth(selectedMonth);
    // Reset selected date when month changes
    // If switching to current month, default to today, otherwise first day of month
    if (selectedMonth.isSame(today, 'month')) {
      setSelectedDate(today.date());
    } else {
      setSelectedDate(1);
    }
  };

  // Render step 1: Date and Time Selection (existing content)
  const renderStep1 = () => (
    <div className="schedule-content">
      {/* Date Selection */}
      <div className="date-selection-container">
        <div className="section-header">
          <div className="section-title">Chọn ngày</div>
          <Dropdown 
            menu={{ items: generateMonthItems() }}
            trigger={['click']}
            placement="bottomRight"
          >
            <div className="current-month-display">
              {getCurrentMonthDisplay()}
              <DownOutlined style={{ marginLeft: 8, fontSize: 12 }} />
            </div>
          </Dropdown>
        </div>
        
        <div className="calendar-container">
          {/* Week Days Header */}
          <div className="week-days">
            {weekDays.map((day, index) => (
              <div key={index} className="week-day">
                <div className="week-day-text">{day}</div>
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const isCurrentViewMonth = day.isSame(currentMonth, 'month');
              const isSelected = isCurrentViewMonth && day.date() === selectedDate;
              const isPrevMonth = day.isBefore(currentMonth, 'month');
              const isPastDate = day.isBefore(today, 'day');
              const isDisabled = !isCurrentViewMonth || isPastDate;
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${
                    isSelected ? 'selected' : ''
                  } ${
                    !isCurrentViewMonth ? 'other-month' : ''
                  } ${
                    isPrevMonth ? 'prev-month' : ''
                  } ${
                    isPastDate ? 'past-date' : ''
                  } ${
                    isDisabled ? 'disabled' : ''
                  }`}
                  onClick={() => !isDisabled && handleDateSelect(day)}
                >
                  <div className="day-number">{day.date()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Selection */}
      <div className="time-selection-container">
        <div className="section-header">
          <div className="section-title">Chọn giờ</div>
        </div>
        
        <div className="time-slots-container">
          <div className="time-slots-grid">
            {timeSlots.map((time, index) => (
              <div
                key={index}
                className={`time-slot ${
                  selectedTime === time ? 'selected' : ''
                }`}
                onClick={() => handleTimeSelect(time)}
              >
                <div className="time-text">{time}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Info Note */}
        <div className="info-note">
          <div className="info-content">
            <div className="info-icon">
              <InfoCircleOutlined />
            </div>
            <div className="info-text">
              <div className="info-title">Lưu ý:</div>
              <div className="info-description">
                Thời gian xem phòng khoảng 30-45 phút. Chủ nhà sẽ xác nhận lịch hẹn trong vòng 2 giờ.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render step 2: Confirmation Information
  const renderStep2 = () => (
    <div className="confirm-content">
      {/* Left Side - Booking Summary */}
      <div className="booking-summary">
        <div className="summary-header">
          <div className="section-title">Thông tin đặt lịch</div>
        </div>
        
        <div className="summary-details">
          <div className="summary-item">
            <div className="summary-label">Ngày xem phòng:</div>
            <div className="summary-value">{selectedDate} {getCurrentMonthDisplay()}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Thời gian:</div>
            <div className="summary-value">{selectedTime}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Tên phòng:</div>
            <div className="summary-value">{currentRoomData.name}</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Giá phòng:</div>
            <div className="summary-value">{formatPrice(currentRoomData.price)} VNĐ/tháng</div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">Địa chỉ:</div>
            <div className="summary-value">{currentRoomData.address}</div>
          </div>
        </div>
      </div>

      {/* Right Side - User & Landlord Info */}
      <div className="contact-info">
        {/* Booker Information */}
        <div className="info-section">
          <div className="info-header">
            <div className="section-title">Thông tin người đặt</div>
          </div>
          
          <div className="info-details">
            <div className="info-item">
              <div className="info-label">Họ tên:</div>
              <div className="info-value">{currentUserData.name}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Số điện thoại:</div>
              <div className="info-value">{currentUserData.phone}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Email:</div>
              <div className="info-value">{currentUserData.email}</div>
            </div>
          </div>
        </div>

        {/* Landlord Information */}
        <div className="info-section">
          <div className="info-header">
            <div className="section-title">Thông tin chủ nhà</div>
          </div>
          
          <div className="info-details">
            <div className="info-item">
              <div className="info-label">Họ tên:</div>
              <div className="info-value">{landlordData.name}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Số điện thoại:</div>
              <div className="info-value">{landlordData.phone}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Email:</div>
              <div className="info-value">{landlordData.email}</div>
            </div>
            
            <div className="info-item">
              <div className="info-label">Kinh nghiệm:</div>
              <div className="info-value">{landlordData.since}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render step 3: Completion
  const renderStep3 = () => (
    <div className="completion-content">
      <div className="completion-message">
        <div className="success-icon">✓</div>
        <div className="success-title">Đặt lịch thành công!</div>
        <div className="success-description">
          Lịch xem phòng của bạn đã được gửi đến chủ nhà. Chủ nhà sẽ xác nhận trong vòng 2 giờ.
        </div>
        
        <div className="booking-details">
          <div className="detail-item-complete">
            <strong>Ngày:</strong> {selectedDate} {getCurrentMonthDisplay()}
          </div>
          <div className="detail-item-complete">
            <strong>Thời gian:</strong> {selectedTime}
          </div>
          <div className="detail-item-complete">
            <strong>Phòng:</strong> {currentRoomData.name}
          </div>
        </div>
      </div>
    </div>
  );

  // Time slots available
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  // Generate calendar days
  const generateCalendarDays = () => {
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    
    const days = [];
    let day = startOfWeek;
    
    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleDateSelect = (date) => {
    // Only allow selection if date is in current month and not in the past
    const isCurrentViewMonth = date.isSame(currentMonth, 'month');
    const isPastDate = date.isBefore(today, 'day');
    
    if (isCurrentViewMonth && !isPastDate) {
      setSelectedDate(date.date());
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  // Handle continue to next step
  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - complete booking
      handleConfirm();
    }
  };

  // Handle back to previous step
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onClose();
    }
  };

  // Format price display
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN');
  };

  // Render progress bar
  const renderProgressBar = () => {
    const steps = [
      { number: 1, label: 'Chọn ngày & giờ' },
      { number: 2, label: 'Xác nhận thông tin' },
      { number: 3, label: 'Hoàn thành' }
    ];

    return (
      <div className="progress-bar-container">
        <div className="progress-bar">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="progress-step">
                <div className={`step-circle ${
                  currentStep >= step.number ? 'active' : 'inactive'
                }`}>
                  <div className="step-number">{step.number}</div>
                </div>
                <div className={`step-label ${
                  currentStep >= step.number ? 'active' : 'inactive'
                }`}>{step.label}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${
                  currentStep > step.number ? 'active' : 'inactive'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={896}
      centered
      className="schedule-booking-modal"
      closable={false}
    >
      <div className="schedule-modal-container">
        {/* Progress Bar */}
        {renderProgressBar()}
        
        {/* Header */}
        <div className="schedule-header">
          <div className="schedule-title">
            {currentStep === 1 && "Chọn ngày và giờ xem phòng"}
            {currentStep === 2 && "Xác nhận thông tin đặt lịch"}
            {currentStep === 3 && "Hoàn thành đặt lịch"}
          </div>
          <div className="schedule-subtitle">
            {currentStep === 1 && "Vui lòng chọn thời gian phù hợp để xem phòng"}
            {currentStep === 2 && "Kiểm tra lại thông tin trước khi xác nhận"}
            {currentStep === 3 && "Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi"}
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        {/* Footer Buttons */}
        <div className="schedule-footer">
          <Button 
            className="back-button"
            onClick={handleBack}
            icon={<LeftOutlined />}
          >
            {currentStep === 1 ? "Hủy" : "Quay lại"}
          </Button>
          
          <Button 
            type="primary"
            className="continue-button"
            onClick={handleContinue}
          >
            {currentStep === 3 ? "Hoàn thành" : "Tiếp tục"}
            {currentStep !== 3 && <RightOutlined />}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

ScheduleBookingModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  roomData: PropTypes.shape({
    name: PropTypes.string,
    price: PropTypes.number,
    address: PropTypes.string
  }),
  userData: PropTypes.shape({
    name: PropTypes.string,
    phone: PropTypes.string,
    email: PropTypes.string
  })
};

export default ScheduleBookingModal;