/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  PlusCircle,
  Search,
  Filter,
  X,
  Eye,
  Edit2,
  Trash2,
  UserPlus,
  Download,
  Upload,
  RefreshCw,
  Phone,
  Mail,
  Briefcase,
  DollarSign,
  UserCheck,
  UserX,
  Save,
  AlertCircle,
  Loader2,
  LogOut,
  CheckCircle,
  Info,
  User,
  CreditCard,
  Calendar,
  Umbrella,
  HandCoins,
  Clock,
  Building,
  MapPin,
  IdCard,
  Banknote,
  Heart
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-emerald-500',
    error: 'bg-rose-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500'
  };

  const icon = {
    success: <CheckCircle className="text-white" size={18} />,
    error: <AlertCircle className="text-white" size={18} />,
    info: <Info className="text-white" size={18} />,
    warning: <AlertCircle className="text-white" size={18} />
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor[type]} text-white rounded-lg shadow-xl p-4 min-w-[320px] max-w-md`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">{icon[type]}</div>
            <div>
              <p className="font-semibold capitalize">{type}</p>
              <p className="text-sm text-white/90 mt-1">{message}</p>
            </div>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Session Expired Modal
const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Staff Search Modal for Leave/Loan
const StaffSearchModal = ({ isOpen, onClose, onSelect, title, staffList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);

  if (!isOpen) return null;

  const filteredStaff = staffList.filter(staff => 
    `${staff.first_name} ${staff.last_name} ${staff.staff_id} ${staff.department}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[90]">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search staff by name, ID, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8">
              <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No staff members found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStaff.map(staff => (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaff(staff)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedStaff?.id === staff.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">{staff.first_name?.[0]}{staff.last_name?.[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{staff.first_name} {staff.last_name}</p>
                        <p className="text-sm text-gray-500">{staff.staff_id}</p>
                        <p className="text-xs text-gray-400">{staff.department} • {staff.designation}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${staff.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {staff.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={() => selectedStaff && onSelect(selectedStaff)}
            disabled={!selectedStaff}
            className={`px-4 py-2 rounded-lg text-white ${
              selectedStaff ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

// Leave Request Modal
const LeaveRequestModal = ({ isOpen, onClose, staff, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    leave_type: 'Annual',
    start_date: '',
    end_date: '',
    reason: '',
    contact_during_leave: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        leave_type: 'Annual',
        start_date: '',
        end_date: '',
        reason: '',
        contact_during_leave: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(staff.id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[95]">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Request Leave for {staff?.first_name} {staff?.last_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
            <select
              value={formData.leave_type}
              onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="Annual">Annual Leave</option>
              <option value="Sick">Sick Leave</option>
              <option value="Maternity">Maternity Leave</option>
              <option value="Paternity">Paternity Leave</option>
              <option value="Study">Study Leave</option>
              <option value="Compassionate">Compassionate Leave</option>
              <option value="Unpaid">Unpaid Leave</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide reason for leave..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact During Leave</label>
            <input
              type="tel"
              value={formData.contact_during_leave}
              onChange={(e) => setFormData({...formData, contact_during_leave: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Phone number for contact during leave"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Umbrella className="w-4 h-4" />}
              Submit Leave Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Loan Request Modal
const LoanRequestModal = ({ isOpen, onClose, staff, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    loan_type: 'Emergency',
    loan_amount: '',
    reason: '',
    guarantor_name: '',
    guarantor_contact: '',
    interest_rate: '',
    repayment_months: ''
  });

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        loan_type: 'Emergency',
        loan_amount: '',
        reason: '',
        guarantor_name: '',
        guarantor_contact: '',
        interest_rate: '',
        repayment_months: ''
      });
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(staff.id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[95]">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Apply for Loan - {staff?.first_name} {staff?.last_name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type *</label>
              <select
                value={formData.loan_type}
                onChange={(e) => setFormData({...formData, loan_type: e.target.value})}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Emergency">Emergency Loan</option>
                <option value="Salary Advance">Salary Advance</option>
                <option value="Housing">Housing Loan</option>
                <option value="Vehicle">Vehicle Loan</option>
                <option value="Education">Education Loan</option>
                <option value="Other">Other Loan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount (KES) *</label>
              <input
                type="number"
                value={formData.loan_amount}
                onChange={(e) => setFormData({...formData, loan_amount: e.target.value})}
                required
                min="1000"
                step="1000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                value={formData.interest_rate}
                onChange={(e) => setFormData({...formData, interest_rate: e.target.value})}
                step="0.5"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Months *</label>
              <input
                type="number"
                value={formData.repayment_months}
                onChange={(e) => setFormData({...formData, repayment_months: e.target.value})}
                required
                min="1"
                max="60"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Loan *</label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({...formData, reason: e.target.value})}
              required
              rows="2"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              placeholder="Please provide reason for loan..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guarantor Name</label>
              <input
                type="text"
                value={formData.guarantor_name}
                onChange={(e) => setFormData({...formData, guarantor_name: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Guarantor Contact</label>
              <input
                type="tel"
                value={formData.guarantor_contact}
                onChange={(e) => setFormData({...formData, guarantor_contact: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HandCoins className="w-4 h-4" />}
              Submit Loan Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Leave Details Modal
const LeaveDetailsModal = ({ isOpen, onClose, staffId, staffName }) => {
  const [leaves, setLeaves] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    if (isOpen && staffId) {
      fetchLeaveData();
    }
  }, [isOpen, staffId]);

  const fetchLeaveData = async () => {
    setLoading(true);
    try {
      // Fetch leaves
      const leavesRes = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/leaves/`, {
        headers: getAuthHeaders()
      });
      const leavesData = await leavesRes.json();
      if (leavesData.success) {
        setLeaves(leavesData.data);
      }

      // Fetch leave balance
      const balanceRes = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/leave-balance/`, {
        headers: getAuthHeaders()
      });
      const balanceData = await balanceRes.json();
      if (balanceData.success) {
        setBalance(balanceData.data);
      }
    } catch (err) {
      console.error('Error fetching leave data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[95]">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Leave Details - {staffName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              {/* Leave Balance */}
              {balance && (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Leave Balance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(balance).map(([type, days]) => (
                      <div key={type} className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-600 capitalize">{type} Leave</p>
                        <p className="text-xl font-bold text-gray-900">{days} days</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leave History */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Leave History</h4>
                {leaves.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No leave records found</p>
                ) : (
                  <div className="space-y-3">
                    {leaves.map(leave => (
                      <div key={leave.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium text-gray-900">{leave.leave_type}</span>
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                              leave.status === 'Approved' ? 'bg-green-100 text-green-800' :
                              leave.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {leave.status}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">{leave.total_days} days</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{leave.reason}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Loan Details Modal
const LoanDetailsModal = ({ isOpen, onClose, staffId, staffName }) => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    if (isOpen && staffId) {
      fetchLoanData();
    }
  }, [isOpen, staffId]);

  const fetchLoanData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/loans/`, {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setLoans(data.data);
      }
    } catch (err) {
      console.error('Error fetching loan data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    if (!amount) return 'KES 0';
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[95]">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Loan Details - {staffName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          {loading ? (
            <LoadingSpinner />
          ) : loans.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No loan records found</p>
          ) : (
            <div className="space-y-4">
              {loans.map(loan => (
                <div key={loan.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="font-medium text-gray-900">{loan.loan_type}</span>
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        loan.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        loan.status === 'Disbursed' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'Active' ? 'bg-purple-100 text-purple-800' :
                        loan.status === 'Settled' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{loan.loan_id}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Loan Amount</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(loan.loan_amount)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monthly Installment</p>
                      <p className="font-semibold text-gray-900">{formatCurrency(loan.monthly_installment)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Outstanding Balance</p>
                      <p className="font-semibold text-red-600">{formatCurrency(loan.outstanding_balance)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{loan.interest_rate || 0}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Repayment Months</p>
                      <p className="font-semibold text-gray-900">{loan.repayment_months}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied Date</p>
                      <p className="font-semibold text-gray-900">{new Date(loan.applied_date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  {loan.reason && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm text-gray-600"><span className="font-medium">Reason:</span> {loan.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Confirmation Modal
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'danger' }) => {
  if (!isOpen) return null;
  
  const buttonColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700'
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[90]">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              {cancelText}
            </button>
            <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg ${buttonColors[type]}`}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
  </div>
);

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    amber: 'bg-amber-100 text-amber-600',
    rose: 'bg-rose-100 text-rose-600',
    cyan: 'bg-cyan-100 text-cyan-600'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

// Action Card Component
const ActionCard = ({ title, description, icon: Icon, color, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
};

const StaffManagement = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
  // State
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formMode, setFormMode] = useState('create');
  const [uploadModal, setUploadModal] = useState(false);
  const [file, setFile] = useState(null);
  const [stats, setStats] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, name: '' });
  const [validationErrors, setValidationErrors] = useState({});
  
  // Leave/Loan State
  const [showStaffSearch, setShowStaffSearch] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedStaffForAction, setSelectedStaffForAction] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showLeaveDetails, setShowLeaveDetails] = useState(false);
  const [showLoanDetails, setShowLoanDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [filters, setFilters] = useState({
    department: '',
    role: '',
    status: '',
    employment_type: ''
  });

  // Form Data - Matches backend expected fields
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    personal_email: '',
    personal_phone: '',
    date_of_birth: '',
    gender: 'Male',
    department: '',
    designation: '',
    employment_type: 'Permanent',
    national_id: '',
    basic_salary: '',
    bank_name: '',
    account_number: '',
    permanent_address: '',
    emergency_contact: '',
    emergency_contact_name: '',
    marital_status: 'Single',
    kra_pin: '',
    nssf_no: '',
    nhif_no: '',
    contract_end_date: ''
  });

  // Dropdown options
  const departments = [
    'Teaching', 'Administration', 'Accounts & Finance', 'Human Resources',
    'Academic', 'ICT', 'Library', 'Laboratory', 'Maintenance', 'Security',
    'Kitchen & Catering', 'Transport', 'Medical', 'Co-curricular', 'Guidance & Counseling'
  ];

  const employmentTypes = ['Permanent', 'Contract', 'Probation', 'Temporary', 'Part-time', 'Intern'];
  const statusOptions = ['Active', 'On Leave', 'Suspended', 'Terminated', 'Resigned'];
  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const banks = ['Equity Bank', 'KCB Bank', 'Co-operative Bank', 'Absa Bank', 'Standard Chartered', 'NCBA Bank', 'DTB Bank', 'Family Bank'];

  // Helper Functions
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const handleApiError = (error) => {
    if (error?.status === 401 || error?.message?.includes('Unauthorized')) {
      setShowSessionExpired(true);
    }
  };

  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = '/login';
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'KES 0';
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString('en-KE');
    } catch {
      return 'Invalid date';
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'On Leave': 'bg-blue-100 text-blue-800',
      'Suspended': 'bg-yellow-100 text-yellow-800',
      'Terminated': 'bg-red-100 text-red-800',
      'Resigned': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      personal_email: '',
      personal_phone: '',
      date_of_birth: '',
      gender: 'Male',
      department: '',
      designation: '',
      employment_type: 'Permanent',
      national_id: '',
      basic_salary: '',
      bank_name: '',
      account_number: '',
      permanent_address: '',
      emergency_contact: '',
      emergency_contact_name: '',
      marital_status: 'Single',
      kra_pin: '',
      nssf_no: '',
      nhif_no: '',
      contract_end_date: ''
    });
    setValidationErrors({});
    setSelectedStaff(null);
  };

  // API Calls
  const fetchStaff = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.employment_type) params.append('employment_type', filters.employment_type);
      if (searchTerm) params.append('search', searchTerm);
      
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/?${params}`, {
        headers: getAuthHeaders()
      });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      
      if (data.success) {
        setStaff(data.data || []);
      } else {
        showToast(data.error || 'Failed to fetch staff', 'error');
      }
    } catch (err) {
      showToast('Failed to load staff data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/stats/`, {
        headers: getAuthHeaders()
      });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});
    
    const submitData = {
      ...formData,
      national_id: formData.national_id || null,
      basic_salary: formData.basic_salary ? parseFloat(formData.basic_salary) : 0,
      date_of_birth: formData.date_of_birth || null,
      contract_end_date: formData.contract_end_date || null,
      kra_pin: formData.kra_pin || null,
      nssf_no: formData.nssf_no || null,
      nhif_no: formData.nhif_no || null,
      bank_name: formData.bank_name || null,
      account_number: formData.account_number || null,
      permanent_address: formData.permanent_address || null,
      emergency_contact: formData.emergency_contact || null,
      emergency_contact_name: formData.emergency_contact_name || null,
      marital_status: formData.marital_status || null
    };
    
    try {
      const url = formMode === 'create' 
        ? `${API_BASE_URL}/api/hr/staff/create/`
        : `${API_BASE_URL}/api/hr/staff/update/${selectedStaff.id}/`;
      const method = formMode === 'create' ? 'POST' : 'PUT';
      
      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast(`Staff member ${formMode === 'create' ? 'created' : 'updated'} successfully`, 'success');
        setShowForm(false);
        resetForm();
        fetchStaff();
        fetchStats();
      } else {
        if (data.errors) {
          setValidationErrors(data.errors);
          const firstError = Object.values(data.errors)[0];
          if (firstError) {
            showToast(Array.isArray(firstError) ? firstError[0] : firstError, 'error');
          }
        } else {
          showToast(data.error || 'Operation failed', 'error');
        }
      }
    } catch (err) {
      showToast('Failed to save staff member', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { id, name } = deleteConfirm;
    if (!id) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/delete/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      
      if (data.success) {
        showToast(`Staff member ${name} deleted`, 'success');
        fetchStaff();
        fetchStats();
      } else {
        showToast(data.error || 'Delete failed', 'error');
      }
    } catch (err) {
      showToast('Failed to delete staff member', 'error');
    } finally {
      setDeleteConfirm({ isOpen: false, id: null, name: '' });
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      showToast('Please select a file', 'warning');
      return;
    }
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/bulk/`, {
        method: 'POST',
        headers: {
          'Authorization': getAuthHeaders()['Authorization']
        },
        body: uploadFormData
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast(`Successfully imported ${data.data.created_count} staff members`, 'success');
        if (data.data.errors && data.data.errors.length > 0) {
          showToast(`${data.data.errors.length} records had errors`, 'warning');
        }
        setUploadModal(false);
        setFile(null);
        fetchStaff();
        fetchStats();
      } else {
        showToast(data.error || 'Import failed', 'error');
      }
    } catch (err) {
      showToast('Failed to import staff', 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    window.open(`${API_BASE_URL}/api/hr/staff/template/`, '_blank');
    showToast('Template downloaded', 'success');
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.department) params.append('department', filters.department);
      if (filters.status) params.append('status', filters.status);
      
      window.open(`${API_BASE_URL}/api/hr/staff/export/?${params}`, '_blank');
      showToast('Export started', 'success');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setFormMode('edit');
    setFormData({
      first_name: staffMember.first_name || '',
      last_name: staffMember.last_name || '',
      personal_email: staffMember.personal_email || '',
      personal_phone: staffMember.personal_phone || '',
      date_of_birth: staffMember.date_of_birth || '',
      gender: staffMember.gender || 'Male',
      department: staffMember.department || '',
      designation: staffMember.designation || '',
      employment_type: staffMember.employment_type || 'Permanent',
      national_id: staffMember.national_id || '',
      basic_salary: staffMember.basic_salary || '',
      bank_name: staffMember.bank_name || '',
      account_number: staffMember.account_number || '',
      permanent_address: staffMember.permanent_address || '',
      emergency_contact: staffMember.emergency_contact || '',
      emergency_contact_name: staffMember.emergency_contact_name || '',
      marital_status: staffMember.marital_status || 'Single',
      kra_pin: staffMember.kra_pin || '',
      nssf_no: staffMember.nssf_no || '',
      nhif_no: staffMember.nhif_no || '',
      contract_end_date: staffMember.contract_end_date || ''
    });
    setShowForm(true);
  };

  // Leave/Loan Functions
  const handleLeaveRequest = () => {
    setActionType('leave');
    setShowStaffSearch(true);
  };

  const handleLoanRequest = () => {
    setActionType('loan');
    setShowStaffSearch(true);
  };

  const handleStaffSelect = (staffMember) => {
    setSelectedStaffForAction(staffMember);
    setShowStaffSearch(false);
    
    if (actionType === 'leave') {
      setShowLeaveModal(true);
    } else if (actionType === 'loan') {
      setShowLoanModal(true);
    }
  };

  const submitLeaveRequest = async (staffId, leaveData) => {
    setActionLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/leaves/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(leaveData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast('Leave request submitted successfully', 'success');
        setShowLeaveModal(false);
        setSelectedStaffForAction(null);
        fetchStaff(); // Refresh staff list to update status
      } else {
        showToast(data.error || data.errors ? 'Validation error' : 'Failed to submit leave', 'error');
      }
    } catch (err) {
      showToast('Failed to submit leave request', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const submitLoanRequest = async (staffId, loanData) => {
    setActionLoading(true);
    try {
      // Convert numeric fields
      const submitData = {
        ...loanData,
        loan_amount: parseFloat(loanData.loan_amount),
        interest_rate: loanData.interest_rate ? parseFloat(loanData.interest_rate) : 0,
        repayment_months: parseInt(loanData.repayment_months)
      };
      
      const res = await fetch(`${API_BASE_URL}/api/hr/staff/${staffId}/loans/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(submitData)
      });
      
      const data = await res.json();
      
      if (data.success) {
        showToast('Loan application submitted successfully', 'success');
        setShowLoanModal(false);
        setSelectedStaffForAction(null);
        fetchStaff();
      } else {
        showToast(data.error || data.errors ? 'Validation error' : 'Failed to submit loan', 'error');
      }
    } catch (err) {
      showToast('Failed to submit loan application', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (isAuthenticated) {
      fetchStaff();
      fetchStats();
    }
  }, [isAuthenticated, filters, searchTerm]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <p className="text-gray-600 mt-2">Please login to access staff management</p>
          <a href="/login" className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>
      
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      <ConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, id: null, name: '' })}
        onConfirm={handleDelete}
        title="Delete Staff Member"
        message={`Are you sure you want to delete ${deleteConfirm.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      
      {/* Staff Search Modal */}
      <StaffSearchModal
        isOpen={showStaffSearch}
        onClose={() => {
          setShowStaffSearch(false);
          setActionType(null);
        }}
        onSelect={handleStaffSelect}
        title={actionType === 'leave' ? 'Select Staff for Leave Request' : 'Select Staff for Loan Application'}
        staffList={staff}
      />
      
      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={showLeaveModal}
        onClose={() => {
          setShowLeaveModal(false);
          setSelectedStaffForAction(null);
        }}
        staff={selectedStaffForAction}
        onSubmit={submitLeaveRequest}
        loading={actionLoading}
      />
      
      {/* Loan Request Modal */}
      <LoanRequestModal
        isOpen={showLoanModal}
        onClose={() => {
          setShowLoanModal(false);
          setSelectedStaffForAction(null);
        }}
        staff={selectedStaffForAction}
        onSubmit={submitLoanRequest}
        loading={actionLoading}
      />
      
      {/* Leave Details Modal */}
      <LeaveDetailsModal
        isOpen={showLeaveDetails}
        onClose={() => setShowLeaveDetails(false)}
        staffId={selectedStaff?.id}
        staffName={selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : ''}
      />
      
      {/* Loan Details Modal */}
      <LoanDetailsModal
        isOpen={showLoanDetails}
        onClose={() => setShowLoanDetails(false)}
        staffId={selectedStaff?.id}
        staffName={selectedStaff ? `${selectedStaff.first_name} ${selectedStaff.last_name}` : ''}
      />
      
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Staff Management</h1>
              <p className="text-gray-600 mt-1">Manage school staff, teachers, and administrators</p>
              {user && <p className="text-xs text-gray-400 mt-1">{user.first_name} {user.last_name} • {user.role}</p>}
            </div>
            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
              <button 
                onClick={() => { setFormMode('create'); resetForm(); setShowForm(true); }} 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> Add Staff
              </button>
              <button 
                onClick={() => setUploadModal(true)} 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Upload className="w-4 h-4" /> Bulk Upload
              </button>
              <button 
                onClick={handleExport} 
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" /> Export
              </button>
              <button 
                onClick={fetchStaff} 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search by name, email, ID, or department..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)} 
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" /> Filters
              </button>
            </div>

            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select 
                      value={filters.department} 
                      onChange={(e) => setFilters({...filters, department: e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Departments</option>
                      {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select 
                      value={filters.status} 
                      onChange={(e) => setFilters({...filters, status: e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Status</option>
                      {statusOptions.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <select 
                      value={filters.employment_type} 
                      onChange={(e) => setFilters({...filters, employment_type: e.target.value})} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      {employmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button 
                    onClick={() => setFilters({ department: '', role: '', status: '', employment_type: '' })} 
                    className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards and Action Cards Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards - 2 columns on large screens */}
          <div className="lg:col-span-2">
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatsCard title="Total Staff" value={stats.total_staff} icon={Briefcase} color="blue" />
                <StatsCard title="Teachers" value={stats.teachers} icon={UserCheck} color="green" />
                <StatsCard title="Active Staff" value={stats.active_staff} icon={UserCheck} color="cyan" />
                <StatsCard title="Monthly Payroll" value={formatCurrency(stats.total_monthly_salary)} icon={DollarSign} color="purple" />
              </div>
            )}
          </div>
          
          {/* Action Cards - 1 column on large screens */}
          <div className="space-y-4">
            <ActionCard
              title="Leave Management"
              description="Request leave, view balance, and manage staff leave"
              icon={Umbrella}
              color="bg-blue-600"
              onClick={handleLeaveRequest}
            />
            <ActionCard
              title="Loan Management"
              description="Apply for loans, track repayments, and manage staff loans"
              icon={HandCoins}
              color="bg-green-600"
              onClick={handleLoanRequest}
            />
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <LoadingSpinner />
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UserX className="w-16 h-16 text-gray-400" />
              <p className="mt-4 text-gray-500">No staff members found</p>
              <button 
                onClick={() => { setFormMode('create'); setShowForm(true); }} 
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusCircle className="w-4 h-4 mr-2" /> Add First Staff Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department & Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status & Salary</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map((member) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">{member.first_name?.[0]}{member.last_name?.[0]}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{member.first_name} {member.last_name}</div>
                            <div className="text-sm text-gray-500">{member.staff_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{member.department || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{member.designation || 'N/A'}</div>
                        <div className="text-xs text-gray-400 mt-1">{member.employment_type || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm mb-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {member.personal_phone || 'N/A'}
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {member.personal_email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status || 'N/A'}
                        </span>
                        <div className="mt-2 text-sm font-medium text-gray-900">{formatCurrency(member.basic_salary)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button 
                            onClick={() => { setSelectedStaff(member); setShowDetails(true); }} 
                            className="text-blue-600 hover:text-blue-800 p-1 transition-colors" 
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleEdit(member)} 
                            className="text-green-600 hover:text-green-800 p-1 transition-colors" 
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm({ isOpen: true, id: member.id, name: `${member.first_name} ${member.last_name}` })} 
                            className="text-red-600 hover:text-red-800 p-1 transition-colors" 
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { setSelectedStaff(member); setShowLeaveDetails(true); }}
                            className="text-purple-600 hover:text-purple-800 p-1 transition-colors"
                            title="View Leave"
                          >
                            <Umbrella className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => { setSelectedStaff(member); setShowLoanDetails(true); }}
                            className="text-orange-600 hover:text-orange-800 p-1 transition-colors"
                            title="View Loans"
                          >
                            <HandCoins className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal - Simplified for brevity, but keep existing structure */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {formMode === 'create' ? 'Add New Staff Member' : 'Edit Staff Member'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Personal Information
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input 
                    type="text" 
                    value={formData.first_name} 
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
                    required 
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${validationErrors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.first_name && <p className="text-red-500 text-xs mt-1">{validationErrors.first_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input 
                    type="text" 
                    value={formData.last_name} 
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
                    required 
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${validationErrors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={formData.personal_email} 
                    onChange={(e) => setFormData({...formData, personal_email: e.target.value})} 
                    required 
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${validationErrors.personal_email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {validationErrors.personal_email && <p className="text-red-500 text-xs mt-1">{validationErrors.personal_email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    value={formData.personal_phone} 
                    onChange={(e) => setFormData({...formData, personal_phone: e.target.value})} 
                    required 
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${validationErrors.personal_phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input 
                    type="date" 
                    value={formData.date_of_birth} 
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select 
                    value={formData.gender} 
                    onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input 
                    type="text" 
                    value={formData.national_id} 
                    onChange={(e) => setFormData({...formData, national_id: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                  <select 
                    value={formData.marital_status} 
                    onChange={(e) => setFormData({...formData, marital_status: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {maritalStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Employment Information */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    Employment Information
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select 
                    value={formData.department} 
                    onChange={(e) => setFormData({...formData, department: e.target.value})} 
                    required 
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${validationErrors.department ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation/Role *</label>
                  <input 
                    type="text" 
                    value={formData.designation} 
                    onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                    required 
                    className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 ${validationErrors.designation ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                  <select 
                    value={formData.employment_type} 
                    onChange={(e) => setFormData({...formData, employment_type: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {employmentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary (KES)</label>
                  <input 
                    type="number" 
                    value={formData.basic_salary} 
                    onChange={(e) => setFormData({...formData, basic_salary: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contract End Date</label>
                  <input 
                    type="date" 
                    value={formData.contract_end_date} 
                    onChange={(e) => setFormData({...formData, contract_end_date: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Banking Information */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Banking Information
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                  <select 
                    value={formData.bank_name} 
                    onChange={(e) => setFormData({...formData, bank_name: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Bank</option>
                    {banks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                  <input 
                    type="text" 
                    value={formData.account_number} 
                    onChange={(e) => setFormData({...formData, account_number: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">KRA PIN</label>
                  <input 
                    type="text" 
                    value={formData.kra_pin} 
                    onChange={(e) => setFormData({...formData, kra_pin: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NSSF Number</label>
                  <input 
                    type="text" 
                    value={formData.nssf_no} 
                    onChange={(e) => setFormData({...formData, nssf_no: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NHIF Number</label>
                  <input 
                    type="text" 
                    value={formData.nhif_no} 
                    onChange={(e) => setFormData({...formData, nhif_no: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Emergency Contact */}
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    Emergency Contact
                  </h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                  <input 
                    type="text" 
                    value={formData.emergency_contact_name} 
                    onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Phone</label>
                  <input 
                    type="tel" 
                    value={formData.emergency_contact} 
                    onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})} 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
                  <textarea 
                    value={formData.permanent_address} 
                    onChange={(e) => setFormData({...formData, permanent_address: e.target.value})} 
                    rows="2" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  onClick={() => setShowForm(false)} 
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {formMode === 'create' ? 'Create Staff Member' : 'Update Staff Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {uploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Bulk Staff Upload</h3>
              <button onClick={() => setUploadModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">Upload an Excel file with staff data. Download the template for correct format.</p>
                <button 
                  onClick={downloadTemplate} 
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 mb-4 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Template
                </button>
                <div className="mt-4">
                  <input 
                    type="file" 
                    accept=".xlsx,.xls,.csv" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    className="hidden" 
                    id="file-upload" 
                  />
                  <label 
                    htmlFor="file-upload" 
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Choose File
                  </label>
                  {file && <p className="mt-2 text-sm text-gray-600">Selected: {file.name}</p>}
                </div>
                <div className="mt-6 flex justify-center space-x-3">
                  <button 
                    onClick={() => setUploadModal(false)} 
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleFileUpload} 
                    disabled={!file || loading} 
                    className={`px-4 py-2 rounded-lg text-white transition-colors ${!file || loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload File'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal - Enhanced with more fields */}
      {showDetails && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Staff Details</h2>
              <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                  {selectedStaff.first_name?.[0]}{selectedStaff.last_name?.[0]}
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-gray-900">{selectedStaff.first_name} {selectedStaff.last_name}</h3>
                  <p className="text-gray-600">{selectedStaff.designation || 'N/A'}</p>
                  <p className="text-sm text-gray-500">{selectedStaff.staff_id}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedStaff.status)}`}>
                  {selectedStaff.status || 'N/A'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Date of Birth:</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedStaff.date_of_birth)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Gender:</span>
                      <span className="text-sm text-gray-900">{selectedStaff.gender || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">National ID:</span>
                      <span className="text-sm text-gray-900">{selectedStaff.national_id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Marital Status:</span>
                      <span className="text-sm text-gray-900">{selectedStaff.marital_status || 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" /> Employment Details
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Department:</span>
                      <span className="text-sm text-gray-900">{selectedStaff.department || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Employment Type:</span>
                      <span className="text-sm text-gray-900">{selectedStaff.employment_type || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Basic Salary:</span>
                      <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedStaff.basic_salary)}</span>
                    </div>
                    {selectedStaff.contract_end_date && (
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Contract End:</span>
                        <span className="text-sm text-gray-900">{formatDate(selectedStaff.contract_end_date)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Employment Date:</span>
                      <span className="text-sm text-gray-900">{formatDate(selectedStaff.employment_date)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Contact Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center py-1 border-b border-gray-100">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedStaff.personal_phone || 'N/A'}</span>
                    </div>
                    <div className="flex items-center py-1 border-b border-gray-100">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{selectedStaff.personal_email || 'N/A'}</span>
                    </div>
                    {selectedStaff.permanent_address && (
                      <div className="flex items-start py-1 border-b border-gray-100">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-900">{selectedStaff.permanent_address}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                    <Heart className="w-4 h-4" /> Emergency Contact
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-900"><span className="font-medium">{selectedStaff.emergency_contact_name || 'N/A'}</span></p>
                    <p className="text-sm text-gray-600 mt-1">{selectedStaff.emergency_contact || 'N/A'}</p>
                  </div>
                </div>
                
                {(selectedStaff.bank_name || selectedStaff.account_number) && (
                  <div className="md:col-span-2">
                    <h4 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                      <CreditCard className="w-4 h-4" /> Banking Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Bank Name</p>
                          <p className="text-sm text-gray-900">{selectedStaff.bank_name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Account Number</p>
                          <p className="text-sm text-gray-900">{selectedStaff.account_number || 'N/A'}</p>
                        </div>
                        {selectedStaff.kra_pin && (
                          <div>
                            <p className="text-xs text-gray-500">KRA PIN</p>
                            <p className="text-sm text-gray-900">{selectedStaff.kra_pin}</p>
                          </div>
                        )}
                        {selectedStaff.nssf_no && (
                          <div>
                            <p className="text-xs text-gray-500">NSSF Number</p>
                            <p className="text-sm text-gray-900">{selectedStaff.nssf_no}</p>
                          </div>
                        )}
                        {selectedStaff.nhif_no && (
                          <div>
                            <p className="text-xs text-gray-500">NHIF Number</p>
                            <p className="text-sm text-gray-900">{selectedStaff.nhif_no}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                <button onClick={() => setShowDetails(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Close
                </button>
                <button onClick={() => { handleEdit(selectedStaff); setShowDetails(false); }} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                </button>
                <button onClick={() => { setShowLeaveDetails(true); setShowDetails(false); }} className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  <Umbrella className="w-4 h-4 mr-2" /> View Leave
                </button>
                <button onClick={() => { setShowLoanDetails(true); setShowDetails(false); }} className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
                  <HandCoins className="w-4 h-4 mr-2" /> View Loans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;