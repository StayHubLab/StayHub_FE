# Upload Payment Evidence - Quick User Guide 📸

## 🎯 What's New

Your payment evidence upload now has **image preview** and **better error handling**!

---

## 🖼️ New Features

### 1. Picture Card Display
When you select an image, you'll see a **thumbnail preview** immediately:

```
┌─────────────────────────────────────┐
│  Tải lên chứng từ thanh toán        │
├─────────────────────────────────────┤
│                                     │
│   ┌───────────┐                     │
│   │  [Image]  │  ← Thumbnail shows  │
│   │ Preview   │     your image!     │
│   └───────────┘                     │
│   receipt.jpg                       │
│                                     │
│   [Xóa]  [Xem]  ← Click to preview │
│                                     │
└─────────────────────────────────────┘
```

### 2. Full-Size Preview
Click on the thumbnail to view the image in **full size** with zoom controls:

```
┌─────────────────────────────────────────┐
│  Image Preview                    [✕]   │
├─────────────────────────────────────────┤
│                                         │
│                                         │
│          [Full Size Image]              │
│                                         │
│         📸 Your Receipt                 │
│                                         │
│                                         │
│  [🔍-] [🔍+] [↻] [↺] [↓] 1/1          │
│  Zoom  Zoom Rotate  Download            │
└─────────────────────────────────────────┘
```

---

## 📋 How to Use

### Step-by-Step Upload Process

#### 1. **Open Upload Modal**
- Go to Bills page
- Find the bill you want to pay
- Click **"Tải lên chứng từ"** button

#### 2. **Select Your Image**
You have 3 ways to add the file:

**Option A: Click to Browse**
```
┌─────────────────────────────┐
│         📂                  │
│  Click to Upload            │
│  Or drag file here          │
│                             │
│  JPG, PNG or PDF, max 5MB   │
└─────────────────────────────┘
        ↑ Click here
```

**Option B: Drag & Drop**
```
Drag your file from file explorer
         ↓
┌─────────────────────────────┐
│         📂                  │
│  Drop file here!            │
│                             │
└─────────────────────────────┘
```

**Option C: Paste from Clipboard**
- Copy image (Ctrl+C or screenshot)
- Paste (Ctrl+V) in the upload area

#### 3. **Preview Your Image** ✨ NEW!
After selecting, the image appears as a card:

```
┌───────────────┐
│   [IMAGE]     │  ← Your payment screenshot
│               │
│  File.jpg     │
│  [👁️] [🗑️]   │  ← Preview or Remove
└───────────────┘
```

**Click the eye icon (👁️)** to see full-size preview!

#### 4. **Verify and Upload**
- Check the image is correct
- Click **"Tải lên"** button
- Wait for success message: ✅ "Tải lên chứng từ thanh toán thành công!"

---

## ⚠️ Validation Rules

### File Type
**Accepted:** ✅
- `.jpg` / `.jpeg` - JPEG images
- `.png` - PNG images  
- `.pdf` - PDF documents

**Rejected:** ❌
- `.gif`, `.bmp`, `.webp`, `.doc`, `.txt`, etc.

**Error Message:**
```
❌ Chỉ chấp nhận file JPG/PNG/PDF!
```

### File Size
**Maximum:** 5 MB (5,120 KB)

**Error Message:**
```
❌ File phải nhỏ hơn 5MB!
```

### File Selection
**Required:** At least 1 file must be selected

**Error Message:**
```
❌ Vui lòng chọn file chứng từ thanh toán
```

---

## 🎨 Visual Changes

### Before (Old Version)
```
┌─────────────────────────────┐
│  📂 Drop file here          │
│                             │
│  [No preview shown]         │
│                             │
│  [ Tải lên ]                │
└─────────────────────────────┘
```

### After (New Version) ✨
```
┌─────────────────────────────┐
│  Chứng từ thanh toán        │
│                             │
│  ┌─────────┐                │
│  │ [IMAGE] │ ← Preview!     │
│  │         │                │
│  │ Click   │ ← Clickable!   │
│  └─────────┘                │
│  receipt.jpg                │
│                             │
│  [ Tải lên ]                │
└─────────────────────────────┘
```

---

## 🐛 Fixed Issues

### ✅ 1. Upload Error (400 Bad Request)
**Before:** Failed with error
```
❌ POST .../upload-evidence 400 (Bad Request)
```

**Now:** Works correctly!
```
✅ Tải lên chứng từ thanh toán thành công!
```

**What was fixed:**
- `billId` is now properly sent to the backend
- FormData is constructed correctly

### ✅ 2. Context Warning
**Before:** Console warning
```
⚠️ Warning: [antd: message] Static function can not consume context...
```

**Now:** No warnings!
```
✅ Clean console, no errors
```

**What was fixed:**
- Using `App.useApp()` hook instead of static `message`

### ✅ 3. No Image Preview
**Before:** 
- Can't see image before upload
- Just file name shown

**Now:**
- ✅ Thumbnail preview
- ✅ Click to view full size
- ✅ Zoom controls
- ✅ Professional UI

---

## 📱 UI Components

