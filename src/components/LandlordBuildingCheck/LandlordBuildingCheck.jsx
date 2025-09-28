import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import buildingApi from "../../services/api/buildingApi";
import { Spin, Result, Button } from "antd";

const LandlordBuildingCheck = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasBuildings, setHasBuildings] = useState(false);

  useEffect(() => {
    const checkBuildings = async () => {
      if (!user || user.role !== "landlord") {
        navigate("/start");
        return;
      }

      try {
        setLoading(true);
        const response = await buildingApi.getAllBuildings({
          hostId: user._id,
        });
        const buildings =
          response?.data?.buildings ||
          response?.buildings ||
          response?.data ||
          [];

        if (buildings.length === 0) {
          setHasBuildings(false);
        } else {
          setHasBuildings(true);
        }
      } catch (error) {
        console.error("Error checking buildings:", error);
        setHasBuildings(false);
      } finally {
        setLoading(false);
      }
    };

    checkBuildings();
  }, [user, navigate]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!hasBuildings) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
          background: "none",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "60px 40px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative background elements */}
          <div
            style={{
              position: "absolute",
              top: "-50px",
              right: "-50px",
              width: "100px",
              height: "100px",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              borderRadius: "50%",
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-30px",
              left: "-30px",
              width: "60px",
              height: "60px",
              background: "linear-gradient(45deg, #764ba2, #667eea)",
              borderRadius: "50%",
              opacity: 0.1,
            }}
          />

          {/* Icon */}
          <div
            style={{
              width: "80px",
              height: "80px",
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 30px",
              boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
            }}
          >
            <span
              style={{
                fontSize: "36px",
                color: "white",
                fontWeight: "bold",
              }}
            >
              🏢
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#2c3e50",
              marginBottom: "16px",
              lineHeight: "1.3",
            }}
          >
            Tạo tòa nhà đầu tiên
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: "16px",
              color: "#7f8c8d",
              marginBottom: "40px",
              lineHeight: "1.6",
              maxWidth: "400px",
              margin: "0 auto 40px",
            }}
          >
            Để sử dụng hệ thống quản lý, bạn cần tạo ít nhất một tòa nhà. Hãy
            bắt đầu xây dựng danh mục bất động sản của bạn ngay hôm nay!
          </p>

          {/* Action Button */}
          <div style={{ textAlign: "center" }}>
            <Button
              type="primary"
              size="large"
              onClick={() => navigate("/create-building")}
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                border: "none",
                borderRadius: "12px",
                padding: "12px 32px",
                height: "auto",
                fontSize: "16px",
                fontWeight: "600",
                boxShadow: "0 8px 16px rgba(102, 126, 234, 0.3)",
                transition: "all 0.3s ease",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 12px 24px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow =
                  "0 8px 16px rgba(102, 126, 234, 0.3)";
              }}
            >
              Tạo tòa nhà ngay
            </Button>
          </div>

          {/* Additional info */}
          {/* <div
            style={{
              marginTop: "30px",
              padding: "20px",
              background: "#f8f9fa",
              borderRadius: "12px",
              border: "1px solid #e9ecef",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6c757d",
                margin: 0,
                lineHeight: "1.5",
              }}
            >
              💡 <strong>Mẹo:</strong> Bạn có thể thêm nhiều tòa nhà sau khi tạo
              tòa nhà đầu tiên
            </p>
          </div> */}
        </div>
      </div>
    );
  }

  return children;
};

export default LandlordBuildingCheck;
