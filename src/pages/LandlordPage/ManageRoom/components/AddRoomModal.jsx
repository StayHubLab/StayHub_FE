import React, { useState } from "react";
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
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./AddRoomModal.css";

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

const AddRoomModal = ({ visible, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState("");

  const roomTypes = [
    "Phòng trọ",
    "Chung cư mini",
    "Homestay",
    "Căn hộ",
    "Nhà nguyên căn",
    "Phòng trong nhà",
  ];

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
    "Chỗ để xe",
    "An ninh 24/7",
    "Gần trường học",
    "Gần chợ",
    "Gần bệnh viện",
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Create room data
      const roomData = {
        ...values,
        amenities: amenities,
        images: fileList.map((file) => file.url || file.response?.url),
        status: "available",
        createdAt: new Date().toISOString(),
      };

      // Call the parent submit handler
      await onSubmit(roomData);

      // Reset form
      form.resetFields();
      setFileList([]);
      setAmenities([]);
      setCurrentAmenity("");

      message.success("Thêm phòng thành công!");
      onClose();
    } catch (error) {
      message.error("Có lỗi xảy ra khi thêm phòng!");
      console.error("Error adding room:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    setAmenities([]);
    setCurrentAmenity("");
    onClose();
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Chỉ cho phép upload file JPG/PNG!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Hình ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    return true;
  };

  const addAmenity = () => {
    if (currentAmenity.trim() && !amenities.includes(currentAmenity.trim())) {
      setAmenities([...amenities, currentAmenity.trim()]);
      setCurrentAmenity("");
    }
  };

  const removeAmenity = (removedAmenity) => {
    setAmenities(amenities.filter((amenity) => amenity !== removedAmenity));
  };

  const addCommonAmenity = (amenity) => {
    if (!amenities.includes(amenity)) {
      setAmenities([...amenities, amenity]);
    }
  };

  const uploadButton = (
    <div className="landlord-upload-button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="Thêm phòng mới"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      className="landlord-add-room-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="landlord-add-room-form"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="roomCode"
              label="Mã phòng"
              rules={[
                { required: true, message: "Vui lòng nhập mã phòng!" },
                {
                  pattern: /^[A-Za-z0-9]+$/,
                  message: "Mã phòng chỉ chứa chữ và số!",
                },
              ]}
            >
              <Input
                placeholder="VD: P101, A1, ..."
                className="landlord-input"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên phòng"
              rules={[{ required: true, message: "Vui lòng nhập tên phòng!" }]}
            >
              <Input
                placeholder="VD: Phòng trọ cao cấp..."
                className="landlord-input"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input
            placeholder="VD: 123 Đường ABC, Phường XYZ, Quận DEF..."
            className="landlord-input"
          />
        </Form.Item>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="type"
              label="Loại phòng"
              rules={[{ required: true, message: "Vui lòng chọn loại phòng!" }]}
            >
              <Select placeholder="Chọn loại phòng" className="landlord-select">
                {roomTypes.map((type) => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="area"
              label="Diện tích (m²)"
              rules={[{ required: true, message: "Vui lòng nhập diện tích!" }]}
            >
              <InputNumber
                min={1}
                max={1000}
                placeholder="VD: 25"
                className="landlord-input-number"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Giá thuê (VNĐ/tháng)"
              rules={[{ required: true, message: "Vui lòng nhập giá thuê!" }]}
            >
              <InputNumber
                min={100000}
                max={100000000}
                step={100000}
                placeholder="VD: 3000000"
                className="landlord-input-number"
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Mô tả">
          <TextArea
            rows={4}
            placeholder="Mô tả chi tiết về phòng, vị trí, tiện ích..."
            className="landlord-textarea"
          />
        </Form.Item>

        {/* Amenities Section */}
        <Form.Item label="Tiện nghi">
          <div className="landlord-amenities-section">
            <div className="landlord-amenities-input">
              <Input
                value={currentAmenity}
                onChange={(e) => setCurrentAmenity(e.target.value)}
                placeholder="Nhập tiện nghi..."
                className="landlord-input"
                onPressEnter={addAmenity}
                suffix={
                  <Button
                    type="primary"
                    size="small"
                    onClick={addAmenity}
                    className="landlord-add-amenity-btn"
                  >
                    Thêm
                  </Button>
                }
              />
            </div>

            {/* Common amenities quick add */}
            <div className="landlord-common-amenities">
              <Text
                type="secondary"
                className="landlord-common-amenities-label"
              >
                Tiện nghi phổ biến:
              </Text>
              <div className="landlord-common-amenities-tags">
                {commonAmenities.map((amenity) => (
                  <Button
                    key={amenity}
                    size="small"
                    onClick={() => addCommonAmenity(amenity)}
                    disabled={amenities.includes(amenity)}
                    style={{ margin: "2px" }}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Selected amenities */}
            {amenities.length > 0 && (
              <div className="landlord-selected-amenities">
                <Text strong className="landlord-selected-amenities-label">
                  Tiện nghi đã chọn:
                </Text>
                <div className="landlord-selected-amenities-tags">
                  {amenities.map((amenity) => (
                    <Tag
                      key={amenity}
                      closable
                      onClose={() => removeAmenity(amenity)}
                      color="#4739F0"
                      className="landlord-selected-amenity-tag"
                    >
                      {amenity}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Form.Item>

        {/* Image Upload Section */}
        <Form.Item label="Hình ảnh phòng">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            beforeUpload={beforeUpload}
            multiple
            className="landlord-upload"
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <Text type="secondary" className="landlord-upload-hint">
            Tối đa 8 hình ảnh, mỗi file không quá 5MB (JPG, PNG)
          </Text>
        </Form.Item>

        {/* Form Actions */}
        <Form.Item className="landlord-form-actions">
          <Button
            onClick={handleCancel}
            className="landlord-cancel-btn"
            size="large"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="landlord-submit-btn"
            size="large"
          >
            Thêm phòng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
            Thêm phòng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
            Thêm phòng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
            Thêm phòng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
            Thêm phòng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
            Thêm phòng
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

AddRoomModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};