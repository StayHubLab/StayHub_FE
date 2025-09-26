import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

const SignaturePad = ({ onSaveSignature, width = 360, height = 160 }) => {
  const sigRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleClear = () => {
    sigRef.current?.clear();
    setPreview(null);
    onSaveSignature?.(null);
  };

  const handleSave = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) return;
    // Use raw canvas directly to avoid trim-canvas dependency issues
    const dataURL = sigRef.current.getCanvas().toDataURL("image/png");
    setPreview(dataURL);
    onSaveSignature?.(dataURL);
  };

  return (
    <div>
      {!preview ? (
        <>
          <SignatureCanvas
            ref={sigRef}
            canvasProps={{
              width,
              height,
              className: "signature-canvas",
              style: { border: "1px solid #999", borderRadius: 6 },
            }}
          />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={handleClear}>Xóa</button>
            <button onClick={handleSave}>Lưu chữ ký</button>
          </div>
        </>
      ) : (
        <div>
          <img
            src={preview}
            alt="signature"
            style={{
              maxWidth: width,
              maxHeight: height,
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={handleClear}>Ký lại</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignaturePad;
