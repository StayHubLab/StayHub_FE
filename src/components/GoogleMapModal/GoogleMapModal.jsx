import React, { useState, useCallback } from "react";
import { Modal, Button, Spin, Alert } from "antd";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { EnvironmentOutlined, CloseOutlined } from "@ant-design/icons";
import "./GoogleMapModal.css";

const GoogleMapModal = ({ visible, onClose, roomData }) => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Lấy tọa độ từ roomData
  const getCoordinates = () => {
    if (!roomData) return { lat: 21.028511, lng: 105.804817 }; // Default: Hà Nội

    // Thử lấy từ building address
    if (
      roomData.buildingId?.address?.lat &&
      roomData.buildingId?.address?.lng
    ) {
      return {
        lat: parseFloat(roomData.buildingId.address.lat),
        lng: parseFloat(roomData.buildingId.address.lng),
      };
    }

    // Thử lấy từ room address
    if (roomData.address?.lat && roomData.address?.lng) {
      return {
        lat: parseFloat(roomData.address.lat),
        lng: parseFloat(roomData.address.lng),
      };
    }

    // Fallback coordinates
    return { lat: 21.028511, lng: 105.804817 };
  };

  const coordinates = getCoordinates();
  const roomName = roomData?.title || roomData?.name || "Phòng trọ";
  const roomAddress = roomData?.address || "Địa chỉ không xác định";

  const handleMarkerClick = useCallback((marker) => {
    setSelectedMarker(marker);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedMarker(null);
  }, []);

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
    window.open(url, "_blank");
  };

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "8px",
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
  };

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <EnvironmentOutlined />
          <span>Xem trên bản đồ</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ maxWidth: "1000px" }}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
        <Button
          key="open-maps"
          type="primary"
          icon={<EnvironmentOutlined />}
          onClick={openInGoogleMaps}
        >
          Mở trong Google Maps
        </Button>,
      ]}
      className="google-map-modal"
    >
      <div className="map-modal-container">
        {!mapLoaded && (
          <div className="map-loading">
            <Spin size="large" />
            <p>Đang tải bản đồ...</p>
          </div>
        )}
{/* 
        <LoadScript
          googleMapsApiKey={
            process.env.REACT_APP_GOOGLE_MAPS_API_KEY ||
            "YOUR_GOOGLE_MAPS_API_KEY"
          }
          onLoad={handleMapLoad}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates}
            zoom={15}
            options={mapOptions}
            onLoad={handleMapLoad}
          >
            <Marker
              position={coordinates}
              onClick={() =>
                handleMarkerClick({
                  lat: coordinates.lat,
                  lng: coordinates.lng,
                  name: roomName,
                  address: roomAddress,
                })
              }
            />

            {selectedMarker && (
              <InfoWindow
                position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                onCloseClick={handleInfoWindowClose}
              >
                <div className="info-window-content">
                  <h3 style={{ margin: "0 0 8px 0", color: "#1f2937" }}>
                    {selectedMarker.name}
                  </h3>
                  <p style={{ margin: "0 0 8px 0", color: "#6b7280" }}>
                    {selectedMarker.address}
                  </p>
                  <Button
                    type="primary"
                    size="small"
                    onClick={openInGoogleMaps}
                    style={{ marginTop: "8px" }}
                  >
                    Mở trong Google Maps
                  </Button>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript> */}

        <div className="map-info">
          <div className="location-details">
            <h4>📍 Thông tin vị trí</h4>
            <p>
              <strong>Tên phòng:</strong> {roomName}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {roomAddress}
            </p>
            <p>
              <strong>Tọa độ:</strong> {coordinates.lat.toFixed(6)},{" "}
              {coordinates.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default GoogleMapModal;
