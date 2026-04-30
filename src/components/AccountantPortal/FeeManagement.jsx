/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { 
  FiPlus, FiTrash2, FiEdit, FiDollarSign, FiBook, 
  FiLayers, FiSearch, FiDownload, FiFilter, 
  FiCreditCard, FiBarChart2, FiCalendar, FiPercent,
  FiCheckCircle, FiXCircle, FiFileText, FiRefreshCw,
  FiEye, FiPrinter, FiSave, FiX, FiUser, 
  FiTrendingUp, FiTrendingDown, FiLoader,
  FiChevronDown, FiGrid, FiList, FiSettings,
  FiAlertCircle, FiBell, FiCheck, FiInfo, FiFile,
  FiClock, FiLogOut
} from "react-icons/fi";
import { useAuth } from '../Authentication/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-yellow-500'
  };

  const icon = {
    success: <FiCheck className="text-white" size={18} />,
    error: <FiXCircle className="text-white" size={18} />,
    info: <FiInfo className="text-white" size={18} />,
    warning: <FiAlertCircle className="text-white" size={18} />
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${bgColor[type]} text-white border border-gray-600 p-4 min-w-[320px] max-w-md`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 border border-white/30">
              {icon[type]}
            </div>
            <div>
              <p className="font-bold capitalize">{type}</p>
              <p className="text-sm text-white/90 mt-1">{message}</p>
            </div>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white">
            <FiX size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white border border-gray-400 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <FiAlertCircle className="h-8 w-8 text-red-500 mr-3" />
            <h3 className="text-lg font-bold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
              <FiLogOut className="h-4 w-4 inline mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryFormModal = ({ isOpen, onClose, onSubmit, title, children, loading }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        </div>
        <div className="p-6">{children}</div>
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
          <button onClick={onSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold border border-blue-700 hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading && <FiLoader className="animate-spin" />}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const StructureFormModal = ({ isOpen, onClose, onSubmit, title, children, loading }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-400 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
        </div>
        <div className="p-6">{children}</div>
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-300 bg-gray-50 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
          <button onClick={onSubmit} disabled={loading} className="px-4 py-2 bg-purple-600 text-white text-sm font-bold border border-purple-700 hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
            {loading && <FiLoader className="animate-spin" />}
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-400 max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <FiAlertCircle className="h-6 w-6 text-yellow-500 mr-3" />
            <h3 className="text-md font-bold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-gray-700 text-sm font-medium bg-white hover:bg-gray-100">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white text-sm font-bold border border-red-700 hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PrintModal = ({ isOpen, onClose, data, onPrint }) => {
  const printRef = React.useRef();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-gray-400 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-300 bg-gray-100 flex justify-between items-center">
          <h3 className="text-md font-bold text-gray-900">Fee Structure Report</h3>
          <div className="flex gap-2">
            <button onClick={onPrint} className="px-3 py-1 bg-gray-600 text-white text-xs font-medium border border-gray-700 hover:bg-gray-700">
              <FiPrinter size={14} className="inline mr-1" />
              Print
            </button>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-xl font-bold">&times;</button>
          </div>
        </div>
        <div ref={printRef} className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">JAWABU ACADEMY</h1>
            <p className="text-gray-600 mt-2">Fee Structure Report</p>
            <p className="text-gray-500 text-sm">Generated on {new Date(data.generated_date).toLocaleString()}</p>
            <p className="text-gray-500 text-sm">Academic Year: {data.academic_year}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-bold">Class</th>
                  <th className="border border-gray-300 p-3 text-left font-bold">Category</th>
                  <th className="border border-gray-300 p-3 text-left font-bold">Term</th>
                  <th className="border border-gray-300 p-3 text-right font-bold">Amount (KES)</th>
                  <th className="border border-gray-300 p-3 text-left font-bold">Frequency</th>
                  <th className="border border-gray-300 p-3 text-left font-bold">Type</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.structures_by_class || {}).map(([className, structures]) => (
                  <React.Fragment key={className}>
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="border border-gray-300 p-3 font-bold text-gray-800">{className}</td>
                    </tr>
                    {structures.map((structure, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-300 p-3"></td>
                        <td className="border border-gray-300 p-3">{structure.category_name}</td>
                        <td className="border border-gray-300 p-3">{structure.term}</td>
                        <td className="border border-gray-300 p-3 text-right font-bold">{structure.amount.toLocaleString()}</td>
                        <td className="border border-gray-300 p-3 capitalize">{structure.frequency.toLowerCase()}</td>
                        <td className="border border-gray-300 p-3">
                          <span className={`px-2 py-1 text-xs font-medium ${structure.is_mandatory ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                            {structure.is_mandatory ? 'Mandatory' : 'Optional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="border border-gray-300 p-3 font-bold text-right">Total for {className}:</td>
                      <td className="border border-gray-300 p-3 text-right font-bold">{data.total_by_class[className].toLocaleString()}</td>
                      <td colSpan="2" className="border border-gray-300 p-3"></td>
                    </tr>
                  </React.Fragment>
                ))}
                <tr className="bg-gray-200 font-bold">
                  <td colSpan="3" className="border border-gray-300 p-3 text-right text-md">GRAND TOTAL:</td>
                  <td className="border border-gray-300 p-3 text-right text-md">{data.total_overall?.toLocaleString()}</td>
                  <td colSpan="2" className="border border-gray-300 p-3"></td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-300 text-center text-gray-500 text-sm">
            <p>This is a computer-generated report. No signature required.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, subValue, icon: Icon, color }) => {
  const borderColors = {
    blue: 'border-blue-500',
    purple: 'border-purple-500',
    green: 'border-green-500',
    orange: 'border-orange-500'
  };
  
  return (
    <div className={`bg-white border border-gray-300 p-5`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subValue && <p className="text-xs mt-2 text-gray-500">{subValue}</p>}
        </div>
        <div className={`p-3 bg-gray-100 border ${borderColors[color]} border-l-4`}>
          <Icon className={`text-${color}-600 text-xl`} />
        </div>
      </div>
    </div>
  );
};

