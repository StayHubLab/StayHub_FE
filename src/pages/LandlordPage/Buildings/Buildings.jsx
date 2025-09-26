import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  App,
  Descriptions,
  Divider,
  DatePicker,
  Switch,
  Row,
  Col,
} from "antd";
import buildingApi from "../../../services/api/buildingApi";
import { useAuth } from "../../../contexts/AuthContext";

const Buildings = () => {
  const { message } = App.useApp();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);
  const [form] = Form.useForm();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await buildingApi.getAllBuildings({ hostId: user?._id });
      const buildings =
        res?.data?.buildings || res?.buildings || res?.data || [];
      setData(buildings);
    } catch (e) {
      console.error(e);
      message.error("Không tải được danh sách tòa nhà");
    } finally {
      setLoading(false);
    }
  }, [user?._id, message]);

  useEffect(() => {
    load();
  }, [load]);

  const onEdit = (record) => {
    setEditing(record?._id || null);
    setOpen(true);
    form.setFieldsValue({
      name: record?.name,
      description: record?.description,
      floors: record?.floors,
      area: record?.area,
      avgPrice: record?.avgPrice,
      totalRooms: record?.totalRooms,
      availableRooms: record?.availableRooms,
      rating: record?.rating,
      status: record?.status,
      address_street: record?.address?.street,
      address_ward: record?.address?.ward,
      address_district: record?.address?.district,
      address_city: record?.address?.city,
      address_lat: record?.address?.coordinates?.lat,
      address_lng: record?.address?.coordinates?.lng,
      highlightPoints: record?.highlightPoints?.join("\n"),
      rulesFile: record?.rulesFile,
      mapLink: record?.mapLink,
      seoTitle: record?.seoTitle,
      seoDescription: record?.seoDescription,
      amenities: record?.amenities?.join("\n"),
      nearbyPlaces: record?.nearbyPlaces
        ?.map((place) => `${place.name}|${place.type}|${place.distance}`)
        .join("\n"),
      isPremium: record?.premiumFeatures?.isPremium,
      premiumUntil: record?.premiumFeatures?.premiumUntil,
      featuredUntil: record?.premiumFeatures?.featuredUntil,
    });
  };

  const onCreate = () => {
    setEditing(null);
    setOpen(true);
    form.resetFields();
  };

  const onViewDetail = (record) => {
    setDetailRecord(record);
    setDetailOpen(true);
  };

  const onSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Parse nearby places
      const nearbyPlaces = values.nearbyPlaces
        ? values.nearbyPlaces
            .split("\n")
            .filter((line) => line.trim())
            .map((line) => {
              const [name, type, distance] = line.split("|");
              return {
                name: name?.trim(),
                type: type?.trim(),
                distance: parseFloat(distance) || 0,
              };
            })
        : [];

      const payload = {
        name: values.name,
        description: values.description,
        floors: values.floors,
        area: values.area,
        avgPrice: values.avgPrice,
        totalRooms: values.totalRooms,
        availableRooms: values.availableRooms,
        rating: values.rating,
        status: values.status,
        address: {
          street: values.address_street,
          ward: values.address_ward,
          district: values.address_district,
          city: values.address_city,
          coordinates: {
            lat: values.address_lat,
            lng: values.address_lng,
          },
        },
        highlightPoints: values.highlightPoints
          ? values.highlightPoints.split("\n").filter((line) => line.trim())
          : [],
        rulesFile: values.rulesFile,
        mapLink: values.mapLink,
        seoTitle: values.seoTitle,
        seoDescription: values.seoDescription,
        amenities: values.amenities
          ? values.amenities.split("\n").filter((line) => line.trim())
          : [],
        nearbyPlaces,
        premiumFeatures: {
          isPremium: values.isPremium || false,
          premiumUntil: values.premiumUntil,
          featuredUntil: values.featuredUntil,
        },
      };

      if (editing) {
        await buildingApi.updateBuilding(editing, payload);
        message.success("Cập nhật tòa nhà thành công");
      } else {
        await buildingApi.createBuilding({ ...payload, hostId: user?._id });
        message.success("Tạo tòa nhà thành công");
      }
      setOpen(false);
      await load();
    } catch (e) {
      if (e?.errorFields) return; // form errors
      console.error(e);
      message.error("Lưu tòa nhà thất bại");
    }
  };

  const columns = [
    { title: "Tên tòa nhà", dataIndex: "name", key: "name" },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, r) => {
        const a = r.address || {};
        return [a.street, a.ward, a.district, a.city]
          .filter(Boolean)
          .join(", ");
      },
    },
    { title: "Tầng", dataIndex: "floors", key: "floors" },
    { title: "Diện tích (m²)", dataIndex: "area", key: "area" },
    { title: "Giá TB/tháng", dataIndex: "avgPrice", key: "avgPrice" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "active" ? "green" : "default"}>
          {s || "inactive"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button onClick={() => onViewDetail(r)}>Chi tiết</Button>
          <Button onClick={() => onEdit(r)}>Chỉnh sửa</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Tòa nhà của tôi"
      extra={
        <Button type="primary" onClick={onCreate}>
          Thêm tòa nhà
        </Button>
      }
    >
      <Table
        rowKey={(r) => r._id}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        open={open}
        title={editing ? "Cập nhật tòa nhà" : "Thêm tòa nhà"}
        onOk={onSubmit}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        width={1000}
        style={{ top: 20 }}
      >
        <Form
          layout="vertical"
          form={form}
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Tên tòa nhà"
                name="name"
                rules={[{ required: true, message: "Nhập tên tòa nhà" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Trạng thái" name="status">
                <Select>
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="inactive">
                    Không hoạt động
                  </Select.Option>
                  <Select.Option value="pending">Chờ duyệt</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Số tầng" name="floors">
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
            <Col span={8}>
              <Form.Item
                label="Tổng số phòng"
                name="totalRooms"
                rules={[{ required: true, message: "Nhập tổng số phòng" }]}
              >
                <InputNumber style={{ width: "100%" }} min={1} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Phòng trống"
                name="availableRooms"
                rules={[{ required: true, message: "Nhập số phòng trống" }]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đánh giá" name="rating">
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Địa chỉ</Divider>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Đường"
                name="address_street"
                rules={[{ required: true, message: "Nhập đường" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phường/Xã"
                name="address_ward"
                rules={[{ required: true, message: "Nhập phường/xã" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Quận/Huyện"
                name="address_district"
                rules={[{ required: true, message: "Nhập quận/huyện" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="address_city"
                rules={[{ required: true, message: "Nhập tỉnh/thành phố" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Vĩ độ" name="address_lat">
                <InputNumber style={{ width: "100%" }} step={0.000001} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Kinh độ" name="address_lng">
                <InputNumber style={{ width: "100%" }} step={0.000001} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Thông tin bổ sung</Divider>
          <Form.Item
            label="Điểm nổi bật (mỗi dòng một điểm)"
            name="highlightPoints"
          >
            <Input.TextArea
              rows={3}
              placeholder="Ví dụ:&#10;Hồ bơi&#10;Gym&#10;Bảo vệ 24/7"
            />
          </Form.Item>

          <Form.Item label="Tiện ích (mỗi dòng một tiện ích)" name="amenities">
            <Input.TextArea
              rows={3}
              placeholder="Ví dụ:&#10;WiFi&#10;Điều hòa&#10;Máy giặt"
            />
          </Form.Item>

          <Form.Item
            label="Địa điểm lân cận (mỗi dòng: Tên|Loại|Khoảng cách km)"
            name="nearbyPlaces"
          >
            <Input.TextArea
              rows={3}
              placeholder="Ví dụ:&#10;Vincom Center|Shopping Mall|0.5&#10;Bệnh viện|Hospital|1.2"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="File quy định" name="rulesFile">
                <Input placeholder="URL file PDF" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Link bản đồ" name="mapLink">
                <Input placeholder="URL Google Maps" />
              </Form.Item>
            </Col>
          </Row>

          <Divider>SEO</Divider>
          <Form.Item label="SEO Title" name="seoTitle">
            <Input maxLength={60} />
          </Form.Item>
          <Form.Item label="SEO Description" name="seoDescription">
            <Input.TextArea rows={2} maxLength={160} />
          </Form.Item>

          <Divider>Tính năng Premium</Divider>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Premium"
                name="isPremium"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Premium đến" name="premiumUntil">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Featured đến" name="featuredUntil">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        open={detailOpen}
        title="Chi tiết tòa nhà"
        footer={null}
        onCancel={() => setDetailOpen(false)}
        width={800}
      >
        {detailRecord && (
          <>
            <Descriptions column={2} bordered size="middle">
              <Descriptions.Item label="Tên">
                {detailRecord.name}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={detailRecord.status === "active" ? "green" : "default"}
                >
                  {detailRecord.status || "inactive"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số tầng">
                {detailRecord.floors}
              </Descriptions.Item>
              <Descriptions.Item label="Diện tích (m²)">
                {detailRecord.area}
              </Descriptions.Item>
              <Descriptions.Item label="Giá TB/tháng" span={2}>
                {detailRecord.avgPrice}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {[
                  detailRecord.address?.street,
                  detailRecord.address?.ward,
                  detailRecord.address?.district,
                  detailRecord.address?.city,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Descriptions.Item>
              {detailRecord.premiumFeatures && (
                <Descriptions.Item label="Premium" span={2}>
                  {detailRecord.premiumFeatures.isPremium ? "Có" : "Không"}
                </Descriptions.Item>
              )}
            </Descriptions>

            {detailRecord.description && (
              <>
                <Divider />
                <div>
                  <b>Mô tả</b>
                </div>
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {detailRecord.description}
                </div>
              </>
            )}

            {Array.isArray(detailRecord.amenities) &&
              detailRecord.amenities.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <b>Tiện ích</b>
                  </div>
                  <div>{detailRecord.amenities.join(", ")}</div>
                </>
              )}

            {Array.isArray(detailRecord.images) &&
              detailRecord.images.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <b>Hình ảnh</b>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {detailRecord.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={typeof img === "string" ? img : img.url}
                        alt={`img-${idx}`}
                        style={{
                          width: 120,
                          height: 80,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
          </>
        )}
      </Modal>
    </Card>
  );
};

export default Buildings;
