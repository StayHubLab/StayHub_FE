# 🔗 Quick Integration Guide - Add Payment Approvals to Landlord Menu

## Option 1: Add to LandlordMenu.jsx

Update `src/pages/LandlordPage/LandlordMenu/LandlordMenu.jsx`:

```jsx
import {
  // ... existing imports
  CheckCircleOutlined, // Add this icon import
} from '@ant-design/icons';

// In the menuItems array, add:
{
  id: "payment-approvals",
  label: "Duyệt thanh toán",
  icon: <CheckCircleOutlined />,
  description: "Xem và duyệt chứng từ thanh toán",
  route: "/landlord/payment-approvals",
},
```

---

## Option 2: Direct Navigation

Tenants and landlords can access directly via URLs:

### **Tenant (Renter)**
```
/bills  (already exists - Bills.jsx)
```

### **Landlord**
```
/landlord/payment-approvals
```

---

## Testing URLs

After starting the app with `npm start`:

1. **Tenant Payment Management:**
   ```
   http://localhost:3000/bills
   ```

2. **Landlord Approval Dashboard:**
   ```
   http://localhost:3000/landlord/payment-approvals
   ```

---

## Menu Icon Recommendations

Use these Ant Design icons:

- `CheckCircleOutlined` - For "Duyệt thanh toán"
- `DollarOutlined` - For "Quản lý thanh toán"
- `FileProtectOutlined` - For "Chứng từ thanh toán"
- `AuditOutlined` - For "Kiểm tra thanh toán"

---

## Complete Menu Item Example

```jsx
const menuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    route: "/landlord/dashboard",
  },
  {
    id: "payment-approvals",
    label: "Duyệt thanh toán",
    icon: <CheckCircleOutlined />,
    description: "Xem và duyệt chứng từ thanh toán của người thuê",
    route: "/landlord/payment-approvals",
    badge: pendingCount, // Optional: show pending count
  },
  {
    id: "payments-by-room",
    label: "Thanh toán theo phòng",
    icon: <DollarOutlined />,
    route: "/landlord/payments-by-room",
  },
  // ... other menu items
];
```

---

## With Badge Count (Optional)

To show pending approval count:

```jsx
import { Badge } from 'antd';
import billApi from 'services/api/billApi';

const [pendingCount, setPendingCount] = useState(0);

useEffect(() => {
  const fetchPendingCount = async () => {
    try {
      const result = await billApi.getPaymentsByStatus('pending_approval');
      setPendingCount(result.data?.length || 0);
    } catch (error) {
      console.error('Failed to fetch pending count', error);
    }
  };
  
  fetchPendingCount();
  // Refresh every 30 seconds
  const interval = setInterval(fetchPendingCount, 30000);
  return () => clearInterval(interval);
}, []);

// In menu item:
<Badge count={pendingCount} offset={[10, 0]}>
  <CheckCircleOutlined /> Duyệt thanh toán
</Badge>
```

---

## Navigation Example

In any component, navigate programmatically:

```jsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();

// Navigate to approval dashboard
navigate('/landlord/payment-approvals');
```

---

## Breadcrumb Configuration (Optional)

Add breadcrumb for better navigation:

```jsx
<Breadcrumb>
  <Breadcrumb.Item>
    <HomeOutlined />
  </Breadcrumb.Item>
  <Breadcrumb.Item>
    <Link to="/landlord/dashboard">Dashboard</Link>
  </Breadcrumb.Item>
  <Breadcrumb.Item>Duyệt thanh toán</Breadcrumb.Item>
</Breadcrumb>
```

---

## Quick Test

1. Start app: `npm start`
2. Login as landlord
3. Navigate to: `/landlord/payment-approvals`
4. Should see: Payment Approval Dashboard with tabs
5. Login as tenant in another browser
6. Navigate to: `/bills`
7. Upload evidence
8. Check landlord dashboard → Should see pending approval

---

**Done! The integration is complete.** ✅
