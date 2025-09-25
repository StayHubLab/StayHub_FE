import React, { useState, useEffect } from 'react';
import { message, Spin } from 'antd';
import TenantOverview from './components/TenantOverview';
import TenantFilters from './components/TenantFilters';
import TenantTable from './components/TenantTable';
import './ManageTenants.css';

const ManageTenants = () => {
  // State management
  const [loading, setLoading] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [overviewData, setOverviewData] = useState({
    totalTenants: 0,
    expectedRent: 0,
    collectedRent: 0,
    remainingRent: 0
  });

  // Filter states
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roomFilter, setRoomFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');

  // Mock data
  const mockTenants = [
    {
      id: '1',
      tenant: {
        name: 'Nguyễn Văn An',
        phone: '0901234567',
        avatar: null
      },
      roomNumber: 'P101',
      rentAmount: 3500000,
      term: 12,
      paymentStatus: 'paid',
      contract: {
        startDate: '2024-01-15',
        endDate: '2024-12-31'
      }
    },
    {
      id: '2',
      tenant: {
        name: 'Trần Thị Bình',
        phone: '0912345678',
        avatar: null
      },
      roomNumber: 'A201',
      rentAmount: 4200000,
      term: 6,
      paymentStatus: 'pending',
      contract: {
        startDate: '2024-02-01',
        endDate: '2024-08-01'
      }
    },
    {
      id: '3',
      tenant: {
        name: 'Lê Minh Cường',
        phone: '0923456789',
        avatar: null
      },
      roomNumber: 'B102',
      rentAmount: 5800000,
      term: 12,
      paymentStatus: 'overdue',
      contract: {
        startDate: '2023-12-01',
        endDate: '2024-12-01'
      }
    },
    {
      id: '4',
      tenant: {
        name: 'Phạm Thị Diễm',
        phone: '0934567890',
        avatar: null
      },
      roomNumber: 'C301',
      rentAmount: 2800000,
      term: 3,
      paymentStatus: 'partial',
      contract: {
        startDate: '2024-03-15',
        endDate: '2024-06-15'
      }
    },
    {
      id: '5',
      tenant: {
        name: 'Hoàng Văn Em',
        phone: '0945678901',
        avatar: null
      },
      roomNumber: 'D401',
      rentAmount: 3200000,
      term: 9,
      paymentStatus: 'paid',
      contract: {
        startDate: '2024-01-01',
        endDate: '2024-10-01'
      }
    }
  ];

  // Initialize data
  useEffect(() => {
    const initializeData = () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setTenants(mockTenants);
        setFilteredTenants(mockTenants);
        
        // Calculate overview data
        const totalTenants = mockTenants.length;
        const expectedRent = mockTenants.reduce((sum, tenant) => sum + tenant.rentAmount, 0);
        const collectedRent = mockTenants
          .filter(tenant => tenant.paymentStatus === 'paid')
          .reduce((sum, tenant) => sum + tenant.rentAmount, 0);
        const partialRent = mockTenants
          .filter(tenant => tenant.paymentStatus === 'partial')
          .reduce((sum, tenant) => sum + (tenant.rentAmount * 0.5), 0); // Assume 50% paid for partial
        const remainingRent = expectedRent - collectedRent - partialRent;

        setOverviewData({
          totalTenants,
          expectedRent,
          collectedRent: collectedRent + partialRent,
          remainingRent
        });
        
        setLoading(false);
      }, 1000);
    };

    initializeData();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...tenants];

    // Search filter
    if (searchText) {
      filtered = filtered.filter(tenant =>
        tenant.tenant.name.toLowerCase().includes(searchText.toLowerCase()) ||
        tenant.tenant.phone.includes(searchText) ||
        tenant.roomNumber.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(tenant => tenant.paymentStatus === statusFilter);
    }

    // Room filter
    if (roomFilter) {
      filtered = filtered.filter(tenant => tenant.roomNumber === roomFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.tenant.name.localeCompare(b.tenant.name);
        case 'room':
          return a.roomNumber.localeCompare(b.roomNumber);
        case 'rent':
          return b.rentAmount - a.rentAmount;
        case 'status':
          return a.paymentStatus.localeCompare(b.paymentStatus);
        case 'contractEnd':
          return new Date(a.contract.endDate) - new Date(b.contract.endDate);
        default:
          return 0;
      }
    });

    setFilteredTenants(filtered);
  }, [tenants, searchText, statusFilter, roomFilter, sortBy]);

  // Get available rooms for filter
  const availableRooms = [...new Set(tenants.map(tenant => tenant.roomNumber))].sort();

  // Event handlers
  const handleRemindPayment = (tenant) => {
    message.success(`Đã gửi thông báo nhắc nhở thanh toán đến ${tenant.tenant.name} (${tenant.roomNumber})`);
    // Here you would typically make an API call to send the reminder
  };

  const handleResetFilters = () => {
    setSearchText('');
    setStatusFilter('');
    setRoomFilter('');
    setSortBy('name');
  };

  if (loading) {
    return (
      <div className="landlords-loading-container">
        <Spin size="large" />
        <div className="landlords-loading-text">Đang tải dữ liệu khách thuê...</div>
      </div>
    );
  }

  return (
    <div className="landlords-manage-tenants">
      {/* Overview Section */}
      <div className="landlords-overview-section">
        <TenantOverview overviewData={overviewData} />
      </div>

      {/* Filters Section */}
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

      {/* Table Section */}
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

