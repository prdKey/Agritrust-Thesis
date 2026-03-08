import { useEffect, useState } from "react";
import { Store, Truck, CheckCircle, XCircle, Clock, User, Mail, Phone, MapPin, Calendar } from "lucide-react";

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [expandedAppId, setExpandedAppId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const res = await getAllApplications();
      // setApplications(res.applications);
      
      // Mock data for now
      const mockData = [
        {
          id: 1,
          userId: 5,
          type: "SELLER",
          status: "PENDING",
          firstName: "Juan",
          lastName: "Dela Cruz",
          email: "juan@example.com",
          mobileNumber: "09171234567",
          address: {
            houseNumber: "123",
            street: "Main St",
            barangay: "Poblacion",
            city: "Baguio City",
            postalCode: "2600"
          },
          businessName: "Juan's Store",
          businessDescription: "Selling local products and crafts",
          createdAt: "2024-03-01T10:00:00Z",
          updatedAt: "2024-03-01T10:00:00Z"
        },
        {
          id: 2,
          userId: 8,
          type: "LOGISTICS",
          status: "PENDING",
          firstName: "Maria",
          lastName: "Santos",
          email: "maria@example.com",
          mobileNumber: "09187654321",
          address: {
            houseNumber: "456",
            street: "Session Rd",
            barangay: "Central",
            city: "Baguio City",
            postalCode: "2600"
          },
          vehicleType: "Motorcycle",
          vehiclePlateNumber: "ABC 1234",
          driversLicenseNumber: "N01-12-345678",
          createdAt: "2024-03-02T14:30:00Z",
          updatedAt: "2024-03-02T14:30:00Z"
        }
      ];
      setApplications(mockData);
    } catch (err) {
      console.error("Failed to fetch applications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    const confirmed = window.confirm("Are you sure you want to approve this application?");
    if (!confirmed) return;

    try {
      // TODO: Call API to approve
      // await approveApplication(applicationId);
      
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: "APPROVED" } : app
        )
      );
      alert("Application approved successfully!");
    } catch (err) {
      console.error("Failed to approve:", err);
      alert("Failed to approve application");
    }
  };

  const handleReject = async (applicationId) => {
    const reason = window.prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      // TODO: Call API to reject
      // await rejectApplication(applicationId, reason);
      
      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, status: "REJECTED" } : app
        )
      );
      alert("Application rejected successfully!");
    } catch (err) {
      console.error("Failed to reject:", err);
      alert("Failed to reject application");
    }
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    const { houseNumber, street, barangay, city, postalCode } = address;
    return `#${houseNumber} ${street}, ${barangay}, ${city}, ${postalCode}`;
  };

  const toggleExpand = (appId) => {
    setExpandedAppId(expandedAppId === appId ? null : appId);
  };

  const getTypeBadge = (type) => {
    if (type === "SELLER") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-purple-100 text-purple-800 border-purple-200 flex items-center gap-1">
          <Store size={12} />
          SELLER
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
        <Truck size={12} />
        LOGISTICS
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", icon: Clock },
      APPROVED: { color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
      REJECTED: { color: "bg-red-100 text-red-800 border-red-200", icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center gap-1`}>
        <Icon size={12} />
        {status}
      </span>
    );
  };

  const filteredApplications = applications.filter((app) => {
    const matchType = typeFilter === "ALL" || app.type === typeFilter;
    const matchStatus = statusFilter === "ALL" || app.status === statusFilter;
    return matchType && matchStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
        <p className="text-gray-600 mt-2">Review and manage seller and logistics applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="SELLER">Seller</option>
          <option value="LOGISTICS">Logistics</option>
        </select>
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-48 focus:ring-2 focus:ring-green-400 focus:border-transparent"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-1">
            {applications.filter(a => a.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Approved</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {applications.filter(a => a.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {applications.filter(a => a.status === "REJECTED").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Filtered</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{filteredApplications.length}</p>
        </div>
      </div>

      {/* Applications Cards */}
      {filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 mb-4">
            <User className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
            >
              {/* Card Main Content */}
              <div className="flex flex-col lg:flex-row">
                {/* Left Panel - Applicant Info */}
                <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-5 lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200">
                  <div className="space-y-4">
                    {/* Application ID */}
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Application ID</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">#{app.id}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      {getTypeBadge(app.type)}
                      {getStatusBadge(app.status)}
                    </div>

                    {/* Name */}
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Applicant Name</p>
                      <p className="text-lg font-bold text-gray-900 leading-tight">
                        {app.firstName} {app.lastName}
                      </p>
                    </div>

                    {/* Quick Contact */}
                    <div className="pt-3 border-t border-gray-200 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail size={14} className="text-gray-500" />
                        <a href={`mailto:${app.email}`} className="text-blue-600 hover:text-blue-800 truncate">
                          {app.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-gray-500" />
                        <a href={`tel:${app.mobileNumber}`} className="text-green-600 hover:text-green-800 font-medium">
                          {app.mobileNumber}
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
                        <p className="text-sm text-gray-700">{formatAddress(app.address)}</p>
                      </div>
                    </div>

                    {/* Type-specific Information */}
                    {app.type === "SELLER" && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <Store size={14} />
                          Business Information
                        </p>
                        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200 space-y-2">
                          <div>
                            <span className="text-xs text-gray-600">Business Name:</span>
                            <p className="text-sm font-semibold text-gray-900">{app.businessName}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Description:</span>
                            <p className="text-sm text-gray-700">{app.businessDescription}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {app.type === "LOGISTICS" && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                          <Truck size={14} />
                          Vehicle Information
                        </p>
                        <div className="bg-green-50 rounded-lg p-3 border border-green-200 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-xs text-gray-600">Vehicle Type:</span>
                              <p className="text-sm font-semibold text-gray-900">{app.vehicleType}</p>
                            </div>
                            <div>
                              <span className="text-xs text-gray-600">Plate Number:</span>
                              <p className="text-sm font-semibold text-gray-900">{app.vehiclePlateNumber}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-gray-600">Driver's License:</span>
                            <p className="text-sm font-semibold text-gray-900">{app.driversLicenseNumber}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {app.status === "PENDING" && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="px-5 py-2.5 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                          >
                            <CheckCircle size={16} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="px-5 py-2.5 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </>
                      )}

                      {app.status === "APPROVED" && (
                        <div className="flex items-center gap-2 text-sm text-green-600 font-semibold">
                          <CheckCircle size={20} />
                          Application Approved
                        </div>
                      )}

                      {app.status === "REJECTED" && (
                        <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                          <XCircle size={20} />
                          Application Rejected
                        </div>
                      )}

                      <button
                        onClick={() => toggleExpand(app.id)}
                        className="ml-auto px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 border border-gray-300"
                      >
                        <span className="font-medium">
                          {expandedAppId === app.id ? "Hide" : "View"} Details
                        </span>
                        <svg
                          className={`w-4 h-4 transition-transform ${expandedAppId === app.id ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {/* Expanded Details */}
                    {expandedAppId === app.id && (
                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Timeline */}
                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                              <Calendar size={14} className="text-blue-600" />
                              Application Timeline
                            </h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Submitted:</span>
                                <span className="font-medium text-gray-900">{formatDate(app.createdAt)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Last Updated:</span>
                                <span className="font-medium text-gray-900">{formatDate(app.updatedAt)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Additional Info */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Applicant Details</h4>
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-gray-600">User ID:</span>
                                <span className="font-medium text-gray-900">#{app.userId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Application Type:</span>
                                <span className="font-medium text-gray-900">{app.type}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className={`font-medium ${
                                  app.status === "APPROVED" ? "text-green-600" :
                                  app.status === "REJECTED" ? "text-red-600" :
                                  "text-yellow-600"
                                }`}>
                                  {app.status}
                                </span>
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