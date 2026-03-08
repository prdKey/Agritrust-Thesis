import { useEffect, useState } from "react";
import { getAllUsers } from "../../services/userService.js";
import { User, Mail, Phone, MapPin, Wallet, Calendar, ChevronDown } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [expandedUserId, setExpandedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const data = await getAllUsers();
    setUsers(data);
  };

  const toggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : u
      )
    );
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    if (!address) return "-";
    const { houseNumber, street, barangay, city, postalCode } = address;
    return `#${houseNumber} ${street}, ${barangay}, ${city}, ${postalCode}`;
  };

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      USER: { color: "bg-blue-100 text-blue-800 border-blue-200", label: "USER" },
      SELLER: { color: "bg-purple-100 text-purple-800 border-purple-200", label: "SELLER" },
      ADMIN: { color: "bg-red-100 text-red-800 border-red-200", label: "ADMIN" },
      LOGISTICS: { color: "bg-green-100 text-green-800 border-green-200", label: "LOGISTICS" },
    };
    const config = roleConfig[role] || { color: "bg-gray-100 text-gray-800 border-gray-200", label: role };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    if (status === "ACTIVE") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-200">
          ACTIVE
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-red-100 text-red-800 border-red-200">
        SUSPENDED
      </span>
    );
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchSearch =
      fullName.includes(search.toLowerCase()) ||
      user.id.toString().includes(search) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchStatus = statusFilter === "ALL" || user.status === statusFilter;

    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage all users and their permissions</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or ID..."
          className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="USER">User</option>
          <option value="SELLER">Seller</option>
          <option value="ADMIN">Admin</option>
          <option value="LOGISTICS">Logistics</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Users</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {users.filter(u => u.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Suspended</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {users.filter(u => u.status === "SUSPENDED").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Filtered</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{filteredUsers.length}</p>
        </div>
      </div>

      {/* Users Cards */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              {/* Card Main Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel - User Info */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="space-y-4">
                    {/* User ID and Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">User ID</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">#{user.id}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
                    </div>

                    {/* Name */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-lg font-bold text-gray-900 leading-tight">
                        {user.firstName} {user.middleName ? user.middleName + " " : ""}{user.lastName}
                      </p>
                    </div>

                    {/* Quick Contact */}
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-500" />
                        <a href={`mailto:${user.email}`} className="text-blue-600 hover:text-blue-800 truncate">
                          {user.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-500" />
                        <a href={`tel:${user.mobileNumber}`} className="text-green-600 hover:text-green-800 font-medium">
                          {user.mobileNumber}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Details & Actions */}
                <div className="flex-1 p-5">
                  <div className="space-y-4">
                    {/* Address */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <MapPin size={14} />
                        Address
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700">{formatAddress(user.address)}</p>
                      </div>
                    </div>

                    {/* Wallet */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <Wallet size={14} />
                        Wallet Address
                      </p>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-sm text-gray-700 font-mono break-all">{user.walletAddress}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                          user.status === "ACTIVE"
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "ACTIVE" ? (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            Suspend User
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Activate User
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => toggleExpand(user.id)}
                        className="ml-auto px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-300"
                      >
                        <span className="font-medium">
                          {expandedUserId === user.id ? "Hide" : "View"} Details
                        </span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${expandedUserId === user.id ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedUserId === user.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Timestamps */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                              <Calendar size={14} className="text-blue-600" />
                              Account Timeline
                            </h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Created:</span>
                                <span className="font-medium text-gray-900">{formatDate(user.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Last Updated:</span>
                                <span className="font-medium text-gray-900">{formatDate(user.updatedAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Additional Information</h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Role:</span>
                                <span className="font-medium text-gray-900">{user.role}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-medium ${user.status === "ACTIVE" ? "text-green-600" : "text-red-600"}`}>
                                  {user.status}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Account ID:</span>
                                <span className="font-medium text-gray-900">#{user.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}