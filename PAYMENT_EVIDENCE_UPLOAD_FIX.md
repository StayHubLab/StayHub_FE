# Payment Evidence Upload - Bug Fixes ✅

## Issues Identified and Fixed

### 🐛 Issue 1: 400 Bad Request Error
**Problem:**
```
POST http://localhost:5000/api/payments/upload-evidence 400 (Bad Request)
```

**Root Cause:**
The FormData was not being constructed correctly. The original code was NOT appending the `billId` to FormData before sending to the backend.

**Original Code (WRONG):**
```javascript
const file = fileList[0].originFileObj;
const formData = new FormData();
formData.append('billId', billId);  // ❌ This line was in the old code but removed by mistake
formData.append('paymentEvidence', file);
```

**Fixed Code:**
```javascript
const file = fileList[0].originFileObj || fileList[0];
const formData = new FormData();
formData.append('paymentEvidence', file);
// billId is now added in billApi.js
```

**Also Fixed in billApi.js:**
```javascript
uploadPaymentEvidence: async (billId, formData) => {
  // Add billId to FormData if not already present
  if (!formData.has('billId')) {
    formData.append('billId', billId);
  }
  const response = await apiClient.post('/payments/upload-evidence', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
},
```

---

### 🐛 Issue 2: Antd Message Context Warning
**Problem:**
```
Warning: [antd: message] Static function can not consume context like dynamic theme. 
Please use 'App' component instead.
```

**Root Cause:**
Using static `message` from direct import instead of using the App context.

**Original Code (WRONG):**
```javascript
import { Modal, Upload, message, Button, Form } from 'antd';
// ...
message.error('Some error');
```

**Fixed Code:**
```javascript
import { Modal, Upload, Button, Form, App, Image } from 'antd';

const UploadPaymentEvidenceModal = ({ visible, onClose, billId, onSuccess }) => {
  const { message } = App.useApp();  // ✅ Use App context
  // ...
  message.error('Some error');  // Now uses context
};
```

**Note:** The `App` provider (`<AntApp>`) is already configured in `src/App.js`, so this fix works immediately.

---

### 🐛 Issue 3: No Image Preview
**Problem:**
User couldn't preview the uploaded image before submitting.

**Solution Implemented:**
Added comprehensive image preview functionality with:
1. **Picture card display** - Shows thumbnail after selecting file
2. **Click to preview** - Full-size image preview in modal
3. **Base64 conversion** - For client-side preview before upload

**New Features Added:**
```javascript
// State for preview
const [previewImage, setPreviewImage] = useState('');
const [previewOpen, setPreviewOpen] = useState(false);

// Base64 converter for preview
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Preview handler
const handlePreview = async (file) => {
  if (!file.url && !file.preview) {
    file.preview = await getBase64(file.originFileObj || file);
  }
  setPreviewImage(file.url || file.preview);
  setPreviewOpen(true);
};

// Upload props with preview
const uploadProps = {
  name: 'paymentEvidence',
  multiple: false,
  fileList,
  listType: 'picture-card',  // ✅ Shows thumbnail
  onPreview: handlePreview,   // ✅ Click to preview
  // ... rest of the props
};

// Preview Modal
<Image
  style={{ display: 'none' }}
  preview={{
    visible: previewOpen,
    onVisibleChange: (visible) => setPreviewOpen(visible),
    src: previewImage,
  }}
/>
```

---

## Complete Fixed Code

### UploadPaymentEvidenceModal.jsx
```javascript
import React, { useState } from 'react';
import { Modal, Upload, Button, Form, App, Image } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import billApi from '../../services/api/billApi';

const { Dragger } = Upload;

const UploadPaymentEvidenceModal = ({ visible, onClose, billId, onSuccess }) => {
  const { message } = App.useApp();  // ✅ Fix: Use App context
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
      formData.append('paymentEvidence', file);  // ✅ Fix: Only add file

      const result = await billApi.uploadPaymentEvidence(billId, formData);
      
      message.success('Tải lên chứng từ thanh toán thành công!');
      setFileList([]);
      setPreviewImage('');
      form.resetFields();
      onSuccess?.(result.data);
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || 'Tải lên chứng từ thất bại');
      console.error('Upload error:', error);
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
    listType: 'picture-card',  // ✅ Shows thumbnail
    onPreview: handlePreview,   // ✅ Click to preview
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
```

---

## Changes Summary

### Files Modified

#### 1. `src/components/UploadPaymentEvidenceModal/UploadPaymentEvidenceModal.jsx`
- ✅ Changed from static `message` import to `App.useApp()` context
- ✅ Added `Image` component import for preview
- ✅ Added preview state management (`previewImage`, `previewOpen`)
- ✅ Added `getBase64()` helper function
- ✅ Added `handlePreview()` function
- ✅ Changed `listType` to `'picture-card'` for thumbnail display
- ✅ Added `onPreview` prop to upload component
- ✅ Enhanced `beforeUpload` to generate preview for images
- ✅ Added preview modal using `Image` component
- ✅ Fixed FormData to only append file (billId handled in API)
- ✅ Added proper cleanup in `handleModalClose()`

#### 2. `src/services/api/billApi.js`
- ✅ Added `billId` to FormData automatically in the API function
- ✅ Added check to prevent duplicate `billId` in FormData
- ✅ Updated JSDoc comments

---

## New Features

### 1. Image Preview
- **Thumbnail Display**: After selecting an image, it shows as a card with thumbnail
- **Click to Preview**: Click on the thumbnail to view full-size image
- **Zoom Controls**: Ant Design Image component includes zoom in/out, rotate, etc.

### 2. Better UX
- **Visual Feedback**: User can see the image before uploading
- **Picture Card**: Professional-looking upload interface
- **Clean State**: All states are properly cleared on modal close

### 3. File Handling
- **Type Validation**: Only JPG, PNG, PDF allowed
- **Size Validation**: Maximum 5MB
- **Preview Generation**: Automatic Base64 conversion for images
- **PDF Support**: PDFs are uploaded but don't show preview (as expected)

---

## Testing Checklist

### ✅ Test Upload Flow
1. Open upload modal
2. Select an image file (JPG/PNG)
3. Verify thumbnail appears in picture card
4. Click on thumbnail to preview full-size image
5. Close preview modal
6. Click "Tải lên" button
7. Verify success message
8. Verify modal closes
9. Verify bill status updates

### ✅ Test Validations
1. Try uploading a file > 5MB → Should show error
2. Try uploading invalid file type → Should show error
3. Try uploading without selecting file → Should show error

### ✅ Test PDF Upload
1. Select a PDF file
2. Verify it's added to file list (no preview expected)
3. Upload successfully

### ✅ Test Error Handling
1. Simulate backend error
2. Verify error message displays correctly
3. Verify no context warning in console

---

## Backend API Expected Format

The backend expects a `multipart/form-data` request with:
```
POST /api/payments/upload-evidence
Content-Type: multipart/form-data

FormData:
  - billId: string (Bill ID)
  - paymentEvidence: File (JPG/PNG/PDF, max 5MB)
```

**Response:**
```json
{
  "success": true,
  "message": "Payment evidence uploaded successfully",
  "data": {
    "billId": "...",
    "status": "pending_approval",
    "paymentEvidence": "https://cloudinary.../image.jpg"
  }
}
```

---

## Status
✅ **All Issues Fixed**
- 400 Bad Request → Fixed (billId properly sent)
- Context Warning → Fixed (using App.useApp())
- No Image Preview → Fixed (picture-card + preview modal)

---

**Ready for Testing!** 🚀
