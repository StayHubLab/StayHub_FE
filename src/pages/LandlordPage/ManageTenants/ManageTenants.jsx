import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import TenantOverview from "./components/TenantOverview";
import TenantFilters from "./components/TenantFilters";
import TenantTable from "./components/TenantTable";
import { useAuth } from "../../../contexts/AuthContext";
import tenantApi from "../../../services/api/tenantApi";
import "./ManageTenants.css";

const ManageTenants = () => {
  const { user, isAuthenticated } = useAuth();

  // State management
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [overviewData, setOverviewData] = useState({
    totalTenants: 0,
    expectedRent: 0,
    collectedRent: 0,
    remainingRent: 0,
  });

  // Filter states
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Load tenants from API whenever filters change
  useEffect(() => {
    if (isAuthenticated && user) {
      loadTenants();
    }
  }, [isAuthenticated, user, searchText, statusFilter, roomFilter, sortBy]);

  const loadTenants = async () => {
    try {
      setLoading(true);

      const response = await tenantApi.getTenants({
        page: 1,
        limit: 100,
        search: searchText,
        status: statusFilter,
        roomId: roomFilter,
        sortBy: sortBy,
        landlordId: user?._id,
      });

      if (response.success && response.data) {
        const transformedTenants = response.data.tenants.map((tenant) => ({
          id: tenant._id,
          tenant: {
            name: tenant.tenant?.name || "Không xác định",
            phone: tenant.tenant?.phone || "Chưa có",
            email: tenant.tenant?.email,
            avatar: tenant.tenant?.avatar,
            idCard: tenant.tenant?.idCard,
            occupation: tenant.tenant?.occupation,
          },
          roomNumber: tenant.roomNumber || "N/A",
          roomId: tenant.roomId,
          rentAmount: tenant.rentAmount || 0,
          term: tenant.term || 12,
          paymentStatus: mapPaymentStatus(tenant.paymentStatus),
          contract: {
            startDate: tenant.contract?.startDate,
            endDate: tenant.contract?.endDate,
            contractId: tenant.contract?.contractId,
          },
          lastPaymentDate: tenant.lastPaymentDate,
          nextPaymentDate: tenant.nextPaymentDate,
          totalUnpaid: tenant.totalUnpaid || 0,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
        }));

        setTenants(transformedTenants);
        setFilteredTenants(transformedTenants);
        calculateOverviewData(transformedTenants);
      } else {
        message.error("Không thể tải danh sách người thuê");
        setTenants([]);
        setFilteredTenants([]);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải danh sách người thuê");
      setTenants([]);
      setFilteredTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const mapPaymentStatus = (status) => {
    const statusMap = {
      paid: "paid",
      pending: "pending",
      overdue: "overdue",
      partial: "partial",
    };
    return statusMap[status] || "pending";
  };

  const calculateOverviewData = (tenantData) => {
    const totalTenants = tenantData.length;
    const expectedRent = tenantData.reduce(
      (sum, tenant) => sum + tenant.rentAmount,
      0
    );
    const collectedRent = tenantData
      .filter((tenant) => tenant.paymentStatus === "paid")
      .reduce((sum, tenant) => sum + tenant.rentAmount, 0);
    const partialRent = tenantData
      .filter((tenant) => tenant.paymentStatus === "partial")
      .reduce(
        (sum, tenant) => sum + (tenant.rentAmount - tenant.totalUnpaid),
        0
      );
    const remainingRent = expectedRent - collectedRent - partialRent;

    setOverviewData({
      totalTenants,
      expectedRent,
      collectedRent: collectedRent + partialRent,
      remainingRent,
    });
  };

  // Optional client-side refinement (keep simple: rely on server filters primarily)
  useEffect(() => {
    // If needed, apply lightweight client-side search refining on already filtered list
    if (!searchText) {
      setFilteredTenants(tenants);
      return;
    }
    const refined = tenants.filter(
      (tenant) =>
        tenant.tenant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (tenant.tenant.phone || "").includes(searchText) ||
        (tenant.roomNumber || "")
          .toLowerCase()
          .includes(searchText.toLowerCase())
    );
    setFilteredTenants(refined);
  }, [tenants, searchText]);

  // Remove heavy client-side filtering; server handles most filters.

  const availableRooms = [
    ...new Set(tenants.map((tenant) => tenant.roomNumber)),
  ].sort();

  const handleRemindPayment = (tenant) => {
    message.success(
      `Đã gửi thông báo nhắc nhở thanh toán đến ${tenant.tenant.name} (${tenant.roomNumber})`
    );
  };

  const handleResetFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setRoomFilter("");
    setSortBy("name");
  };

  if (loading) {
    return (
      <div className="landlords-loading-container">
        <Spin size="large" />
        <div className="landlords-loading-text">
          Đang tải dữ liệu khách thuê...
        </div>
      </div>
    );
  }

  return (
    <div className="landlords-manage-tenants">
      <div className="landlords-overview-section">
        <TenantOverview overviewData={overviewData} />
      </div>

      <div className="landlords-filters-section">
        <TenantFilters
          searchText={searchText}
          onSearchChange={setSearchText}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          roomFilter={roomFilter}
          onRoomFilterChange={setRoomFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onResetFilters={handleResetFilters}
          availableRooms={availableRooms}
        />
      </div>

      <div className="landlords-table-section">
        <TenantTable
          tenants={filteredTenants}
          loading={false}
          onRemindPayment={handleRemindPayment}
        />
      </div>
    </div>
  );
};

export default ManageTenants;
