import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  Button,
  message,
  Row,
  Col,
  Tag,
  Typography,
  Checkbox,
  Switch,
  Divider,
  Space,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./EditRoomModal.css";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const roomTypes = [
  "Phòng trọ",
  "Chung cư mini",
  "Homestay",
  "Căn hộ",
  "Nhà nguyên căn",
  "Phòng trong nhà",
];

const EditRoomModal = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState("");

  const commonAmenities = [
    "Wi-Fi miễn phí",
    "Điều hòa",
    "Tủ lạnh",
    "Máy giặt",
    "Nóng lạnh",
    "Ban công",
    "Cửa sổ",
    "WC riêng",
    "Bếp",
    "Thang máy",
    "Bảo vệ 24/7",
    "Chỗ đậu xe",
    "Gần trung tâm",
  ];

  const statusOptions = [
    { value: "available", label: "Còn trống" },
    { value: "rented", label: "Đã thuê" },
    { value: "maintenance", label: "Bảo trì" },
    { value: "reserved", label: "Đã đặt cọc" },
  ];

  const featureOptions = [
    { key: "hasBalcony", label: "Ban công" },
    { key: "hasWindow", label: "Cửa sổ" },
    { key: "hasAircon", label: "Điều hòa" },
    { key: "hasWaterHeater", label: "Nóng lạnh" },
    { key: "hasKitchen", label: "Bếp" },
    { key: "hasWardrobe", label: "Tủ quần áo" },
    { key: "hasDesk", label: "Bàn làm việc" },
    { key: "hasTv", label: "TV" },
    { key: "hasInternet", label: "Internet" },
    { key: "hasElevator", label: "Thang máy" },
  ];

  // Reset form when modal opens/closes or data changes
  useEffect(() => {
    if (visible) {
      if (initialData && isEdit) {
        // Populate form with existing data for edit mode
        const formData = {
          name: initialData.name,
          type: initialData.type || roomTypes[0],
          area: initialData.area,
          capacity: initialData.capacity,
          rent:
            initialData.priceDetails?.rent ||
            initialData.price?.rent ||
            initialData.price,
          electricity:
            initialData.priceDetails?.electricity ||
            initialData.price?.electricity,
          water: initialData.priceDetails?.water || initialData.price?.water,
          service:
            initialData.priceDetails?.service || initialData.price?.service,
          deposit:
            initialData.priceDetails?.deposit || initialData.price?.deposit,
          status: initialData.status || "available",
          description: initialData.description,
          isAvailable: initialData.isAvailable !== false,
          // Features
          hasBalcony: initialData.features?.hasBalcony || false,
          hasWindow: initialData.features?.hasWindow || false,
          hasAircon: initialData.features?.hasAircon || false,
          hasWaterHeater: initialData.features?.hasWaterHeater || false,
          hasKitchen: initialData.features?.hasKitchen || false,
          hasWardrobe: initialData.features?.hasWardrobe || false,
          hasDesk: initialData.features?.hasDesk || false,
          hasTv: initialData.features?.hasTv || false,
          hasInternet: initialData.features?.hasInternet || false,
          hasElevator: initialData.features?.hasElevator || false,
        };

        form.setFieldsValue(formData);
        setAmenities(initialData.amenities || []);

        // Handle existing images
        if (initialData.images && Array.isArray(initialData.images)) {
          const existingFiles = initialData.images
            .map((img, index) => {
              // Ensure URL is a string
              let imageUrl = "";
              if (typeof img === "string") {
                imageUrl = img;
              } else if (img && typeof img.url === "string") {
                imageUrl = img.url;
              } else if (img && typeof img.secure_url === "string") {
                imageUrl = img.secure_url;
              }

              const fileObj = {
                uid: `existing-${index}`,
                name: `image-${index}.jpg`,
                status: "done",
                url: imageUrl,
                thumbUrl: imageUrl,
                isExisting: true,
                originalData: img, // Keep original data for reference
              };

              return fileObj;
            })
            .filter((file) => file.url); // Only keep files with valid URLs

          setFileList(existingFiles);
        }
      } else {
        // Reset form for add mode
        form.resetFields();
        setAmenities([]);
        setFileList([]);
      }
    }
  }, [visible, initialData, isEdit, form]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Prepare form data
      const formData = new FormData();

      // Basic info
      formData.append("name", values.name);
      formData.append("type", values.type);
      formData.append("area", values.area);
      formData.append("capacity", values.capacity);
      formData.append("description", values.description || "");
      formData.append("status", values.status);
      formData.append("isAvailable", values.isAvailable);

      // Price information
      const priceData = {
        rent: values.rent,
        electricity: values.electricity || 0,
        water: values.water || 0,
        service: values.service || 0,
        deposit: values.deposit || 0,
      };
      formData.append("price", JSON.stringify(priceData));

      // Features
      const featuresData = {};
      featureOptions.forEach((feature) => {
        featuresData[feature.key] = values[feature.key] || false;
      });
      formData.append("features", JSON.stringify(featuresData));

      // Amenities
      formData.append("amenities", JSON.stringify(amenities));

      // Handle images - fix nested array issue

      // Flatten fileList in case it contains nested arrays
      const flatFileList = Array.isArray(fileList)
        ? fileList.flat(Infinity)
        : [];

      // Filter valid file objects
      const validFiles = flatFileList.filter(
        (file) =>
          file &&
          typeof file === "object" &&
          (file.uid || file.url || file.originFileObj)
      );

      // Handle new uploaded files
      const newFiles = validFiles.filter(
        (file) =>
          !file.isExisting &&
          file.originFileObj &&
          file.originFileObj instanceof File
      );

      newFiles.forEach((file) => {
        if (file.originFileObj instanceof File) {
          formData.append("images", file.originFileObj);
        }
      });

      // Keep existing images
      const existingImages = validFiles.filter(
        (file) => file.isExisting && file.url
      );

      if (existingImages.length > 0) {
        formData.append(
          "existingImages",
          JSON.stringify(existingImages.map((img) => img.url))
        );
      }

      await onSubmit(formData, initialData?._id);

      message.success(
        isEdit ? "Cập nhật phòng thành công!" : "Tạo phòng thành công!"
      );
      handleClose();
    } catch (error) {
      message.error(
        isEdit ? "Cập nhật phòng thất bại!" : "Tạo phòng thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setAmenities([]);
    setCurrentAmenity("");
    onClose();
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    // Deep flatten and validate fileList to prevent nested arrays
    const flattenFileList = (list) => {
      if (!Array.isArray(list)) return [];

      const flattened = [];
      list.forEach((item) => {
        if (Array.isArray(item)) {
          // Recursively flatten nested arrays
          flattened.push(...flattenFileList(item));
        } else if (
          item &&
          typeof item === "object" &&
          (item.uid || item.originFileObj || item.url)
        ) {
          // Valid file object
          flattened.push(item);
        }
      });
      return flattened;
    };

    const validFileList = flattenFileList(newFileList);
    setFileList(validFileList);
  };

  const addAmenity = () => {
    if (currentAmenity.trim() && !amenities.includes(currentAmenity.trim())) {
      setAmenities([...amenities, currentAmenity.trim()]);
      setCurrentAmenity("");
    }
  };

  const removeAmenity = (amenityToRemove) => {
    setAmenities(amenities.filter((amenity) => amenity !== amenityToRemove));
  };

  const addCommonAmenity = (amenity) => {
    if (!amenities.includes(amenity)) {
      setAmenities([...amenities, amenity]);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  return (
    <Modal
      title={
        isEdit ? `Chỉnh sửa phòng: ${initialData?.name}` : "Thêm phòng mới"
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={900}
      className="landlord-edit-room-modal"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="landlord-room-form"
      >
        {/* Basic Information */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên phòng"
              rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
            >
              <Input placeholder="VD: Phòng 101, Phòng Studio..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              label="Loại phòng"
              rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
            >
              <Select placeholder="Chọn loại phòng">
                {roomTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="area"
              label="Diện tích (m²)"
              rules={[{ required: true, message: "Vui lòng nhập diện tích!" }]}
            >
              <InputNumber
                min={1}
                max={1000}
                style={{ width: "100%" }}
                placeholder="VD: 25"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="capacity"
              label="Sức chứa (người)"
              rules={[{ required: true, message: "Vui lòng nhập sức chứa!" }]}
            >
              <InputNumber
                min={1}
                max={20}
                style={{ width: "100%" }}
                placeholder="VD: 2"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
            >
              <Select placeholder="Chọn trạng thái">
                {statusOptions.map((status) => (
                  <Option key={status.value} value={status.value}>
                    {status.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Price Information */}
        <Divider orientation="left">Thông tin giá</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="rent"
              label="Giá thuê (VND/tháng)"
              rules={[{ required: true, message: "Vui lòng nhập giá thuê!" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="VD: 3000000"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="deposit" label="Tiền cọc (VND)">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                placeholder="VD: 6000000"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="electricity" label="Giá điện (VND/kWh)">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="VD: 3500"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="water" label="Giá nước (VND/m³)">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="VD: 25000"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="service" label="Phí dịch vụ (VND/tháng)">
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="VD: 150000"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Features */}
        <Divider orientation="left">Tính năng phòng</Divider>
        <Row gutter={[16, 8]}>
          {featureOptions.map((feature) => (
            <Col span={8} key={feature.key}>
              <Form.Item name={feature.key} valuePropName="checked">
                <Checkbox>{feature.label}</Checkbox>
              </Form.Item>
            </Col>
          ))}
        </Row>

        {/* Availability */}
        <Row>
          <Col span={24}>
            <Form.Item name="isAvailable" valuePropName="checked">
              <div>
                <Switch
                  checkedChildren="Có sẵn"
                  unCheckedChildren="Không có sẵn"
                />
                <Text style={{ marginLeft: 8 }}>Phòng có sẵn để cho thuê</Text>
              </div>
            </Form.Item>
          </Col>
        </Row>

        {/* Amenities */}
        <Divider orientation="left">Tiện ích</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Text strong>Thêm tiện ích:</Text>
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 8,
                marginBottom: 16,
              }}
            >
              <Input
                value={currentAmenity}
                onChange={(e) => setCurrentAmenity(e.target.value)}
                placeholder="Nhập tiện ích..."
                onPressEnter={addAmenity}
              />
              <Button onClick={addAmenity} icon={<PlusOutlined />}>
                Thêm
              </Button>
            </div>
            <Text strong>Tiện ích phổ biến:</Text>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {commonAmenities.map((amenity) => (
                <Button
                  key={amenity}
                  size="small"
                  onClick={() => addCommonAmenity(amenity)}
                  disabled={amenities.includes(amenity)}
                >
                  {amenity}
                </Button>
              ))}
            </div>
          </Col>
          <Col span={12}>
            <Text strong>Tiện ích đã chọn:</Text>
            <div
              style={{
                marginTop: 8,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {amenities.map((amenity) => (
                <Tag
                  key={amenity}
                  closable
                  onClose={() => removeAmenity(amenity)}
                  color="#4739F0"
                >
                  {amenity}
                </Tag>
              ))}
            </div>
          </Col>
        </Row>

        {/* Description */}
        <Form.Item name="description" label="Mô tả phòng">
          <TextArea rows={4} placeholder="Nhập mô tả chi tiết về phòng..." />
        </Form.Item>

        {/* Images */}
        <Form.Item label="Hình ảnh phòng">
          <div>
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
              multiple
              accept="image/*"
            >
              {fileList.length >= 8 ? null : uploadButton}
            </Upload>
            <Text type="secondary">Tối đa 8 ảnh, định dạng: JPG, PNG</Text>
          </div>
        </Form.Item>

        {/* Submit Buttons */}
        <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
          <Space>
            <Button onClick={handleClose}>Hủy</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? "Cập nhật" : "Tạo phòng"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

EditRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  isEdit: PropTypes.bool,
};

export default EditRoomModal;
