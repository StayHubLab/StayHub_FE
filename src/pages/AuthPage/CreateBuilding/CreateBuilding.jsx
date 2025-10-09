import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Row,
  Col,
  Typography,
  App,
  Divider,
  Select,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import buildingApi from "../../../services/api/buildingApi";
import { useAuth } from "../../../contexts/AuthContext";
import vietnamProvinceApi from "../../../services/api/vietnamProvinceApi";
import logoRemoveBG from "../../../assets/images/logo/logoRemoveBG.png";
import "./CreateBuilding.css";

const { Title, Text } = Typography;

const CreateBuilding = () => {
  const { message } = App.useApp();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);

  // Check if user is landlord
  useEffect(() => {
    if (!user || user.role !== "landlord") {
      navigate("/start");
    }
  }, [user, navigate]);

  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const data = await vietnamProvinceApi.fetchProvinces();
        setProvinces(data);
      } catch (error) {
        message.error("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [message]);

  // Load wards when province changes
  const handleProvinceChange = async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      setSelectedProvince(null);
      form.setFieldsValue({ address_ward: undefined });
      return;
    }

    setLoadingWards(true);
    try {
      const data = await vietnamProvinceApi.fetchWards(provinceCode);
      setWards(data);

      // Find and set selected province
      const province = provinces.find((p) => p.code === provinceCode);
      setSelectedProvince(province);

      // Clear ward selection when province changes
      form.setFieldsValue({ address_ward: undefined });
    } catch (error) {
      message.error("Không thể tải danh sách phường/xã");
    } finally {
      setLoadingWards(false);
    }
  };

  // Handle ward selection and get coordinates
  const handleWardChange = (wardName) => {
    const ward = wards.find((w) => w.name === wardName);

    // Set coordinates if available
    if (ward && ward.coordinates) {
      form.setFieldsValue({
        address_lat: ward.coordinates.lat,
        address_lng: ward.coordinates.lng,
      });
    }
  };

  // Get coordinates from address (simple fallback)
  const getCoordinatesFromAddress = async () => {
    const values = form.getFieldsValue();

    if (!values.address_street || !values.address_ward || !selectedProvince) {
      message.warning("Vui lòng điền đầy đủ thông tin địa chỉ");
      return;
    }

    try {
      // Simple coordinate mapping for major Vietnamese cities
      const cityCoordinates = {
        "Hồ Chí Minh": { lat: 10.8231, lng: 106.6297 },
        "Hà Nội": { lat: 21.0285, lng: 105.8542 },
        "Đà Nẵng": { lat: 16.0544, lng: 108.2022 },
        "Cần Thơ": { lat: 10.0452, lng: 105.7469 },
        "Hải Phòng": { lat: 20.8449, lng: 106.6881 },
        "Biên Hòa": { lat: 10.9447, lng: 106.8243 },
        "Nha Trang": { lat: 12.2388, lng: 109.1967 },
        Huế: { lat: 16.4637, lng: 107.5909 },
        "Vũng Tàu": { lat: 10.3459, lng: 107.0843 },
        "Quy Nhon": { lat: 13.7765, lng: 109.2233 },
      };

      const cityName = selectedProvince?.name;
      const coordinates = cityCoordinates[cityName] || {
        lat: 10.8231,
        lng: 106.6297,
      }; // Default to HCMC

      form.setFieldsValue({
        address_lat: coordinates.lat,
        address_lng: coordinates.lng,
      });

      message.success(`Đã lấy tọa độ cho ${cityName}`);
    } catch (error) {
      message.error("Lỗi khi lấy tọa độ");
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        name: values.name,
        description: values.description,
        floors: values.floors,
        area: values.area,
        avgPrice: values.avgPrice,
        totalRooms: values.totalRooms,
        availableRooms: values.availableRooms,
        rating: 0,
        status: "active",
        address: {
          street: values.address_street,
          ward: values.address_ward,
          district: values.address_district || "",
          city: selectedProvince?.name || values.address_city,
          coordinates: {
            lat: values.address_lat || 0,
            lng: values.address_lng || 0,
          },
        },
        highlightPoints: [],
        rulesFile: "",
        mapLink: "",
        seoTitle: "",
        seoDescription: "",
        amenities: [],
        nearbyPlaces: [],
        premiumFeatures: {
          isPremium: false,
          premiumUntil: null,
          featuredUntil: null,
        },
        hostId: user?._id,
      };

      const response = await buildingApi.createBuilding(payload);

      if (response?.success || response?.data) {
        message.success("Tạo tòa nhà thành công!");
        navigate("/landlord");
      } else {
        message.error("Tạo tòa nhà thất bại!");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.error ||
          "Không thể tạo tòa nhà. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/landlord");
  };

  if (loadingProvinces) {
    return (
      <div className="create-building-container">
        <div
          className="create-building-card"
          style={{ textAlign: "center", padding: "60px" }}
        >
          <Spin size="large" />
          <div style={{ marginTop: "20px", fontSize: "16px", color: "#666" }}>
            Đang tải danh sách tỉnh/thành phố...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="building-create-container">
      <div className="building-create-card">
        {/* Header */}
        <div className="building-create-header">
          <div className="building-logo-container">
            <img src={logoRemoveBG} alt="StayHub Logo" className="building-logo-image" />
          </div>

          <div className="building-create-title-section">
            <Title level={2} className="building-create-title">
              Tạo tòa nhà đầu tiên
            </Title>
            <Text className="building-create-subtitle">
              Để bắt đầu quản lý, hãy tạo tòa nhà đầu tiên của bạn.
            </Text>
          </div>
        </div>

        {/* Building Form */}
        <Form
          form={form}
          name="createBuilding"
          onFinish={handleSubmit}
          layout="vertical"
          size="large"
          className="building-create-form"
          initialValues={{}}
        >
          <div className="building-form-section">
            <Title level={4}>Thông tin cơ bản</Title>
            <Form.Item
              label="Tên tòa nhà"
              name="name"
              rules={[{ required: true, message: "Nhập tên tòa nhà" }]}
            >
              <Input placeholder="Ví dụ: Chung cư ABC" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Nhập mô tả tòa nhà" }]}
            >
              <Input.TextArea rows={3} placeholder="Mô tả về tòa nhà..." />
            </Form.Item>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Số tầng"
                  name="floors"
                  rules={[{ required: true, message: "Nhập số tầng" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={1} max={200} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Diện tích (m²)"
                  name="area"
                  rules={[{ required: true, message: "Nhập diện tích" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Giá TB/tháng"
                  name="avgPrice"
                  rules={[{ required: true, message: "Nhập giá trung bình" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Tổng số phòng"
                  name="totalRooms"
                  rules={[{ required: true, message: "Nhập tổng số phòng" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={1} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Phòng trống"
                  name="availableRooms"
                  rules={[{ required: true, message: "Nhập số phòng trống" }]}
                >
                  <InputNumber style={{ width: "100%" }} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider />

          <div className="building-form-section">
            <Title level={4}>Địa chỉ</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Đường"
                  name="address_street"
                  rules={[{ required: true, message: "Nhập đường" }]}
                >
                  <Input placeholder="Tên đường" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Tỉnh/Thành phố"
                  name="address_city"
                  rules={[{ required: true, message: "Chọn tỉnh/thành phố" }]}
                >
                  <Select
                    placeholder="Chọn tỉnh/thành phố"
                    loading={loadingProvinces}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleProvinceChange}
                  >
                    {provinces.map((province) => (
                      <Select.Option key={province.code} value={province.code}>
                        {province.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Phường/Xã"
                  name="address_ward"
                  rules={[{ required: true, message: "Chọn phường/xã" }]}
                >
                  <Select
                    placeholder="Chọn phường/xã"
                    loading={loadingWards}
                    disabled={!selectedProvince}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={handleWardChange}
                  >
                    {wards.map((ward) => (
                      <Select.Option key={ward.code} value={ward.name}>
                        {ward.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Quận/Huyện"
                  name="address_district"
                  rules={[{ required: false, message: "Nhập quận/huyện" }]}
                >
                  <Input placeholder="Tên quận/huyện (tùy chọn)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label="Vĩ độ" name="address_lat">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={0.000001}
                    placeholder="Tự động điền khi chọn phường/xã"
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Kinh độ" name="address_lng">
                  <InputNumber
                    style={{ width: "100%" }}
                    step={0.000001}
                    placeholder="Tự động điền khi chọn phường/xã"
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Tọa độ">
                  <Button
                    type="dashed"
                    onClick={getCoordinatesFromAddress}
                    disabled={!selectedProvince}
                    style={{ width: "100%" }}
                  >
                    Lấy tọa độ từ địa chỉ
                  </Button>
                </Form.Item>
              </Col>
              {/* <Col span={12}>
                <Form.Item
                  label="Quận/Huyện"
                  name="address_district"
                  rules={[{ required: true, message: "Nhập quận/huyện" }]}
                >
                  <Input placeholder="Tên quận/huyện" />
                </Form.Item>
              </Col> */}
            </Row>
          </div>

          <div className="building-form-actions">
            {/* <Button onClick={handleSkip} className="building-skip-btn">
              Bỏ qua
            </Button> */}
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="building-create-btn"
            >
              Tạo tòa nhà
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateBuilding;