function FeeManagement() {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
  const [feeCategories, setFeeCategories] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [printData, setPrintData] = useState(null);
  
  const [loading, setLoading] = useState({ categories: false, structures: false, transactions: false, stats: false, classes: false, years: false, form: false });
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  
  const [newCategory, setNewCategory] = useState({
    category_code: "", category_name: "", description: "", frequency: "TERM", is_mandatory: true, is_active: true, gl_account_code: ""
  });
  const [newStructure, setNewStructure] = useState({
    academic_year: "", term: "", class_id: "", category_id: "", amount: "", due_date: "",
    late_fee_percentage: 5, late_fee_after_days: 15, installment_allowed: false, max_installments: 1,
    discount_allowed: false, max_discount_percentage: 0, is_active: true
  });
  const [editingItem, setEditingItem] = useState(null);
  const [editMode, setEditMode] = useState({ category: false, structure: false });
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ academic_year: "", term: "", class_id: "", status: "" });
  const [toasts, setToasts] = useState([]);
  const [statistics, setStatistics] = useState({
    categories: { count: 0, active_count: 0 },
    structures: { total: 0, active_count: 0, total_amount: 0 },
    transactions: { total_transactions: 0, completed_transactions: 0, pending_transactions: 0, total_collected: 0, collection_rate: 0 }
  });

  const frequencies = [
    { value: "Annual", label: "Once per Year" },
    { value: "Termly", label: "Termly (3 times per year)" },
    { value: "Monthly", label: "Monthly" },
    { value: "One-Time", label: "One Time" }
  ];
  const terms = ["Term 1", "Term 2", "Term 3"];

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleApiError = (error) => {
    if (error?.status === 401 || error?.message?.includes('401')) setShowSessionExpired(true);
  };

  const handleLogout = () => { setShowSessionExpired(false); logout(); window.location.href = '/logout'; };

  const fetchClasses = async () => {
    try {
      setLoading(prev => ({ ...prev, classes: true }));
      const res = await fetch(`${API_BASE_URL}/api/registrar/classes/`, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) setClasses(data.data || []);
    } catch (error) { console.error('Error fetching classes:', error); showToast('Failed to load classes', 'error'); }
    finally { setLoading(prev => ({ ...prev, classes: false })); }
  };

  const fetchAcademicYears = async () => {
    try {
      setLoading(prev => ({ ...prev, years: true }));
      const res = await fetch(`${API_BASE_URL}/api/registrar/academic/academic-years/`, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) {
        const years = data.data.map(y => y.year_code);
        setAcademicYears(years);
        if (years.length > 0 && !newStructure.academic_year) setNewStructure(prev => ({ ...prev, academic_year: years[0] }));
      }
    } catch (error) {
      const currentYear = new Date().getFullYear();
      setAcademicYears([`${currentYear}-${currentYear + 1}`]);
    } finally { setLoading(prev => ({ ...prev, years: false })); }
  };

  const fetchFeeCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const res = await fetch(`${API_BASE_URL}/api/accountant/fees/categories/`, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) setFeeCategories(data.data || []);
    } catch (error) { showToast('Failed to load fee categories', 'error'); }
    finally { setLoading(prev => ({ ...prev, categories: false })); }
  };

  const fetchFeeStructures = async () => {
    try {
      setLoading(prev => ({ ...prev, structures: true }));
      let url = `${API_BASE_URL}/api/accountant/fees/structures/`;
      const params = new URLSearchParams();
      if (filters.academic_year) params.append('academic_year', filters.academic_year);
      if (filters.term) params.append('term', filters.term);
      if (filters.class_id) params.append('class_id', filters.class_id);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) setFeeStructures(data.data || []);
    } catch (error) { showToast('Failed to load fee structures', 'error'); }
    finally { setLoading(prev => ({ ...prev, structures: false })); }
  };

  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      let url = `${API_BASE_URL}/api/accountant/fees/transactions/`;
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (filters.status) params.append('status', filters.status);
      if (searchTerm) params.append('search', searchTerm);
      if (params.toString()) url += `?${params.toString()}`;
      
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) setTransactions(data.data || []);
    } catch (error) { showToast('Failed to load transactions', 'error'); }
    finally { setLoading(prev => ({ ...prev, transactions: false })); }
  };

  const fetchStatistics = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      const [catsRes, structRes, transRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/accountant/fees/categories/stats/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/accountant/fees/structures/stats/`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE_URL}/api/accountant/fees/transactions/stats/`, { headers: getAuthHeaders() })
      ]);
      if (catsRes.status === 401 || structRes.status === 401 || transRes.status === 401) { handleApiError({ status: 401 }); return; }
      
      const catsData = await catsRes.json();
      const structData = await structRes.json();
      const transData = await transRes.json();
      
      setStatistics({
        categories: catsData.success ? catsData.data : { count: 0, active_count: 0 },
        structures: structData.success ? structData.data : { total: 0, active_count: 0, total_amount: 0 },
        transactions: transData.success ? transData.data : { total_transactions: 0, completed_transactions: 0, pending_transactions: 0, total_collected: 0, collection_rate: 0 }
      });
    } catch (error) { console.error('Error fetching statistics:', error); }
    finally { setLoading(prev => ({ ...prev, stats: false })); }
  };

  const fetchPrintData = async () => {
    try {
      let url = `${API_BASE_URL}/api/accountant/fees/structures/export/`;
      if (filters.academic_year) url += `?academic_year=${filters.academic_year}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) {
        setPrintData(data.data);
        setShowPrintModal(true);
      } else showToast(data.error || 'Failed to load print data', 'error');
    } catch (error) { showToast('Failed to load print data', 'error'); }
  };

  const fetchAllData = async () => {
    await Promise.all([fetchFeeCategories(), fetchFeeStructures(), fetchTransactions(), fetchStatistics(), fetchClasses(), fetchAcademicYears()]);
    showToast('Data refreshed successfully', 'success');
  };

  useEffect(() => { if (isAuthenticated) fetchAllData(); }, [isAuthenticated]);
  useEffect(() => { if (isAuthenticated) { fetchFeeStructures(); fetchTransactions(); } }, [filters, searchTerm]);

  const handleCreateCategory = async () => {
    const data = editMode.category && editingItem ? editingItem : newCategory;
    setLoading(prev => ({ ...prev, form: true }));
    try {
      const url = editMode.category ? `${API_BASE_URL}/api/accountant/fees/categories/${editingItem.id}/` : `${API_BASE_URL}/api/accountant/fees/categories/create/`;
      const method = editMode.category ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(data) });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const result = await res.json();
      if (result.success) {
        showToast(`Category ${editMode.category ? 'updated' : 'created'} successfully`, 'success');
        setShowCategoryModal(false);
        setEditMode({ ...editMode, category: false });
        setEditingItem(null);
        fetchFeeCategories();
        fetchStatistics();
        setNewCategory({ category_code: "", category_name: "", description: "", frequency: "TERM", is_mandatory: true, is_active: true, gl_account_code: "" });
      } else showToast(result.error || 'Operation failed', 'error');
    } catch (error) { showToast('Failed to save category', 'error'); }
    finally { setLoading(prev => ({ ...prev, form: false })); }
  };

  const handleCreateStructure = async () => {
    const data = editMode.structure && editingItem ? editingItem : newStructure;
    setLoading(prev => ({ ...prev, form: true }));
    try {
      const url = editMode.structure ? `${API_BASE_URL}/api/accountant/fees/structures/${editingItem.id}/` : `${API_BASE_URL}/api/accountant/fees/structures/create/`;
      const method = editMode.structure ? 'PUT' : 'POST';
      const res = await fetch(url, { method, headers: getAuthHeaders(), body: JSON.stringify(data) });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const result = await res.json();
      if (result.success) {
        showToast(`Structure ${editMode.structure ? 'updated' : 'created'} successfully`, 'success');
        setShowStructureModal(false);
        setEditMode({ ...editMode, structure: false });
        setEditingItem(null);
        fetchFeeStructures();
        fetchStatistics();
        setNewStructure({ academic_year: academicYears[0] || "", term: "", class_id: "", category_id: "", amount: "", due_date: "", late_fee_percentage: 5, late_fee_after_days: 15, installment_allowed: false, max_installments: 1, discount_allowed: false, max_discount_percentage: 0, is_active: true });
      } else showToast(result.error || 'Operation failed', 'error');
    } catch (error) { showToast('Failed to save structure', 'error'); }
    finally { setLoading(prev => ({ ...prev, form: false })); }
  };

  const handleDelete = async (type, id) => {
    setLoading(prev => ({ ...prev, form: true }));
    try {
      const url = type === 'category' ? `${API_BASE_URL}/api/accountant/fees/categories/${id}/` : `${API_BASE_URL}/api/accountant/fees/structures/${id}/`;
      const res = await fetch(url, { method: 'DELETE', headers: getAuthHeaders() });
      if (res.status === 401) { handleApiError({ status: 401 }); return; }
      const data = await res.json();
      if (data.success) {
        showToast(`${type} deleted successfully`, 'success');
        if (type === 'category') fetchFeeCategories();
        else fetchFeeStructures();
        fetchStatistics();
      } else showToast(data.error || `Failed to delete ${type}`, 'error');
    } catch (error) { showToast(`Failed to delete ${type}`, 'error'); }
    finally { setLoading(prev => ({ ...prev, form: false })); setDeleteConfirm(null); }
  };

  const handlePrint = () => { window.print(); };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(amount || 0);
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-KE') : 'Not set';

  const getPaymentMethodBadge = (method) => {
    const styles = {
      CASH: "bg-green-100 text-green-800 border-green-300",
      MPESA: "bg-blue-100 text-blue-800 border-blue-300",
      BANK_TRANSFER: "bg-purple-100 text-purple-800 border-purple-300",
      CHEQUE: "bg-yellow-100 text-yellow-800 border-yellow-300",
      CREDIT_CARD: "bg-red-100 text-red-800 border-red-300"
    };
    return `px-2 py-1 text-xs font-medium border ${styles[method] || styles.CASH}`;
  };

  const filteredCategories = useMemo(() => {
    return feeCategories.filter(c => searchTerm === "" || c.category_code?.toLowerCase().includes(searchTerm.toLowerCase()) || c.category_name?.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [feeCategories, searchTerm]);

  const filteredStructures = useMemo(() => {
    return feeStructures.filter(s => {
      const matchesSearch = searchTerm === "" || s.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.class_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = !filters.academic_year || s.academic_year === filters.academic_year;
      const matchesTerm = !filters.term || s.term === filters.term;
      const matchesClass = !filters.class_id || s.class_id == filters.class_id;
      return matchesSearch && matchesYear && matchesTerm && matchesClass;
    });
  }, [feeStructures, searchTerm, filters]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <FiAlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
          <p className="text-gray-600 mt-2 mb-6">Please login to access fee management</p>
          <a href="/login" className="px-6 py-3 bg-blue-600 text-white font-medium border border-blue-700 inline-block hover:bg-blue-700">Go to Login</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
      `}</style>

      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />)}

      {/* Header */}
      <div className="bg-green-700 p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-600 border border-green-500">
              <FiDollarSign className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Fee Management</h1>
              <p className="text-green-100 text-sm">Accountant Portal • Manage fee categories and structures</p>
              <p className="text-xs text-green-200 mt-1">{user?.first_name} {user?.last_name} • {user?.role}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchAllData} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
              <FiRefreshCw className={loading.stats ? 'animate-spin inline mr-2' : 'inline mr-2'} />
              Refresh
            </button>
            <button onClick={fetchPrintData} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700">
              <FiPrinter className="inline mr-2" />
              Print Fee Structure
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard title="Fee Categories" value={statistics.categories.count} subValue={`${statistics.categories.active_count} active`} icon={FiBook} color="blue" />
          <StatCard title="Fee Structures" value={statistics.structures.total} subValue={formatCurrency(statistics.structures.total_amount)} icon={FiLayers} color="purple" />
          <StatCard title="Total Transactions" value={statistics.transactions.total_transactions} subValue={`${statistics.transactions.completed_transactions} completed`} icon={FiCreditCard} color="green" />
          <StatCard title="Collection Rate" value={`${statistics.transactions.collection_rate}%`} subValue={`Collected: ${formatCurrency(statistics.transactions.total_collected)}`} icon={FiBarChart2} color="orange" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="border-l-4 border-green-500 pl-3 mb-4">
            <h3 className="text-md font-bold text-gray-900">Quick Actions</h3>
            <p className="text-xs text-gray-600">Common accountant tools</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { setShowCategoryModal(true); setEditMode({ ...editMode, category: false }); setNewCategory({ category_code: "", category_name: "", description: "", frequency: "TERM", is_mandatory: true, is_active: true, gl_account_code: "" }); }} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium border border-blue-700 hover:bg-blue-700">
              <FiPlus className="inline mr-2" /> New Category
            </button>
            <button onClick={() => { setShowStructureModal(true); setEditMode({ ...editMode, structure: false }); setNewStructure({ academic_year: academicYears[0] || "", term: "", class_id: "", category_id: "", amount: "", due_date: "", late_fee_percentage: 5, late_fee_after_days: 15, installment_allowed: false, max_installments: 1, discount_allowed: false, max_discount_percentage: 0, is_active: true }); }} className="px-4 py-2 bg-purple-600 text-white text-sm font-medium border border-purple-700 hover:bg-purple-700">
              <FiPlus className="inline mr-2" /> New Structure
            </button>
            <button onClick={() => setActiveTab('transactions')} className="px-4 py-2 bg-green-600 text-white text-sm font-medium border border-green-700 hover:bg-green-700">
              <FiEye className="inline mr-2" /> View Transactions
            </button>
            <button onClick={fetchPrintData} className="px-4 py-2 bg-yellow-600 text-white text-sm font-medium border border-yellow-700 hover:bg-yellow-700">
              <FiPrinter className="inline mr-2" /> Print Report
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-300 mb-6">
          <div className="flex gap-6">
            {['dashboard', 'categories', 'structures', 'transactions'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`py-2 px-1 font-medium text-sm border-b-2 transition-colors capitalize flex items-center gap-2 ${activeTab === tab ? 'border-green-700 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                {tab === 'dashboard' && <FiGrid size={14} />}{tab === 'categories' && <FiBook size={14} />}{tab === 'structures' && <FiLayers size={14} />}{tab === 'transactions' && <FiCreditCard size={14} />}
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-gray-300 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" size={16} />
              <input type="text" placeholder="Search by name, code, class..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-400 text-sm bg-white" />
            </div>
            <select className="border border-gray-400 px-3 py-2 text-sm bg-white" value={filters.academic_year} onChange={(e) => setFilters({...filters, academic_year: e.target.value})}>
              <option value="">All Years</option>
              {academicYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="border border-gray-400 px-3 py-2 text-sm bg-white" value={filters.term} onChange={(e) => setFilters({...filters, term: e.target.value})}>
              <option value="">All Terms</option>
              {terms.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select className="border border-gray-400 px-3 py-2 text-sm bg-white" value={filters.class_id} onChange={(e) => setFilters({...filters, class_id: e.target.value})}>
              <option value="">All Classes</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.class_name} ({c.class_code})</option>)}
            </select>
            {activeTab === 'transactions' && (
              <select className="border border-gray-400 px-3 py-2 text-sm bg-white" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}>
                <option value="">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
              </select>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <h3 className="text-md font-bold text-gray-900 mb-4">Overview Dashboard</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Recent Fee Structures</h4>
                  {feeStructures.slice(0, 5).map(s => (
                    <div key={s.id} className="bg-white border border-gray-200 p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div><p className="font-bold">{s.category_name}</p><p className="text-xs text-gray-600">{s.class_name} • {s.academic_year}</p></div>
                        <div className="text-right"><p className="font-bold">{formatCurrency(s.amount)}</p><span className={`text-xs px-2 py-1 border ${s.is_active ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2"><FiCalendar size={12} /> Due: {formatDate(s.due_date)}<span className="h-1 w-1 bg-gray-300 rounded-full"></span>{s.term}</div>
                    </div>
                  ))}
                  {feeStructures.length === 0 && <p className="text-center text-gray-500 py-8">No fee structures created yet</p>}
                </div>
                <div className="bg-gray-50 border border-gray-300 p-4">
                  <h4 className="font-bold text-gray-800 mb-3">Recent Transactions</h4>
                  {transactions.slice(0, 5).map(t => (
                    <div key={t.id} className="bg-white border border-gray-200 p-3 mb-2">
                      <div className="flex justify-between items-start">
                        <div><p className="font-bold">{t.admission_no}</p><p className="text-xs text-gray-600">{t.first_name} {t.last_name}</p></div>
                        <div className="text-right"><p className="font-bold">{formatCurrency(t.amount_kes)}</p><span className={getPaymentMethodBadge(t.payment_mode)}>{t.payment_mode}</span></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center justify-between"><span>{t.transaction_no}</span><span>{formatDate(t.payment_date)}</span></div>
                    </div>
                  ))}
                  {transactions.length === 0 && <p className="text-center text-gray-500 py-8">No transactions recorded yet</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div>
              <div className="p-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <div><h3 className="font-bold text-gray-900">Fee Categories</h3><p className="text-xs text-gray-600">Manage fee categories and their frequency</p></div>
                <button onClick={() => { setShowCategoryModal(true); setEditMode({ ...editMode, category: false }); setNewCategory({ category_code: "", category_name: "", description: "", frequency: "TERM", is_mandatory: true, is_active: true, gl_account_code: "" }); }} className="px-3 py-1 bg-blue-600 text-white text-xs font-medium border border-blue-700 hover:bg-blue-700"><FiPlus className="inline mr-1" size={12} /> Add Category</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr><th className="border border-gray-300 px-4 py-2 text-left font-bold">Code</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Name</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Frequency</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Type</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Status</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCategories.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2"><code className="text-blue-600 font-mono text-xs bg-blue-50 px-2 py-1 border border-blue-200">{c.category_code}</code></td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">{c.category_name}</td>
                        <td className="border border-gray-300 px-4 py-2 capitalize">{c.frequency?.toLowerCase()}</td>
                        <td className="border border-gray-300 px-4 py-2"><span className={`px-2 py-1 text-xs font-medium border ${c.is_mandatory ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300'}`}>{c.is_mandatory ? 'Mandatory' : 'Optional'}</span></td>
                        <td className="border border-gray-300 px-4 py-2"><span className={`px-2 py-1 text-xs font-medium border ${c.is_active ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className="border border-gray-300 px-4 py-2"><div className="flex gap-2"><button onClick={() => { setEditingItem(c); setEditMode({ ...editMode, category: true }); setShowCategoryModal(true); }} className="text-blue-600 hover:text-blue-800"><FiEdit size={16} /></button><button onClick={() => setDeleteConfirm({ type: 'category', id: c.id, name: c.category_name })} className="text-red-600 hover:text-red-800"><FiTrash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                    {filteredCategories.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No fee categories found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'structures' && (
            <div>
              <div className="p-4 border-b border-gray-300 bg-gray-50 flex justify-between items-center">
                <div><h3 className="font-bold text-gray-900">Fee Structures</h3><p className="text-xs text-gray-600">Configure fee structures for different academic periods</p></div>
                <button onClick={() => { setShowStructureModal(true); setEditMode({ ...editMode, structure: false }); setNewStructure({ academic_year: academicYears[0] || "", term: "", class_id: "", category_id: "", amount: "", due_date: "", late_fee_percentage: 5, late_fee_after_days: 15, installment_allowed: false, max_installments: 1, discount_allowed: false, max_discount_percentage: 0, is_active: true }); }} className="px-3 py-1 bg-purple-600 text-white text-xs font-medium border border-purple-700 hover:bg-purple-700"><FiPlus className="inline mr-1" size={12} /> Add Structure</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr><th className="border border-gray-300 px-4 py-2 text-left font-bold">Year/Term</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Class</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Category</th><th className="border border-gray-300 px-4 py-2 text-right font-bold">Amount</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Due Date</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Status</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Actions</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredStructures.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2"><div><p className="font-bold">{s.academic_year}</p><p className="text-xs text-gray-500">{s.term}</p></div></td>
                        <td className="border border-gray-300 px-4 py-2"><div><p className="font-bold">{s.class_name}</p><p className="text-xs text-gray-500">Level {s.numeric_level}</p></div></td>
                        <td className="border border-gray-300 px-4 py-2"><div><p className="font-bold">{s.category_name}</p><p className="text-xs text-gray-500">{s.category_code}</p></div></td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-bold">{formatCurrency(s.amount)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">{formatDate(s.due_date)}</td>
                        <td className="border border-gray-300 px-4 py-2"><span className={`px-2 py-1 text-xs font-medium border ${s.is_active ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                        <td className="border border-gray-300 px-4 py-2"><div className="flex gap-2"><button onClick={() => { setEditingItem(s); setEditMode({ ...editMode, structure: true }); setShowStructureModal(true); }} className="text-blue-600 hover:text-blue-800"><FiEdit size={16} /></button><button onClick={() => setDeleteConfirm({ type: 'structure', id: s.id, name: `${s.category_name} - ${s.class_name}` })} className="text-red-600 hover:text-red-800"><FiTrash2 size={16} /></button></div></td>
                      </tr>
                    ))}
                    {filteredStructures.length === 0 && <tr><td colSpan="7" className="text-center py-8 text-gray-500">No fee structures found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div>
              <div className="p-4 border-b border-gray-300 bg-gray-50"><h3 className="font-bold text-gray-900">Fee Transactions</h3><p className="text-xs text-gray-600">View all fee payments processed</p></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50">
                    <tr><th className="border border-gray-300 px-4 py-2 text-left font-bold">Transaction No</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Student</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Date</th><th className="border border-gray-300 px-4 py-2 text-right font-bold">Amount</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Method</th><th className="border border-gray-300 px-4 py-2 text-left font-bold">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map(t => (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-mono text-blue-600 font-bold">{t.transaction_no}</td>
                        <td className="border border-gray-300 px-4 py-2"><div><p className="font-bold">{t.first_name} {t.last_name}</p><p className="text-xs text-gray-500">{t.admission_no}</p></div></td>
                        <td className="border border-gray-300 px-4 py-2">{formatDate(t.payment_date)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right font-bold">{formatCurrency(t.amount_kes)}</td>
                        <td className="border border-gray-300 px-4 py-2"><span className={getPaymentMethodBadge(t.payment_mode)}>{t.payment_mode}</span></td>
                        <td className="border border-gray-300 px-4 py-2"><span className={`px-2 py-1 text-xs font-medium border ${t.status === 'COMPLETED' ? 'bg-green-100 text-green-800 border-green-300' : t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-blue-100 text-blue-800 border-blue-300'}`}>{t.status}</span></td>
                      </tr>
                    ))}
                    {transactions.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-gray-500">No transactions found</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CategoryFormModal isOpen={showCategoryModal} onClose={() => { setShowCategoryModal(false); setEditMode({ ...editMode, category: false }); setEditingItem(null); }} onSubmit={handleCreateCategory} title={editMode.category ? "Edit Fee Category" : "Create New Fee Category"} loading={loading.form}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Category Code *</label><input type="text" value={editMode.category ? editingItem?.category_code : newCategory.category_code} onChange={e => editMode.category ? setEditingItem({...editingItem, category_code: e.target.value.toUpperCase()}) : setNewCategory({...newCategory, category_code: e.target.value.toUpperCase()})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" placeholder="TUIT001" /></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Category Name *</label><input type="text" value={editMode.category ? editingItem?.category_name : newCategory.category_name} onChange={e => editMode.category ? setEditingItem({...editingItem, category_name: e.target.value}) : setNewCategory({...newCategory, category_name: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" placeholder="Tuition Fee" /></div>
          </div>
          <div><label className="block text-sm font-bold text-gray-700 mb-1">Description</label><textarea value={editMode.category ? editingItem?.description : newCategory.description} onChange={e => editMode.category ? setEditingItem({...editingItem, description: e.target.value}) : setNewCategory({...newCategory, description: e.target.value})} rows="2" className="w-full px-3 py-2 border border-gray-400 text-sm bg-white resize-none" placeholder="Brief description..." /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Frequency</label><select value={editMode.category ? editingItem?.frequency : newCategory.frequency} onChange={e => editMode.category ? setEditingItem({...editingItem, frequency: e.target.value}) : setNewCategory({...newCategory, frequency: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="">Select Frequency</option>{frequencies.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">GL Account Code</label><input type="text" value={editMode.category ? editingItem?.gl_account_code : newCategory.gl_account_code} onChange={e => editMode.category ? setEditingItem({...editingItem, gl_account_code: e.target.value}) : setNewCategory({...newCategory, gl_account_code: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" placeholder="4101" /></div>
          </div>
          <div className="border border-gray-300 p-4 space-y-3">
            <label className="flex items-center justify-between cursor-pointer"><div className="flex items-center gap-2"><div className={`w-4 h-4 border flex items-center justify-center ${(editMode.category ? editingItem?.is_mandatory : newCategory.is_mandatory) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>{(editMode.category ? editingItem?.is_mandatory : newCategory.is_mandatory) && <FiCheck className="text-white" size={10} />}</div><span className="text-sm font-medium">Mandatory Fee</span></div><input type="checkbox" checked={editMode.category ? editingItem?.is_mandatory : newCategory.is_mandatory} onChange={e => editMode.category ? setEditingItem({...editingItem, is_mandatory: e.target.checked}) : setNewCategory({...newCategory, is_mandatory: e.target.checked})} className="sr-only" /></label>
            <label className="flex items-center justify-between cursor-pointer"><div className="flex items-center gap-2"><div className={`w-4 h-4 border flex items-center justify-center ${(editMode.category ? editingItem?.is_active : newCategory.is_active) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>{(editMode.category ? editingItem?.is_active : newCategory.is_active) && <FiCheck className="text-white" size={10} />}</div><span className="text-sm font-medium">Active Status</span></div><input type="checkbox" checked={editMode.category ? editingItem?.is_active : newCategory.is_active} onChange={e => editMode.category ? setEditingItem({...editingItem, is_active: e.target.checked}) : setNewCategory({...newCategory, is_active: e.target.checked})} className="sr-only" /></label>
          </div>
        </div>
      </CategoryFormModal>

      <StructureFormModal isOpen={showStructureModal} onClose={() => { setShowStructureModal(false); setEditMode({ ...editMode, structure: false }); setEditingItem(null); }} onSubmit={handleCreateStructure} title={editMode.structure ? "Edit Fee Structure" : "Create New Fee Structure"} loading={loading.form}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Academic Year *</label><select value={editMode.structure ? editingItem?.academic_year : newStructure.academic_year} onChange={e => editMode.structure ? setEditingItem({...editingItem, academic_year: e.target.value}) : setNewStructure({...newStructure, academic_year: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="">Select Year</option>{academicYears.map(y => <option key={y} value={y}>{y}</option>)}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Term *</label><select value={editMode.structure ? editingItem?.term : newStructure.term} onChange={e => editMode.structure ? setEditingItem({...editingItem, term: e.target.value}) : setNewStructure({...newStructure, term: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="">Select Term</option>{terms.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Class *</label><select value={editMode.structure ? editingItem?.class_id : newStructure.class_id} onChange={e => editMode.structure ? setEditingItem({...editingItem, class_id: e.target.value}) : setNewStructure({...newStructure, class_id: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="">Select Class</option>{classes.map(c => <option key={c.id} value={c.id}>{c.class_name} ({c.class_code})</option>)}</select></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Fee Category *</label><select value={editMode.structure ? editingItem?.category_id : newStructure.category_id} onChange={e => editMode.structure ? setEditingItem({...editingItem, category_id: e.target.value}) : setNewStructure({...newStructure, category_id: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white"><option value="">Select Category</option>{feeCategories.filter(c => c.is_active).map(c => <option key={c.id} value={c.id}>{c.category_name} ({c.category_code})</option>)}</select></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Amount (KES) *</label><div className="relative"><span className="absolute left-3 top-2 text-gray-500">KES</span><input type="number" value={editMode.structure ? editingItem?.amount : newStructure.amount} onChange={e => editMode.structure ? setEditingItem({...editingItem, amount: parseFloat(e.target.value) || 0}) : setNewStructure({...newStructure, amount: parseFloat(e.target.value) || 0})} className="w-full pl-14 pr-3 py-2 border border-gray-400 text-sm bg-white" placeholder="0.00" step="0.01" /></div></div>
            <div><label className="block text-sm font-bold text-gray-700 mb-1">Due Date *</label><input type="date" value={editMode.structure ? editingItem?.due_date : newStructure.due_date} onChange={e => editMode.structure ? setEditingItem({...editingItem, due_date: e.target.value}) : setNewStructure({...newStructure, due_date: e.target.value})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" /></div>
          </div>
          <div className="border border-yellow-300 bg-yellow-50 p-4">
            <h5 className="text-sm font-bold text-yellow-800 mb-3 flex items-center gap-2"><FiAlertCircle className="text-yellow-600" /> Late Fee Configuration</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">Late Fee Percentage</label><div className="relative"><input type="number" value={editMode.structure ? editingItem?.late_fee_percentage : newStructure.late_fee_percentage} onChange={e => editMode.structure ? setEditingItem({...editingItem, late_fee_percentage: parseFloat(e.target.value) || 0}) : setNewStructure({...newStructure, late_fee_percentage: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white pr-12" step="0.01" min="0" max="100" /><span className="absolute right-3 top-2 text-amber-600">%</span></div></div>
              <div><label className="block text-sm font-medium mb-1">Apply After (Days)</label><input type="number" value={editMode.structure ? editingItem?.late_fee_after_days : newStructure.late_fee_after_days} onChange={e => editMode.structure ? setEditingItem({...editingItem, late_fee_after_days: parseInt(e.target.value) || 0}) : setNewStructure({...newStructure, late_fee_after_days: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white" min="0" /></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-300 bg-green-50 p-4">
              <label className="flex items-center justify-between cursor-pointer"><div className="flex items-center gap-2"><div className={`w-4 h-4 border flex items-center justify-center ${(editMode.structure ? editingItem?.installment_allowed : newStructure.installment_allowed) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>{(editMode.structure ? editingItem?.installment_allowed : newStructure.installment_allowed) && <FiCheck className="text-white" size={10} />}</div><span className="text-sm font-medium">Allow Installments</span></div><input type="checkbox" checked={editMode.structure ? editingItem?.installment_allowed : newStructure.installment_allowed} onChange={e => editMode.structure ? setEditingItem({...editingItem, installment_allowed: e.target.checked}) : setNewStructure({...newStructure, installment_allowed: e.target.checked})} className="sr-only" /></label>
              {(editMode.structure ? editingItem?.installment_allowed : newStructure.installment_allowed) && <div className="mt-3 ml-6"><label className="block text-sm font-medium mb-1">Maximum Installments</label><div className="relative"><input type="number" value={editMode.structure ? editingItem?.max_installments : newStructure.max_installments} onChange={e => editMode.structure ? setEditingItem({...editingItem, max_installments: parseInt(e.target.value) || 1}) : setNewStructure({...newStructure, max_installments: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white pr-12" min="1" max="12" /><span className="absolute right-3 top-2 text-gray-500 text-sm">months</span></div></div>}
            </div>
            <div className="border border-cyan-300 bg-cyan-50 p-4">
              <label className="flex items-center justify-between cursor-pointer"><div className="flex items-center gap-2"><div className={`w-4 h-4 border flex items-center justify-center ${(editMode.structure ? editingItem?.discount_allowed : newStructure.discount_allowed) ? 'bg-cyan-500 border-cyan-500' : 'border-gray-400'}`}>{(editMode.structure ? editingItem?.discount_allowed : newStructure.discount_allowed) && <FiCheck className="text-white" size={10} />}</div><span className="text-sm font-medium">Allow Discounts</span></div><input type="checkbox" checked={editMode.structure ? editingItem?.discount_allowed : newStructure.discount_allowed} onChange={e => editMode.structure ? setEditingItem({...editingItem, discount_allowed: e.target.checked}) : setNewStructure({...newStructure, discount_allowed: e.target.checked})} className="sr-only" /></label>
              {(editMode.structure ? editingItem?.discount_allowed : newStructure.discount_allowed) && <div className="mt-3 ml-6"><label className="block text-sm font-medium mb-1">Maximum Discount</label><div className="relative"><input type="number" value={editMode.structure ? editingItem?.max_discount_percentage : newStructure.max_discount_percentage} onChange={e => editMode.structure ? setEditingItem({...editingItem, max_discount_percentage: parseFloat(e.target.value) || 0}) : setNewStructure({...newStructure, max_discount_percentage: parseFloat(e.target.value) || 0})} className="w-full px-3 py-2 border border-gray-400 text-sm bg-white pr-12" step="0.01" min="0" max="100" /><span className="absolute right-3 top-2 text-cyan-600">%</span></div></div>}
            </div>
          </div>
          <div className="border border-gray-300 p-4">
            <label className="flex items-center justify-between cursor-pointer"><div className="flex items-center gap-2"><div className={`w-4 h-4 border flex items-center justify-center ${(editMode.structure ? editingItem?.is_active : newStructure.is_active) ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>{(editMode.structure ? editingItem?.is_active : newStructure.is_active) && <FiCheck className="text-white" size={10} />}</div><span className="text-sm font-medium">Active Status</span></div><input type="checkbox" checked={editMode.structure ? editingItem?.is_active : newStructure.is_active} onChange={e => editMode.structure ? setEditingItem({...editingItem, is_active: e.target.checked}) : setNewStructure({...newStructure, is_active: e.target.checked})} className="sr-only" /></label>
          </div>
        </div>
      </StructureFormModal>

      <ConfirmModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={() => handleDelete(deleteConfirm.type, deleteConfirm.id)} title="Delete Item" message={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`} />

      {printData && <PrintModal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} data={printData} onPrint={handlePrint} />}
    </div>
  );
}

export default FeeManagement;