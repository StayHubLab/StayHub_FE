import React, { useMemo } from "react";
import { Result, Button } from "antd";
import { useLocation, useNavigate } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const reasonMap = {
  "07": "Giao dịch bị nghi ngờ (liên hệ ngân hàng)",
  "09": "Thẻ/Tài khoản chưa đăng ký InternetBanking",
  10: "Xác thực thông tin thẻ/tài khoản chưa đúng",
  11: "Hết hạn mức/thẻ bị khóa",
  12: "Thẻ/Tài khoản bị khóa",
  13: "Sai mật khẩu OTP quá số lần cho phép",
  24: "Khách hàng hủy giao dịch",
  51: "Không đủ số dư",
  65: "Vượt quá hạn mức giao dịch",
  75: "Ngân hàng tạm thời không xử lý (thử lại)",
  79: "Từ chối giao dịch (liên hệ ngân hàng)",
  99: "Lỗi không xác định",
};

const PaymentResult = () => {
  const q = useQuery();
  const navigate = useNavigate();
  const status = q.get("status");
  const billId = q.get("bill");
  const isSuccess = status === "success";
  const reason = q.get("reason") || "";
  const reasonText = reasonMap[reason] || reason || "Vui lòng thử lại";

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Result
        status={isSuccess ? "success" : "error"}
        title={isSuccess ? "Thanh toán thành công" : "Thanh toán thất bại"}
        subTitle={
          isSuccess ? `Mã hoá đơn: ${billId || "-"}` : `Lý do: ${reasonText}`
        }
        extra={
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Button type="primary" onClick={() => navigate("/main/bills")}>
              Xem hóa đơn
            </Button>
            {!isSuccess && (
              <Button onClick={() => navigate("/main/bills")}>
                Thử thanh toán lại
              </Button>
            )}
            <Button onClick={() => navigate("/main/home")}>Về trang chủ</Button>
          </div>
        }
      />
    </div>
  );
};

export default PaymentResult;
