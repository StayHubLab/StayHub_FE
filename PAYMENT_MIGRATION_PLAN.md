# 📋 VNPAY to Manual Bank Transfer Migration Plan

## 🎯 Executive Summary

**Current State:** Fake VNPAY payment flow  
**Target State:** Manual bank transfer with payment evidence upload and landlord approval workflow  
**Impact Level:** HIGH - Affects tenant billing, landlord transaction management, and payment status tracking

---

## 📁 Part 1: Files Requiring Modification

### 🔴 **CRITICAL FILES - Require Complete Refactoring**

#### 1. **Frontend API Layer**

##### `src/services/api/billApi.js`
**Current Issue:**
```javascript
getVnpayUrl: async (billId) => {
  const response = await apiClient.get(`/payments/vnpay/create`, {
    params: { billId },
  });
  return response.data;
}
```

**Required Changes:**
- ❌ **DELETE:** `getVnpayUrl()` function
- ✅ **ADD:** New payment evidence functions:
  ```javascript
  uploadPaymentEvidence: async (billId, formData) => {
    const response = await apiClient.post(`/bills/${billId}/evidence`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  getPaymentEvidence: async (billId) => {
    const response = await apiClient.get(`/bills/${billId}/evidence`);
    return response.data;
  },
  
  approvePayment: async (billId, payload) => {
    const response = await apiClient.put(`/bills/${billId}/approve`, payload);
    return response.data;
  },
  
  rejectPayment: async (billId, payload) => {
    const response = await apiClient.put(`/bills/${billId}/reject`, payload);
    return response.data;
  }
  ```

**Integration Points:**
- Used by: `Bills.jsx`, `PaymentsByRoom.jsx`, `Transaction.jsx`
- Dependencies: `apiClient.js` (no changes needed)

---

##### `src/pages/CommonPage/Main/Bill/Bills.jsx`
**Current Issue:** Lines 106-128 contain VNPAY payment button

```javascript
{r.status === "pending" && (
  <Button
    type="primary"
    size="small"
    onClick={async () => {
      try {
        setLoading(true);
        const res = await billApi.getVnpayUrl(r._id || r.id);
        const url = res?.data?.paymentUrl || res?.paymentUrl;
        if (url) {
          window.location.href = url;
        } else {
          message.error("Không tạo được link thanh toán");
        }
      } catch (e) {
        console.error(e);
        message.error("Không thể thanh toán hoá đơn");
      } finally {
        setLoading(false);
      }
    }}
  >
    Thanh toán
  </Button>
)}
```

**Required Changes:**
- ❌ **DELETE:** VNPAY payment button logic (lines 106-128)
- ✅ **ADD:** Upload evidence modal + button:
  ```javascript
  // New state
  const [evidenceModal, setEvidenceModal] = useState({ visible: false, billId: null });
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  
  // New button
  {r.status === "pending" && (
    <Button
      type="primary"
      icon={<UploadOutlined />}
      size="small"
      onClick={() => setEvidenceModal({ visible: true, billId: r._id || r.id })}
    >
      Tải lên chứng từ
    </Button>
  )}
  
  // Evidence status display
  {r.paymentEvidence && (
    <Tag color={r.paymentEvidence.status === 'approved' ? 'green' : 
                 r.paymentEvidence.status === 'rejected' ? 'red' : 'orange'}>
      {r.paymentEvidence.status === 'approved' ? 'Đã duyệt' : 
       r.paymentEvidence.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
    </Tag>
  )}
  ```

