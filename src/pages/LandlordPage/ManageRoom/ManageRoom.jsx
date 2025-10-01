import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Select,
  Row,
  Col,
  message,
  Space,
  Spin,
  notification,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import RoomTable from "./components/RoomTable";
import EditRoomModal from "./components/EditRoomModal";
import RoomDetailModal from "./components/RoomDetailModal";
import DeleteRoomModal from "./DeleteRoomModal";
import { useAuth } from "../../../contexts/AuthContext";
import roomApi from "../../../services/api/roomApi";
import "./ManageRoom.css";

const { Option } = Select;
const { Search } = Input;

const ManageRoom = () => {
  // Auth context
  const { user, isAuthenticated } = useAuth();

  // State management
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [detailActiveTab, setDetailActiveTab] = useState("1");
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Notification context
  const [api, contextHolder] = notification.useNotification();

  // Load rooms from API
  useEffect(() => {
    if (isAuthenticated && user) {
      loadRooms();
    }
  }, [
    isAuthenticated,
    user,
    pagination.current,
    pagination.pageSize,
    searchText,
    filterStatus,
    filterType,
    sortBy,
  ]);

  const loadRooms = async () => {
    try {
      setLoading(true);

      // Prepare query parameters
      const params = {
        page: pagination.current,
        limit: pagination.pageSize,
        ...(searchText && { search: searchText }),
        ...(filterStatus !== "all" && { status: filterStatus }),
        ...(filterType !== "all" && { type: filterType }),
        sortBy: sortBy,
        landlordId: user._id, // Filter by current landlord
      };
      console.log("Frontend sending params:", params);
      const response = await roomApi.getRooms(params);
      console.log("Backend response:", {
        success: response.success,
        roomsCount: response.data?.rooms?.length || 0,
        pagination: response.data?.pagination,
      });

      if (response.success && response.data) {
        // Process the rooms data
        let roomsArray = [];

        // Try different possible data structures
        if (response.data.rooms && Array.isArray(response.data.rooms)) {
          roomsArray = response.data.rooms;
          console.log("Found rooms in response.data.rooms:", roomsArray.length);
        } else if (Array.isArray(response.data)) {
          roomsArray = response.data;
          console.log(
            "Found rooms directly in response.data:",
            roomsArray.length
          );
        } else if (response.data.data && Array.isArray(response.data.data)) {
          roomsArray = response.data.data;
          console.log("Found rooms in response.data.data:", roomsArray.length);
        } else {
          console.log(
            "No rooms array found, available keys:",
            Object.keys(response.data)
          );
          roomsArray = [];
        }

        // Transform API data to component format
        const transformedRooms = roomsArray.map((room) => {
          return {
            key: room._id,
            _id: room._id,
            roomCode:
              room.roomCode || room.code || room._id.slice(-6).toUpperCase(),
            name: room.title || room.name,
            address: formatAddress(room.address || room.buildingId?.address),
            type: room.type || "Phòng trọ",
            area: room.area,
            capacity: room.capacity,
            price: room.price?.rent || room.price || 0,
            priceDetails: room.price, // Keep full price object
            status: mapStatus(room.status),
            isAvailable: room.isAvailable,
            amenities: room.amenities || [],
            utilities: room.utilities || [],
            features: room.features || {},
            description: room.description,
            rating: room.rating || 0,
            viewCount: room.viewCount || 0,
            favoriteCount: room.favoriteCount || 0,
            tenant: room.currentTenant
              ? {
                  name: room.currentTenant.name,
                  phone: room.currentTenant.phone,
                  email: room.currentTenant.email,
                  idCard: room.currentTenant.idCard,
                  occupation: room.currentTenant.occupation,
                  contractStart: room.currentTenant.contractStart,
                  contractEnd: room.currentTenant.contractEnd,
                }
              : null,
            dueDate: room.nextPaymentDate,
            images: room.images || [],
            buildingId: room.buildingId, // Keep full building object if populated
            building:
              room.buildingId && typeof room.buildingId === "object"
                ? room.buildingId
                : null,
            landlordId: room.landlordId,
            createdAt: room.createdAt,
            updatedAt: room.updatedAt,
          };
        });

        // Since backend filtering is now working, use the returned data directly
        setRooms(transformedRooms);
        setPagination((prev) => ({
          ...prev,
          total: response.data.pagination?.total || transformedRooms.length,
        }));
      } else {
        message.error("Không thể tải danh sách phòng");
        setRooms([]);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải danh sách phòng");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const formatAddress = (address) => {
    if (!address) return "Chưa có địa chỉ";
    if (typeof address === "string") return address;

    const { street, ward, district, city } = address;
    const parts = [street, ward, district, city].filter(Boolean);
    return parts.join(", ") || "Chưa có địa chỉ";
  };

  const mapStatus = (status) => {
    switch (status) {
      case "available":
        return "available";
      case "rented":
      case "occupied":
        return "occupied";
      case "maintenance":
        return "maintenance";
      case "reserved":
        return "reserved";
      default:
        return "available";
    }
  };

  // Event handlers
  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
    // loadRooms will be called automatically via useEffect dependency
  };

  const handleViewRoom = (room) => {
    setSelectedRoom(room);
    setDetailActiveTab("1");
    setDetailModalVisible(true);
  };

  const handleEditRoom = (room) => {
    // Open edit modal with room data
    setSelectedRoom(room);
    setEditModalVisible(true);
  };

  const handleDeleteRoom = (room) => {
    // Find the complete room object
    const roomToDelete = typeof room === 'string' 
      ? rooms.find(r => r._id === room || r.key === room)
      : room;
    
    setSelectedRoom(roomToDelete);
    setDeleteModalVisible(true);
  };

  const handleConfirmDelete = async (roomId) => {
    try {
      setDeleteLoading(true);
      const response = await roomApi.deleteRoom(roomId);
      
      if (response.success) {
        api.open({
          type: 'success',
          message: 'Xóa phòng thành công',
          description: 'Phòng đã được xóa khỏi hệ thống.',
          placement: 'topRight',
          duration: 3,
        });
        setDeleteModalVisible(false);
        setSelectedRoom(null);
        loadRooms(); // Reload rooms list
      } else {
        api.open({
          type: 'error',
          message: 'Không thể xóa phòng',
          description: response.message || 'Có lỗi xảy ra khi xóa phòng.',
          placement: 'topRight',
          duration: 4,
        });
      }
    } catch (error) {
      console.error('Error deleting room:', error);
      api.open({
        type: 'error',
        message: 'Lỗi hệ thống',
        description: 'Có lỗi xảy ra khi xóa phòng. Vui lòng thử lại.',
        placement: 'topRight',
        duration: 4,
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddRoom = async (roomData) => {
    try {
      console.log("Creating room with data:", roomData);

      // Add landlordId to FormData
      roomData.append("landlordId", user._id);

      const response = await roomApi.createRoom(roomData);

      if (response.success) {
        message.success("Thêm phòng thành công!");
        setAddModalVisible(false);

        // If we're not on page 1, go to page 1 to see the new room
        if (pagination.current !== 1) {
          setPagination((prev) => ({ ...prev, current: 1 }));
          // loadRooms will be called automatically via useEffect
        } else {
          // We're on page 1, just reload to get fresh data with new room
          loadRooms();
        }
      } else {
        message.error(response.message || "Không thể thêm phòng");
      }
    } catch (error) {
      console.error("Error creating room:", error);
      message.error("Có lỗi xảy ra khi thêm phòng");
    }
  };

  const handleUpdateRoom = async (roomData, roomId) => {
    try {
      console.log("Updating room:", roomId, roomData);
      const response = await roomApi.updateRoom(roomId, roomData);
      if (response.success) {
        message.success("Cập nhật phòng thành công!");
        setEditModalVisible(false);
        setSelectedRoom(null);
        loadRooms(); // Reload rooms list
      } else {
        message.error(response.message || "Không thể cập nhật phòng");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      message.error("Có lỗi xảy ra khi cập nhật phòng");
    }
  };

  // Use rooms directly since backend already handles filtering, sorting, and pagination
  const sortedRooms = rooms;

  return (
    <>
    {contextHolder}
    <div className="landlord-manage-room">
      <Card className="landlord-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <h2
              style={{ color: "#4739f0", fontSize: "40px" }}
              className="landlord-page-title"
            >
              Quản lý phòng
            </h2>
            <p className="landlord-page-subtitle">
              Tổng số phòng: {pagination.total} | Đang hiển thị:{" "}
              {sortedRooms.length}
            </p>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setAddModalVisible(true)}
              className="landlord-add-button"
            >
              Thêm phòng
            </Button>
          </Col>
        </Row>
      </Card>

      <Card className="landlord-filter-card">
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên phòng, mã phòng, địa chỉ..."
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="landlord-search-input"
            />
          </Col>
          <Col>
            <Select
              value={filterStatus}
              onChange={(value) => setFilterStatus(value)}
              style={{ width: 140 }}
              size="large"
            >
              <Option value="all">Tất cả</Option>
              <Option value="available">Còn trống</Option>
              <Option value="occupied">Đã thuê</Option>
              <Option value="maintenance">Bảo trì</Option>
              <Option value="reserved">Đã đặt cọc</Option>
            </Select>
          </Col>
          <Col>
            <Select
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              style={{ width: 140 }}
              size="large"
            >
              <Option value="name">Tên phòng</Option>
              <Option value="price">Giá thuê</Option>
              <Option value="area">Diện tích</Option>
              <Option value="created">Mới nhất</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Card className="landlord-table-card">
        <RoomTable
          rooms={sortedRooms}
          loading={loading}
          onView={handleViewRoom}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
        />
      </Card>

      {/* Add Room Modal - using EditRoomModal for both add and edit */}
      <EditRoomModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSubmit={(roomData) => handleAddRoom(roomData)}
        isEdit={false}
      />

      {/* Edit Room Modal - using EditRoomModal for both add and edit */}
      <EditRoomModal
        visible={editModalVisible}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedRoom(null);
        }}
        onSubmit={handleUpdateRoom}
        initialData={selectedRoom}
        isEdit={true}
      />

      {/* Room Detail Modal */}
      <RoomDetailModal
        visible={detailModalVisible}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        activeTab={detailActiveTab}
        onTabChange={setDetailActiveTab}
      />

      {/* Delete Room Modal */}
      <DeleteRoomModal
        visible={deleteModalVisible}
        onClose={() => {
          setDeleteModalVisible(false);
          setSelectedRoom(null);
        }}
        onConfirm={handleConfirmDelete}
        room={selectedRoom}
        loading={deleteLoading}
      />
    </div>
    </>
  );
};

export default ManageRoom;