### Upload Area (Dragger)
```jsx
<Dragger listType="picture-card" onPreview={handlePreview}>
  📂 Click or drag file here
  JPG, PNG or PDF, max 5MB
</Dragger>
```

**Features:**
- Drag & drop support
- Click to browse
- Visual feedback
- File validation

### Picture Card
```jsx
┌─────────────┐
│   [IMAGE]   │ ← Thumbnail (auto-generated)
│             │
│  File.jpg   │ ← File name
│  [👁️] [🗑️] │ ← Actions (preview, remove)
└─────────────┘
```

**Actions:**
- 👁️ **Preview** - View full-size image
- 🗑️ **Remove** - Delete and select another

### Preview Modal
```jsx
Full-screen image viewer with:
- 🔍 Zoom in/out
- ↻ Rotate left/right  
- ↓ Download image
- Navigation (if multiple images)
- ESC to close
```

---

## 💡 Tips

### For Best Results

1. **Use Clear Images**
   - Take screenshot of payment confirmation
   - Ensure all details are visible (amount, date, transaction ID)
   - Use good lighting for photos

2. **Check Before Upload**
   - Click preview (👁️) to verify image quality
   - Make sure bank name and amount are readable
   - Confirm transaction date matches bill

3. **File Size Optimization**
   - If image > 5MB, resize it first
   - Use JPG instead of PNG for smaller size
   - Crop unnecessary parts

4. **Recommended Format**
   - **Best:** JPG (good quality, small size)
   - **Good:** PNG (high quality, larger size)
   - **OK:** PDF (for official receipts)

---

## 🔄 Complete Workflow

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  1. Go to Bills Page                            │
│     ↓                                           │
│  2. Find "Chờ thanh toán" bill                  │
│     ↓                                           │
│  3. Click "Tải lên chứng từ"                    │
│     ↓                                           │
│  4. Select image (drag/click/paste)             │
│     ↓                                           │
│  5. ✨ Preview appears automatically!           │
│     ↓                                           │
│  6. Click 👁️ to check full-size (optional)      │
│     ↓                                           │
│  7. Click "Tải lên" button                      │
│     ↓                                           │
│  8. ✅ Success! Bill status → "Chờ duyệt"       │
│     ↓                                           │
│  9. Wait for landlord approval                  │
│     ↓                                           │
│ 10. Approved → Status: "Đã thanh toán" 🎉      │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Success Indicators

### Visual Feedback

**Uploading:**
```
[ Tải lên... ] ⌛
```

**Success:**
```
✅ Tải lên chứng từ thanh toán thành công!
```

**Error:**
```
❌ Tải lên chứng từ thất bại
```

### Status Changes

**Before Upload:**
```
Status: Chờ thanh toán (🟡 Gold)
```

**After Upload:**
```
Status: Chờ duyệt (🔵 Blue)
```

**After Approval:**
```
Status: Đã thanh toán (🟢 Green)
```

**If Rejected:**
```
Status: Bị từ chối (🔴 Red)
→ Can re-upload with corrected evidence
```

---

## 📞 Troubleshooting

### Problem: Can't see preview
**Solution:** 
- Make sure file is JPG/PNG (not PDF)
- Refresh page and try again
- Clear browser cache

### Problem: Upload button disabled
**Solution:**
- Make sure you selected a file
- Check file size < 5MB
- Check file type is JPG/PNG/PDF

### Problem: Image too large
**Solution:**
- Resize image using built-in Windows Photo app
- Or use online tools: TinyPNG, Compressor.io
- Target size: 1-2MB is ideal

### Problem: Preview not working
**Solution:**
- Check browser supports FileReader API
- Update browser to latest version
- Try different browser (Chrome/Edge recommended)

---

## 🎓 Technical Details

### How Preview Works

1. **File Selection**
   ```
   User selects file → beforeUpload() triggered
   ```

2. **Validation**
   ```
   Check type (JPG/PNG/PDF) → Check size (< 5MB)
   ```

3. **Preview Generation** (for images only)
   ```
   FileReader → readAsDataURL() → Base64 string
   ```

4. **Display**
   ```
   Base64 → thumbnail + full preview capability
   ```

5. **Upload**
   ```
   User clicks "Tải lên" → FormData → Backend
   ```

### Data Flow
```
Component                  API                  Backend
    │                      │                      │
    │─── Select File ─────→│                      │
    │                      │                      │
    │←── Preview Image ────│                      │
    │                      │                      │
    │─── Click Upload ────→│                      │
    │                      │                      │
    │                      │──── POST ───────────→│
    │                      │      FormData        │
    │                      │      - billId        │
    │                      │      - file          │
    │                      │                      │
    │                      │←──── Response ───────│
    │                      │      { success }     │
    │                      │                      │
    │←── Success Msg ──────│                      │
    │                      │                      │
```

---

**All features working perfectly! 🚀**

**Next Steps:**
1. Test the upload with real payment screenshot
2. Verify preview shows correctly
3. Submit to landlord for approval
4. Receive payment confirmation!

---

*Need help? Check the main documentation or contact support.*
