import React, { useState } from 'react';
import { Modal, Upload, Button, Form, App, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import billApi from '../../services/api/billApi';

const { Dragger } = Upload;

const UploadPaymentEvidenceModal = ({ visible, onClose, billId, onSuccess }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn file chứng từ thanh toán');
      return;
    }

    setUploading(true);
    try {
      const file = fileList[0].originFileObj || fileList[0];
      const formData = new FormData();
      formData.append('paymentEvidence', file);

      const result = await billApi.uploadPaymentEvidence(billId, formData);
      
      message.success('Tải lên chứng từ thanh toán thành công!');
      setFileList([]);
      setPreviewImage('');
      form.resetFields();
      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || 'Tải lên chứng từ thất bại');
    } finally {
      setUploading(false);
    }
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj || file);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const uploadProps = {
    name: 'paymentEvidence',
    multiple: false,
    fileList,
    listType: 'picture-card',
    onPreview: handlePreview,
    beforeUpload: (file) => {
      // Validate file type
      const isValidType = 
        file.type === 'image/jpeg' || 
        file.type === 'image/png' ||
        file.type === 'image/jpg' ||
        file.type === 'application/pdf';
      
      if (!isValidType) {
        message.error('Chỉ chấp nhận file JPG/PNG/PDF!');
        return Upload.LIST_IGNORE;
      }

      // Validate file size (5MB)
      const isValidSize = file.size / 1024 / 1024 < 5;
      if (!isValidSize) {
        message.error('File phải nhỏ hơn 5MB!');
        return Upload.LIST_IGNORE;
      }

      // Create preview for images
      const newFile = {
        uid: file.uid,
        name: file.name,
        status: 'done',
        originFileObj: file,
      };

      // Generate preview for images
      if (file.type.startsWith('image/')) {
        getBase64(file).then(preview => {
          newFile.url = preview;
          newFile.thumbUrl = preview;
          setFileList([newFile]);
        });
      } else {
        setFileList([newFile]);
      }

      return false; // Prevent auto upload
    },
    onRemove: () => {
      setFileList([]);
      setPreviewImage('');
    },
  };

  const handleModalClose = () => {
    onClose();
    setFileList([]);
    setPreviewImage('');
    form.resetFields();
  };

  return (
    <>
      <Modal
        title="Tải lên chứng từ thanh toán"
        open={visible}
        onCancel={handleModalClose}
        footer={[
          <Button key="cancel" onClick={handleModalClose}>
            Hủy
          </Button>,
          <Button
            key="upload"
            type="primary"
            loading={uploading}
            onClick={handleUpload}
            disabled={fileList.length === 0}
          >
            Tải lên
          </Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Chứng từ thanh toán"
            extra="Tải lên ảnh chụp màn hình giao dịch hoặc biên lai (JPG, PNG hoặc PDF, tối đa 5MB)"
          >
            <Dragger {...uploadProps}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấp hoặc kéo file vào đây để tải lên</p>
              <p className="ant-upload-hint">
                Hỗ trợ JPG, PNG hoặc PDF. Kích thước tối đa 5MB.
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image Preview Modal */}
      <Image
        style={{ display: 'none' }}
        preview={{
          visible: previewOpen,
          onVisibleChange: (visible) => setPreviewOpen(visible),
          src: previewImage,
        }}
      />
    </>
  );
};

export default UploadPaymentEvidenceModal;