**New Modal Component:**
```javascript
const EvidenceUploadModal = ({ visible, billId, onClose, onSuccess }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn file chứng từ');
      return;
    }

    const formData = new FormData();
    formData.append('evidence', fileList[0]);
    formData.append('note', form.getFieldValue('note') || '');

    try {
      setUploading(true);
      await billApi.uploadPaymentEvidence(billId, formData);
      message.success('Tải lên chứng từ thanh toán thành công!');
      onSuccess();
      onClose();
    } catch (error) {
      message.error('Tải lên thất bại: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="Tải lên chứng từ thanh toán"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Hủy</Button>,
        <Button key="submit" type="primary" loading={uploading} onClick={handleUpload}>
          Tải lên
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="File chứng từ (Ảnh hoặc PDF)">
          <Upload
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              const isPDF = file.type === 'application/pdf';
              if (!isImage && !isPDF) {
                message.error('Chỉ chấp nhận file ảnh hoặc PDF!');
                return false;
              }
              const isLt5M = file.size / 1024 / 1024 < 5;
              if (!isLt5M) {
                message.error('File phải nhỏ hơn 5MB!');
                return false;
              }
              setFileList([file]);
              return false;
            }}
            fileList={fileList}
            onRemove={() => setFileList([])}
          >
            <Button icon={<UploadOutlined />}>Chọn file</Button>
          </Upload>
        </Form.Item>
        <Form.Item name="note" label="Ghi chú (tùy chọn)">
          <TextArea rows={3} placeholder="Nhập ghi chú về giao dịch..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

**Impact:** HIGH - This is the primary tenant-facing payment interface

---

#### 2. **Landlord Management Interface**

##### `src/pages/LandlordPage/PaymentsByRoom/PaymentsByRoom.jsx`
**Current State:** 634 lines - Displays bills by room, allows bill creation

**Required Changes:**
- ✅ **ADD:** Payment evidence review column in table:
  ```javascript
  {
    title: "Chứng từ",
    key: "evidence",
    render: (_, record) => {
      if (!record.paymentEvidence) {
        return <Tag>Chưa có</Tag>;
      }
      return (
        <Space direction="vertical" size="small">
          <Tag color={
            record.paymentEvidence.status === 'approved' ? 'green' :
            record.paymentEvidence.status === 'rejected' ? 'red' : 'orange'
          }>
            {record.paymentEvidence.status === 'approved' ? 'Đã duyệt' :
             record.paymentEvidence.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
          </Tag>
          <Button 
            size="small" 
            type="link"
            onClick={() => handleViewEvidence(record)}
          >
            Xem chứng từ
          </Button>
        </Space>
      );
    }
  }
  ```

- ✅ **ADD:** Evidence review modal:
  ```javascript
  const [evidenceReviewModal, setEvidenceReviewModal] = useState({
    visible: false,
    bill: null
  });

  const EvidenceReviewModal = ({ visible, bill, onClose, onUpdate }) => {
    const [rejecting, setRejecting] = useState(false);
    const [approving, setApproving] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleApprove = async () => {
      try {
        setApproving(true);
        await billApi.approvePayment(bill._id, {
          note: 'Chứng từ hợp lệ'
        });
        message.success('Đã duyệt thanh toán!');
        onUpdate();
        onClose();
      } catch (error) {
        message.error('Duyệt thất bại: ' + error.message);
      } finally {
        setApproving(false);
      }
    };

    const handleReject = async () => {
      if (!rejectReason.trim()) {
        message.error('Vui lòng nhập lý do từ chối');
        return;
      }
      try {
        setRejecting(true);
        await billApi.rejectPayment(bill._id, {
          reason: rejectReason
        });
        message.success('Đã từ chối thanh toán!');
        onUpdate();
        onClose();
      } catch (error) {
        message.error('Từ chối thất bại: ' + error.message);
      } finally {
        setRejecting(false);
      }
    };

    return (
      <Modal
        title="Xem xét chứng từ thanh toán"
        open={visible}
        onCancel={onClose}
        width={800}
        footer={bill?.paymentEvidence?.status === 'pending' ? [
          <Button key="reject" danger loading={rejecting} onClick={handleReject}>
            Từ chối
          </Button>,
          <Button key="approve" type="primary" loading={approving} onClick={handleApprove}>
            Duyệt thanh toán
          </Button>
        ] : null}
      >
        {bill && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Mã hóa đơn">
                {bill.code || bill._id?.slice(-6)}
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền">
                {bill.totalAmount?.toLocaleString()} VNĐ
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={bill.paymentEvidence?.status === 'approved' ? 'green' : 
                            bill.paymentEvidence?.status === 'rejected' ? 'red' : 'orange'}>
                  {bill.paymentEvidence?.status === 'approved' ? 'Đã duyệt' :
                   bill.paymentEvidence?.status === 'rejected' ? 'Đã từ chối' : 'Chờ duyệt'}
                </Tag>
              </Descriptions.Item>
              {bill.paymentEvidence?.note && (
                <Descriptions.Item label="Ghi chú của người thuê">
                  {bill.paymentEvidence.note}
                </Descriptions.Item>
              )}
              {bill.paymentEvidence?.rejectionReason && (
                <Descriptions.Item label="Lý do từ chối">
                  <Text type="danger">{bill.paymentEvidence.rejectionReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <div>
              <Title level={5}>Chứng từ thanh toán:</Title>
              {bill.paymentEvidence?.fileUrl && (
                bill.paymentEvidence.fileUrl.endsWith('.pdf') ? (
                  <iframe 
                    src={bill.paymentEvidence.fileUrl} 
                    style={{ width: '100%', height: 500 }}
                    title="Payment Evidence"
                  />
                ) : (
                  <Image 
                    src={bill.paymentEvidence.fileUrl} 
                    alt="Payment Evidence"
                    style={{ maxWidth: '100%' }}
                  />
                )
              )}
            </div>

            {bill.paymentEvidence?.status === 'pending' && (
              <div>
                <Title level={5}>Lý do từ chối (nếu từ chối):</Title>
                <TextArea 
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối thanh toán..."
                />
              </div>
            )}
          </Space>
        )}
      </Modal>
    );
  };
  ```

**Impact:** HIGH - Critical for landlord payment management

---

##### `src/pages/LandlordPage/Transaction/Transaction.jsx`
**Current State:** Displays transaction history for landlord

**Required Changes:**
- ✅ **ADD:** Evidence status column:
  ```javascript
  {
    title: "Chứng từ",
    key: "evidence",
    render: (_, record) => {
      if (record.status !== 'paid') return '-';
      if (!record.paymentEvidence) {
        return <Tag color="default">Chuyển khoản trực tiếp</Tag>;
      }
      return (
        <Space direction="vertical" size={0}>
          <Tag color={
            record.paymentEvidence.status === 'approved' ? 'green' :
            record.paymentEvidence.status === 'rejected' ? 'red' : 'orange'
          }>
            {record.paymentEvidence.status === 'approved' ? 'Đã duyệt' :
             record.paymentEvidence.status === 'rejected' ? 'Từ chối' : 'Chờ duyệt'}
          </Tag>
          {record.paymentEvidence.uploadedAt && (
            <Text type="secondary" style={{ fontSize: 11 }}>
              {new Date(record.paymentEvidence.uploadedAt).toLocaleDateString('vi-VN')}
            </Text>
          )}
        </Space>
      );
    }
  }
  ```

**Impact:** MEDIUM - Improves transparency for landlords

---

### 🟡 **MEDIUM PRIORITY FILES**

#### 3. **Environment Configuration**

##### `.env.example`
**Current Issue:** Lines 29-30
```
REACT_APP_VNPAY_URL=
REACT_APP_VNPAY_RETURN_URL=
```

**Required Changes:**
- ❌ **DELETE:** VNPAY-related environment variables
- ✅ **ADD:** Bank transfer configuration:
  ```bash
  # Bank Transfer Configuration
  REACT_APP_BANK_NAME="Vietcombank"
  REACT_APP_BANK_ACCOUNT_NUMBER="1234567890"
  REACT_APP_BANK_ACCOUNT_NAME="STAYHUB RENTAL SERVICES"
  REACT_APP_MAX_EVIDENCE_FILE_SIZE=5242880  # 5MB in bytes
  ```

**Impact:** LOW - Configuration only

---

### 🟢 **LOW PRIORITY / OPTIONAL**

#### 4. **Booking API** (for future deposit payments)

##### `src/services/api/bookingApi.js`
**Current State:** No payment integration

**Recommended Addition:**
```javascript
// Add deposit evidence upload for bookings
uploadDepositEvidence: async (bookingId, formData) => {
  const response = await apiClient.post(`/bookings/${bookingId}/deposit-evidence`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
}
```

**Impact:** LOW - Future enhancement

---

## 🔄 Part 2: New Data Flow Architecture

### **Current Flow (VNPAY)**
```
1. Tenant clicks "Thanh toán" → 
2. Frontend calls billApi.getVnpayUrl(billId) →
3. Backend generates fake VNPAY URL →
4. Redirect to VNPAY simulation →
5. Redirect back with payment status →
6. Update bill.status = 'paid'
```

### **New Flow (Manual Bank Transfer)**

#### **Phase 1: Tenant Upload Evidence**
```
1. Tenant clicks "Tải lên chứng từ" →
2. Tenant uploads image/PDF + optional note →
3. Frontend: billApi.uploadPaymentEvidence(billId, formData) →
4. Backend: 
   - Upload file to cloud storage (AWS S3 / Cloudinary)
   - Create paymentEvidence object in bill:
     {
       fileUrl: "https://...",
       fileType: "image/png",
       uploadedAt: Date,
       uploadedBy: userId,
       status: "pending",
       note: "Transfer at 14:30 today"
     }
   - Update bill.status = 'pending_approval'
5. Send notification to landlord
```

#### **Phase 2: Landlord Review**
```
1. Landlord views "PaymentsByRoom" or "Transaction" →
2. Sees bills with status "pending_approval" →
3. Clicks "Xem chứng từ" →
4. Reviews evidence (image/PDF viewer) →
5A. APPROVE PATH:
    - Landlord clicks "Duyệt thanh toán"
    - Frontend: billApi.approvePayment(billId, { note })
    - Backend: 
      * Update paymentEvidence.status = 'approved'
      * Update paymentEvidence.approvedBy = landlordId
      * Update paymentEvidence.approvedAt = Date
      * Update bill.status = 'paid'
      * Update bill.paidAt = Date
    - Send confirmation notification to tenant
    
5B. REJECT PATH:
    - Landlord enters rejection reason
    - Landlord clicks "Từ chối"
    - Frontend: billApi.rejectPayment(billId, { reason })
    - Backend:
      * Update paymentEvidence.status = 'rejected'
      * Update paymentEvidence.rejectionReason = reason
      * Update paymentEvidence.rejectedAt = Date
      * Keep bill.status = 'pending' (tenant can re-upload)
    - Send rejection notification to tenant
```

#### **Phase 3: Re-upload (if rejected)**
```
1. Tenant sees rejection reason in Bills page →
2. Can upload new evidence →
3. Process repeats from Phase 1
```

---

## 🌐 Part 3: Required Backend API Endpoints

### **New Endpoints to Create**

#### 1. Upload Payment Evidence
```javascript
POST /api/bills/:billId/evidence
Headers: Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- evidence: File (image/pdf)
- note: String (optional)

Response:
{
  success: true,
  message: "Payment evidence uploaded successfully",
  data: {
    billId: "...",
    paymentEvidence: {
      fileUrl: "https://cloudinary.com/...",
      fileType: "image/jpeg",
      uploadedAt: "2025-10-05T10:30:00Z",
      uploadedBy: "userId",
      status: "pending",
      note: "Transferred via mobile banking"
    }
  }
}
```

#### 2. Get Payment Evidence
```javascript
GET /api/bills/:billId/evidence
Headers: Authorization: Bearer <token>

Response:
{
  success: true,
  data: {
    fileUrl: "https://...",
    fileType: "image/jpeg",
    status: "pending",
    uploadedAt: "...",
    note: "...",
    rejectionReason: null
  }
}
```

#### 3. Approve Payment
```javascript
PUT /api/bills/:billId/approve
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  note: "Evidence verified - payment received"
}

Response:
{
  success: true,
  message: "Payment approved successfully",
  data: {
    billId: "...",
    status: "paid",
    paidAt: "2025-10-05T11:00:00Z",
    paymentEvidence: {
      status: "approved",
      approvedBy: "landlordId",
      approvedAt: "2025-10-05T11:00:00Z"
    }
  }
}
```

#### 4. Reject Payment
```javascript
PUT /api/bills/:billId/reject
Headers: Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  reason: "Bank transfer reference number does not match"
}

Response:
{
  success: true,
  message: "Payment evidence rejected",
  data: {
    billId: "...",
    status: "pending",
    paymentEvidence: {
      status: "rejected",
      rejectionReason: "Bank transfer reference number does not match",
      rejectedAt: "2025-10-05T11:00:00Z"
    }
  }
}
```

---

## 📊 Part 4: Database Schema Changes

### **Bill Model Enhancement**

```javascript
const billSchema = new mongoose.Schema({
  // ... existing fields ...
  
  // NEW FIELDS
  paymentEvidence: {
    fileUrl: { type: String },
    fileType: { type: String }, // 'image/png', 'application/pdf', etc.
    uploadedAt: { type: Date },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    note: { type: String }, // Tenant's note
    
    // Approval/Rejection details
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
    rejectedAt: { type: Date },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  
  // Update status enum to include new state
  status: {
    type: String,
    enum: ['pending', 'pending_approval', 'paid', 'overdue', 'failed'],
    default: 'pending'
  }
});
```

### **Status Transitions**

```
pending → pending_approval (after evidence upload)
pending_approval → paid (after landlord approval)
pending_approval → pending (after landlord rejection, can re-upload)
pending → overdue (if dueDate passed without evidence)
```

---

## 🎨 Part 5: UI/UX Components to Create

### **1. Payment Evidence Upload Modal** (Tenant Side)
- **Location:** `src/components/PaymentEvidenceModal/`
- **Features:**
  - File upload (drag-drop support)
  - Image preview
  - PDF preview
  - Note textarea
  - File size validation (max 5MB)
  - File type validation (image/* or application/pdf)
  - Upload progress indicator

### **2. Evidence Review Modal** (Landlord Side)
- **Location:** `src/components/EvidenceReviewModal/`
- **Features:**
  - Full-size image viewer
  - PDF viewer (iframe or pdf.js)
  - Bill details summary
  - Approve button
  - Reject button with reason input
  - Timeline of uploads/reviews

### **3. Payment Status Badge Component**
- **Location:** `src/components/PaymentStatusBadge/`
- **Statuses:**
  - `pending` → Yellow/Orange "Chờ thanh toán"
  - `pending_approval` → Blue "Chờ duyệt"
  - `paid` → Green "Đã thanh toán"
  - `rejected` → Red "Bị từ chối"
  - `overdue` → Dark Red "Quá hạn"

### **4. Bank Info Display Component**
- **Location:** `src/components/BankInfoCard/`
- **Display:**
  - Bank name
  - Account number (with copy button)
  - Account holder name
  - QR code (optional - for mobile banking apps)

---

## ✅ Part 6: Implementation Checklist

### **Phase 1: Backend Foundation** (Week 1)
- [ ] Create payment evidence upload endpoint
- [ ] Integrate file storage (AWS S3 / Cloudinary)
- [ ] Add paymentEvidence field to Bill schema
- [ ] Create approve/reject endpoints
- [ ] Add notification system for evidence upload/approval
- [ ] Write unit tests for new endpoints

### **Phase 2: Frontend Components** (Week 2)
- [ ] Create `PaymentEvidenceModal` component
- [ ] Create `EvidenceReviewModal` component
- [ ] Create `PaymentStatusBadge` component
- [ ] Create `BankInfoCard` component
- [ ] Add new billApi functions
- [ ] Update Bills.jsx with evidence upload
- [ ] Update PaymentsByRoom.jsx with review functionality
- [ ] Update Transaction.jsx with evidence status

### **Phase 3: Integration & Testing** (Week 3)
- [ ] Integration testing: tenant upload flow
- [ ] Integration testing: landlord review flow
- [ ] Integration testing: rejection and re-upload flow
- [ ] UI/UX testing on mobile devices
- [ ] Performance testing with large files
- [ ] Security testing (file type validation, user permissions)

### **Phase 4: Migration & Deployment** (Week 4)
- [ ] Remove VNPAY code from frontend
- [ ] Remove VNPAY env variables
- [ ] Update documentation
- [ ] Train landlords on new approval workflow
- [ ] Send notification to tenants about new payment method
- [ ] Deploy to staging
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor error rates and user feedback

---

## ⚠️ Part 7: Risks & Mitigation

### **Risk 1: File Storage Costs**
**Mitigation:** 
- Implement file size limits (5MB)
- Set automatic deletion of rejected evidences after 90 days
- Use image compression before upload

### **Risk 2: Landlord Delays in Approval**
**Mitigation:**
- Send daily reminder notifications for pending approvals
- Auto-approve after 7 days (configurable)
- Add "urgent" flag for bills near due date

### **Risk 3: Fraud/Fake Evidence**
**Mitigation:**
- Require high-resolution images
- Add watermark with upload timestamp
- Allow landlords to request additional evidence
- Implement AI-based receipt verification (future)

### **Risk 4: User Confusion**
**Mitigation:**
- Create detailed tutorial videos
- Add in-app tooltips and help text
- Provide bank transfer instructions in modal
- Create FAQ section

---

## 🎯 Part 8: Success Metrics

### **KPIs to Track**
1. **Evidence Upload Rate:** % of pending bills with uploaded evidence
2. **Approval Time:** Average time from upload to approval/rejection
3. **Rejection Rate:** % of evidences rejected (target <10%)
4. **Re-upload Rate:** % of tenants who re-upload after rejection
5. **Payment Completion Rate:** % of bills paid within due date
6. **User Satisfaction:** NPS score for new payment flow

---

## 📞 Part 9: Support & Documentation

### **User Guides to Create**
1. **Tenant Guide:** "How to Upload Payment Evidence"
2. **Landlord Guide:** "How to Review Payment Evidence"
3. **Troubleshooting Guide:** Common issues and solutions
4. **FAQ:** Frequently asked questions

### **Technical Documentation**
1. API documentation for new endpoints
2. Database schema changes
3. File storage configuration
4. Deployment guide
5. Rollback procedure

---

## 🚀 Conclusion

This migration plan completely removes VNPAY dependency and replaces it with a robust manual bank transfer workflow. The new system provides:

✅ **Better Control:** Landlords verify each payment manually  
✅ **Transparency:** Complete audit trail of all evidence uploads  
✅ **Flexibility:** Tenants can re-upload if rejected  
✅ **Security:** File validation and user permission checks  
✅ **Scalability:** Cloud storage integration supports growth  

**Estimated Development Time:** 3-4 weeks  
**Estimated Testing Time:** 1 week  
**Total Project Duration:** 4-5 weeks  

---

*Document Version: 1.0*  
*Last Updated: October 5, 2025*  
*Prepared by: GitHub Copilot - Full-Stack Code Reviewer*
