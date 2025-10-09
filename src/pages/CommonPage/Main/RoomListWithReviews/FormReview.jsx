import React, { useState } from 'react';
import {
  Form,
  Rate,
  Input,
  Button,
  Space,
  Typography,
  Divider
} from 'antd';
import {
  StarOutlined,
  SendOutlined,
  CloseOutlined
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

const FormReview = ({ onSubmit, onCancel, targetType = 'room' }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [commentLength, setCommentLength] = useState(0);

  const targetLabel = targetType === 'room' ? 'phòng trọ' : 'chủ trọ';
  const placeholderText = targetType === 'room' 
    ? 'Chia sẻ trải nghiệm của bạn về phòng trọ này... (tiện nghi, vệ sinh, an ninh, dịch vụ...)'
    : 'Chia sẻ trải nghiệm của bạn về chủ trọ này... (thái độ, trách nhiệm, hỗ trợ...)';

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await onSubmit(values);
      form.resetFields();
      setCommentLength(0);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCommentChange = (e) => {
    const value = e.target.value;
    setCommentLength(value.length);
  };

  const handleCancel = () => {
    form.resetFields();
    setCommentLength(0);
    onCancel();
  };

  return (
    <div className="form-review-container">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="review-form"
      >
        <Form.Item
          name="rating"
          label={
            <Text strong className="form-label">
              <StarOutlined /> Đánh giá của bạn
            </Text>
          }
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn số sao đánh giá!'
            }
          ]}
        >
          <Rate
            allowHalf
            style={{ fontSize: '28px', color: '#FAC227' }}
            character={<StarOutlined />}
          />
        </Form.Item>

        <Form.Item
          name="comment"
          label={
            <div className="comment-label-container">
              <Text strong className="form-label">
                Nhận xét chi tiết
              </Text>
              <Text className="comment-counter">
                {commentLength}/500 ký tự
              </Text>
            </div>
          }
          rules={[
            {
              required: true,
              message: `Vui lòng nhập nhận xét về ${targetLabel}!`
            },
            {
              min: 10,
              message: 'Nhận xét phải có ít nhất 10 ký tự!'
            },
            {
              max: 500,
              message: 'Nhận xét không được vượt quá 500 ký tự!'
            }
          ]}
        >
          <TextArea
            rows={6}
            placeholder={placeholderText}
            maxLength={500}
            showCount={false}
            onChange={handleCommentChange}
            className="review-textarea"
          />
        </Form.Item>

        <Divider />

        <Form.Item className="form-actions">
          <Space size="middle">
            <Button
              type="default"
              icon={<CloseOutlined />}
              onClick={handleCancel}
              className="cancel-button"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SendOutlined />}
              className="submit-button"
            >
              {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormReview;