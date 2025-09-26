# Google Maps Setup Guide

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và enable các API sau:
   - **Maps JavaScript API**
   - **Places API** (tùy chọn)
   - **Geocoding API** (tùy chọn)

## Bước 2: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key được tạo

## Bước 3: Cấu hình trong ứng dụng

1. Tạo file `.env` trong thư mục `StayHub_FE/`
2. Thêm dòng sau vào file `.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

3. Thay `YOUR_API_KEY_HERE` bằng API Key thực tế của bạn

## Bước 4: Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API Key vừa tạo
2. Trong **Application restrictions**, chọn **HTTP referrers**
3. Thêm các domain sau:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Trong **API restrictions**, chọn **Restrict key**
5. Chọn các API đã enable ở bước 1

## Bước 5: Test

1. Restart development server: `npm start`
2. Vào trang chi tiết phòng
3. Click nút "Xem trên bản đồ"
4. Kiểm tra xem bản đồ có hiển thị không

## Troubleshooting

### Lỗi "Google Maps JavaScript API error"
- Kiểm tra API Key có đúng không
- Kiểm tra API đã được enable chưa
- Kiểm tra restrictions có chặn domain không

### Bản đồ không hiển thị
- Kiểm tra console có lỗi gì không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra coordinates có hợp lệ không

## Chi phí

- Google Maps có free tier: $200 credit/tháng
- Với free tier, bạn có thể load khoảng 28,000 map loads
- Xem chi tiết tại [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và enable các API sau:
   - **Maps JavaScript API**
   - **Places API** (tùy chọn)
   - **Geocoding API** (tùy chọn)

## Bước 2: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key được tạo

## Bước 3: Cấu hình trong ứng dụng

1. Tạo file `.env` trong thư mục `StayHub_FE/`
2. Thêm dòng sau vào file `.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

3. Thay `YOUR_API_KEY_HERE` bằng API Key thực tế của bạn

## Bước 4: Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API Key vừa tạo
2. Trong **Application restrictions**, chọn **HTTP referrers**
3. Thêm các domain sau:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Trong **API restrictions**, chọn **Restrict key**
5. Chọn các API đã enable ở bước 1

## Bước 5: Test

1. Restart development server: `npm start`
2. Vào trang chi tiết phòng
3. Click nút "Xem trên bản đồ"
4. Kiểm tra xem bản đồ có hiển thị không

## Troubleshooting

### Lỗi "Google Maps JavaScript API error"
- Kiểm tra API Key có đúng không
- Kiểm tra API đã được enable chưa
- Kiểm tra restrictions có chặn domain không

### Bản đồ không hiển thị
- Kiểm tra console có lỗi gì không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra coordinates có hợp lệ không

## Chi phí

- Google Maps có free tier: $200 credit/tháng
- Với free tier, bạn có thể load khoảng 28,000 map loads
- Xem chi tiết tại [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và enable các API sau:
   - **Maps JavaScript API**
   - **Places API** (tùy chọn)
   - **Geocoding API** (tùy chọn)

## Bước 2: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key được tạo

## Bước 3: Cấu hình trong ứng dụng

1. Tạo file `.env` trong thư mục `StayHub_FE/`
2. Thêm dòng sau vào file `.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

3. Thay `YOUR_API_KEY_HERE` bằng API Key thực tế của bạn

## Bước 4: Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API Key vừa tạo
2. Trong **Application restrictions**, chọn **HTTP referrers**
3. Thêm các domain sau:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Trong **API restrictions**, chọn **Restrict key**
5. Chọn các API đã enable ở bước 1

## Bước 5: Test

1. Restart development server: `npm start`
2. Vào trang chi tiết phòng
3. Click nút "Xem trên bản đồ"
4. Kiểm tra xem bản đồ có hiển thị không

## Troubleshooting

### Lỗi "Google Maps JavaScript API error"
- Kiểm tra API Key có đúng không
- Kiểm tra API đã được enable chưa
- Kiểm tra restrictions có chặn domain không

### Bản đồ không hiển thị
- Kiểm tra console có lỗi gì không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra coordinates có hợp lệ không

## Chi phí

- Google Maps có free tier: $200 credit/tháng
- Với free tier, bạn có thể load khoảng 28,000 map loads
- Xem chi tiết tại [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và enable các API sau:
   - **Maps JavaScript API**
   - **Places API** (tùy chọn)
   - **Geocoding API** (tùy chọn)

## Bước 2: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key được tạo

## Bước 3: Cấu hình trong ứng dụng

1. Tạo file `.env` trong thư mục `StayHub_FE/`
2. Thêm dòng sau vào file `.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

3. Thay `YOUR_API_KEY_HERE` bằng API Key thực tế của bạn

## Bước 4: Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API Key vừa tạo
2. Trong **Application restrictions**, chọn **HTTP referrers**
3. Thêm các domain sau:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Trong **API restrictions**, chọn **Restrict key**
5. Chọn các API đã enable ở bước 1

## Bước 5: Test

1. Restart development server: `npm start`
2. Vào trang chi tiết phòng
3. Click nút "Xem trên bản đồ"
4. Kiểm tra xem bản đồ có hiển thị không

## Troubleshooting

### Lỗi "Google Maps JavaScript API error"
- Kiểm tra API Key có đúng không
- Kiểm tra API đã được enable chưa
- Kiểm tra restrictions có chặn domain không

### Bản đồ không hiển thị
- Kiểm tra console có lỗi gì không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra coordinates có hợp lệ không

## Chi phí

- Google Maps có free tier: $200 credit/tháng
- Với free tier, bạn có thể load khoảng 28,000 map loads
- Xem chi tiết tại [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và enable các API sau:
   - **Maps JavaScript API**
   - **Places API** (tùy chọn)
   - **Geocoding API** (tùy chọn)

## Bước 2: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key được tạo

## Bước 3: Cấu hình trong ứng dụng

1. Tạo file `.env` trong thư mục `StayHub_FE/`
2. Thêm dòng sau vào file `.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

3. Thay `YOUR_API_KEY_HERE` bằng API Key thực tế của bạn

## Bước 4: Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API Key vừa tạo
2. Trong **Application restrictions**, chọn **HTTP referrers**
3. Thêm các domain sau:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Trong **API restrictions**, chọn **Restrict key**
5. Chọn các API đã enable ở bước 1

## Bước 5: Test

1. Restart development server: `npm start`
2. Vào trang chi tiết phòng
3. Click nút "Xem trên bản đồ"
4. Kiểm tra xem bản đồ có hiển thị không

## Troubleshooting

### Lỗi "Google Maps JavaScript API error"
- Kiểm tra API Key có đúng không
- Kiểm tra API đã được enable chưa
- Kiểm tra restrictions có chặn domain không

### Bản đồ không hiển thị
- Kiểm tra console có lỗi gì không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra coordinates có hợp lệ không

## Chi phí

- Google Maps có free tier: $200 credit/tháng
- Với free tier, bạn có thể load khoảng 28,000 map loads
- Xem chi tiết tại [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)

## Bước 1: Lấy Google Maps API Key

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Library**
4. Tìm và enable các API sau:
   - **Maps JavaScript API**
   - **Places API** (tùy chọn)
   - **Geocoding API** (tùy chọn)

## Bước 2: Tạo API Key

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **API Key**
3. Copy API Key được tạo

## Bước 3: Cấu hình trong ứng dụng

1. Tạo file `.env` trong thư mục `StayHub_FE/`
2. Thêm dòng sau vào file `.env`:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

3. Thay `YOUR_API_KEY_HERE` bằng API Key thực tế của bạn

## Bước 4: Restrict API Key (Khuyến nghị)

1. Trong Google Cloud Console, click vào API Key vừa tạo
2. Trong **Application restrictions**, chọn **HTTP referrers**
3. Thêm các domain sau:
   - `localhost:3000/*`
   - `yourdomain.com/*`
4. Trong **API restrictions**, chọn **Restrict key**
5. Chọn các API đã enable ở bước 1

## Bước 5: Test

1. Restart development server: `npm start`
2. Vào trang chi tiết phòng
3. Click nút "Xem trên bản đồ"
4. Kiểm tra xem bản đồ có hiển thị không

## Troubleshooting

### Lỗi "Google Maps JavaScript API error"
- Kiểm tra API Key có đúng không
- Kiểm tra API đã được enable chưa
- Kiểm tra restrictions có chặn domain không

### Bản đồ không hiển thị
- Kiểm tra console có lỗi gì không
- Kiểm tra network tab xem API call có thành công không
- Kiểm tra coordinates có hợp lệ không

## Chi phí

- Google Maps có free tier: $200 credit/tháng
- Với free tier, bạn có thể load khoảng 28,000 map loads
- Xem chi tiết tại [Google Maps Pricing](https://cloud.google.com/maps-platform/pricing)
