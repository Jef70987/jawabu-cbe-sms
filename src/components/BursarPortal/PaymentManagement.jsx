/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  User,
  DollarSign,
  CreditCard,
  Printer,
  Loader2,
  X,
  ChevronRight,
  Receipt,
  BookOpen,
  AlertCircle,
  Check,
  FileText,
  Calculator,
  RefreshCw,
  Filter,
  Clock,
  LogOut,
  Users,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "../Authentication/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const Toast = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);
  const styles = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-600",
  };
  if (!isVisible) return null;
  return (
    <div className="fixed top-6 right-6 z-50">
      <div
        className={`${styles[type]} text-white shadow-lg p-4 min-w-[280px] max-w-md`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium capitalize text-sm">{type}</p>
            <p className="text-sm text-white/90 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Session Expired
            </h3>
          </div>
          <p className="text-gray-600 mb-6">
            Your session has expired. Please log in again to continue.
          </p>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Log In Again
          </button>
        </div>
      </div>
    </div>
  );
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Confirm Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentSelectionModal = ({
  isOpen,
  onClose,
  students,
  onSelect,
  loading,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Select Student
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="space-y-2">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => onSelect(student)}
                  className="p-4 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Admission: {student.admission_no}
                      </p>
                    </div>
                    <ChevronRight className="text-gray-400" />
                  </div>
                </div>
              ))}
              {students.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No students found in this class
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReceiptModal = ({
  isOpen,
  onClose,
  transaction,
  student,
  formatCurrency,
  currentClass,
  invoices,
}) => {
  if (!isOpen || !transaction || !student) return null;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const academicYear = `${currentYear}-${currentYear + 1}`;
  const term = "Term 1";
  const amountPaid = transaction.amount_kes || 0;
  const receiptNo = transaction.transaction_no;
  const payMethod = transaction.payment_mode || "CASH";
  const payRef = transaction.payment_reference || "N/A";
  const previousBalance = transaction.previous_balance || 0;
  const newBalance = previousBalance - amountPaid;
  const balanceDescription =
    previousBalance < 0 ? "Credit Balance" : "Outstanding Balance";
  const newBalanceDescription =
    newBalance < 0 ? "Credit Balance" : "Outstanding Balance";

  const printReceipt = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (!printWindow) return;
    printWindow.document.write(
      `<!DOCTYPE html><html><head><title>Payment Receipt - ${student.admission_no}</title><meta charset="UTF-8"><style>* { margin: 0; padding: 0; box-sizing: border-box; } body { font-family: Arial, sans-serif; font-size: 12px; padding: 10px; } .receipt { border: 2px solid #1e40af; padding: 15px; } .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #1e40af; padding-bottom: 10px; } .school-name { font-size: 22px; font-weight: bold; color: #1e40af; } table { width: 100%; border-collapse: collapse; margin: 10px 0; } th, td { border: 1px solid #000; padding: 8px; text-align: left; } th { background: #f3f4f6; } .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #666; }</style></head><body><div class="receipt"><div class="header"><div class="school-name">JAWABU SCHOOL</div><div>OFFICIAL FEE PAYMENT RECEIPT</div><div>Receipt No: ${receiptNo} | Date: ${currentDate.toLocaleString()}</div></div><table><tr><td><strong>Student:</strong> ${student.first_name} ${student.last_name}</td><td><strong>Admission No:</strong> ${student.admission_no}</td></tr><tr><td><strong>Class:</strong> ${currentClass || student.class_name}</td><td><strong>Term:</strong> ${term}</td></tr></table><table><thead><tr><th>Description</th><th>Method</th><th>Reference</th><th>Amount (KSh)</th></tr></thead><tbody><tr><td>School Fee Payment</td><td>${payMethod}</td><td>${payRef}</td><td>${amountPaid.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</td></tr></tbody></table><table><tbody><tr><td>Previous ${balanceDescription}</td><td>${Math.abs(previousBalance).toLocaleString("en-KE", { minimumFractionDigits: 2 })}</td></tr><tr><td>Amount Paid</td><td>${amountPaid.toLocaleString("en-KE", { minimumFractionDigits: 2 })}</td></tr><tr><td><strong>New ${newBalanceDescription}</strong></td><td><strong>${Math.abs(newBalance).toLocaleString("en-KE", { minimumFractionDigits: 2 })}</strong></td></tr></tbody></table><div class="footer"><p>*** Official computer-generated receipt ***</p><p>Thank you for your payment.</p></div></div><script>window.onload=function(){setTimeout(function(){window.print();},500);}</script></body></html>`,
    );
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            Payment Receipt
          </h3>
          <div className="flex gap-2">
            <button
              onClick={printReceipt}
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Printer size={16} /> Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-bold text-blue-700">JAWABU SCHOOL</h2>
            <p className="text-gray-600 italic text-sm">
              Striving for Excellence
            </p>
            <p className="text-lg font-bold text-gray-800 mt-2">
              OFFICIAL FEE PAYMENT RECEIPT
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Receipt No:{" "}
              <span className="font-mono font-bold">{receiptNo}</span>
            </p>
            <p className="text-sm text-gray-500">
              Date: {currentDate.toLocaleString()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 border border-gray-200">
            <div>
              <span className="text-gray-600 text-sm">Student Name:</span>{" "}
              <span className="font-semibold text-sm">
                {student.first_name} {student.last_name}
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Admission No:</span>{" "}
              <span className="font-semibold text-sm">
                {student.admission_no}
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Class:</span>{" "}
              <span className="font-semibold text-sm">
                {currentClass || student.class_name}
              </span>
            </div>
            <div>
              <span className="text-gray-600 text-sm">Payment Method:</span>{" "}
              <span className="font-semibold text-sm">{payMethod}</span>
            </div>
            {payRef !== "N/A" && (
              <div className="col-span-2">
                <span className="text-gray-600 text-sm">Reference:</span>{" "}
                <span className="font-semibold text-sm">{payRef}</span>
              </div>
            )}
          </div>

          {invoices && invoices.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
                Invoice Details
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-800">
                      <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                        Invoice No
                      </th>
                      <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                        Date
                      </th>
                      <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                        Due Date
                      </th>
                      <th className="border border-gray-600 p-2 text-right text-white text-xs font-semibold">
                        Total
                      </th>
                      <th className="border border-gray-600 p-2 text-right text-white text-xs font-semibold">
                        Paid
                      </th>
                      <th className="border border-gray-600 p-2 text-right text-white text-xs font-semibold">
                        Balance
                      </th>
                      <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-2 font-mono text-xs">
                          {inv.invoice_no}
                        </td>
                        <td className="border border-gray-200 p-2 text-xs">
                          {new Date(inv.invoice_date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 p-2 text-xs">
                          {new Date(inv.due_date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-200 p-2 text-right text-xs">
                          {formatCurrency(inv.total_amount)}
                        </td>
                        <td className="border border-gray-200 p-2 text-right text-xs text-green-600">
                          {formatCurrency(inv.amount_paid)}
                        </td>
                        <td
                          className={`border border-gray-200 p-2 text-right text-xs font-bold ${parseFloat(inv.balance_amount) < 0 ? "text-green-600" : parseFloat(inv.balance_amount) > 0 ? "text-red-600" : ""}`}
                        >
                          {formatCurrency(inv.balance_amount)}
                        </td>
                        <td className="border border-gray-200 p-2">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium ${inv.payment_status === "PAID" ? "bg-green-100 text-green-800" : inv.payment_status === "PARTIAL" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                          >
                            {inv.payment_status || inv.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Payment Details
            </h4>
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                    Description
                  </th>
                  <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                    Method
                  </th>
                  <th className="border border-gray-600 p-2 text-left text-white text-xs font-semibold">
                    Reference
                  </th>
                  <th className="border border-gray-600 p-2 text-right text-white text-xs font-semibold">
                    Amount (KES)
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2">
                    School Fee Payment - {term} {academicYear}
                  </td>
                  <td className="border border-gray-200 p-2">{payMethod}</td>
                  <td className="border border-gray-200 p-2">{payRef}</td>
                  <td className="border border-gray-200 p-2 text-right font-bold">
                    {formatCurrency(amountPaid)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td
                    colSpan="3"
                    className="border border-gray-200 p-2 font-bold"
                  >
                    TOTAL PAID
                  </td>
                  <td className="border border-gray-200 p-2 text-right font-bold text-green-700">
                    {formatCurrency(amountPaid)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wide">
              Balance Calculation
            </h4>
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr>
                  <td className="border border-gray-200 p-2 font-semibold">
                    Previous {balanceDescription}
                  </td>
                  <td
                    className={`border border-gray-200 p-2 text-right font-bold ${previousBalance < 0 ? "text-green-600" : previousBalance > 0 ? "text-red-600" : ""}`}
                  >
                    {formatCurrency(previousBalance)}
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-200 p-2 font-semibold">
                    Amount Paid
                  </td>
                  <td className="border border-gray-200 p-2 text-right font-bold text-blue-600">
                    - {formatCurrency(amountPaid)}
                  </td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-200 p-2 font-bold">
                    NEW {newBalanceDescription}
                  </td>
                  <td
                    className={`border border-gray-200 p-2 text-right font-bold text-base ${newBalance < 0 ? "text-green-600" : newBalance > 0 ? "text-red-600" : ""}`}
                  >
                    {formatCurrency(newBalance)}
                  </td>
                </tr>
              </tbody>
            </table>
            {newBalance < 0 && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 text-green-700 text-sm">
                Note: Credit balance of {formatCurrency(Math.abs(newBalance))}{" "}
                will be carried forward to next term.
              </div>
            )}
          </div>

          <div className="text-center text-sm text-gray-500 mt-6 pt-4 border-t border-gray-200">
            <p>
              Thank you for your payment. Keep this receipt for your records.
            </p>
            <p>
              © {new Date().getFullYear()} Jawabu School - Striving for
              Excellence
            </p>
          </div>
        </div>
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBadge = ({ label, value, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-100 text-green-700 border-green-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
  };
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border ${colorClasses[color]}`}
    >
      <Icon className="w-5 h-5" />
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
    </div>
  );
};

const PaymentManagement = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  const [searchMode, setSearchMode] = useState("admission");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentBalance, setStudentBalance] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [paymentReference, setPaymentReference] = useState("");
  const [mobileMoneyNo, setMobileMoneyNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [chequeNo, setChequeNo] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [isCheckingInvoice, setIsCheckingInvoice] = useState(false);
  const [currentClass, setCurrentClass] = useState("");

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      5000,
    );
  };

  const handleApiError = (error) => {
    if (error?.status === 401 || error?.message?.includes("Unauthorized"))
      setShowSessionExpired(true);
  };
  const handleLogout = () => {
    setShowSessionExpired(false);
    logout();
    window.location.href = "/logout";
  };

  const fetchClasses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/registrar/classes/`, {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) setClasses(data.data || []);
    } catch {
      showToast("Failed to load classes", "error");
    }
  };

  const fetchRecentTransactions = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/transactions/recent/?limit=5`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) setRecentTransactions(data.data || []);
    } catch {
      console.error("Error fetching transactions");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchClasses();
      fetchRecentTransactions();
    }
  }, [isAuthenticated]);

  const searchByAdmission = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter admission number", "warning");
      return;
    }
    const admissionRegex = /^[A-Za-z0-9-]+$/;
    if (!admissionRegex.test(searchQuery.trim())) {
      showToast("Invalid admission number format", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/students/search/?admission_no=${searchQuery.trim()}`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        const student = data.data[0];
        setSelectedStudent(student);
        setCurrentClass(student.class_name || "");
        await checkStudentInvoice(student.id);
        setStudents([]);
        setSearchQuery("");
      } else showToast("Student not found", "error");
    } catch {
      showToast("Failed to search student", "error");
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async () => {
    if (!searchQuery.trim()) {
      showToast("Please enter student name", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/students/search/?name=${encodeURIComponent(searchQuery.trim())}`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStudents(data.data || []);
        if (data.data.length === 0) showToast("No students found", "info");
        else if (data.data.length === 1) {
          setSelectedStudent(data.data[0]);
          setCurrentClass(data.data[0].class_name || "");
          await checkStudentInvoice(data.data[0].id);
          setStudents([]);
          setSearchQuery("");
        }
      }
    } catch {
      showToast("Failed to search students", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStudentsByClass = async () => {
    if (!selectedClass) {
      showToast("Please select a class", "warning");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/students/by-class/?class_id=${selectedClass}`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStudentList(data.data || []);
        if (data.data.length === 0)
          showToast("No students in this class", "info");
        else setShowStudentModal(true);
      }
    } catch {
      showToast("Failed to fetch students", "error");
    } finally {
      setLoading(false);
    }
  };
  const recalculateInvoice = async (studentId, silent = false) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/bursar/students/${studentId}/recalculate-invoice/`,
      { method: "POST", headers: getAuthHeaders() }
    );
    if (res.status === 401) { handleApiError({ status: 401 }); return; }
    const data = await res.json();
    if (data.success) {
      if (!silent && data.amount_changed) {
        showToast("Invoice updated with latest fee structure", "info");
      }
      await fetchStudentBalance(studentId);
    }
  } catch {
    // Silent — recalculation is best-effort
  }
};

const checkStudentInvoice = async (studentId) => {
  setIsCheckingInvoice(true);
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/bursar/students/${studentId}/invoice-status/`,
      { headers: getAuthHeaders() }
    );
    if (res.status === 401) { handleApiError({ status: 401 }); return; }
    const data = await res.json();

    if (!data.success) {
      showToast("Failed to check invoice status", "error");
      return;
    }

    if (data.data.has_invoice) {
      // silent=true — don't toast unless amount actually changed
      await recalculateInvoice(studentId, true);
    } else {
      showToast("Generating invoice for current term...", "info");
      await generateInvoice(studentId);
      await fetchStudentBalance(studentId);
    }
  } catch {
    showToast("Failed to check invoice status", "error");
  } finally {
    setIsCheckingInvoice(false);
  }
};
  const generateInvoice = async (studentId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/students/${studentId}/generate-invoice/`,
        { method: "POST", headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) {
        showToast("Invoice generated successfully", "success");
      } else {
        showToast(data.error || "Failed to generate invoice", "error");
      }
    } catch {
      showToast("Failed to generate invoice", "error");
    }
    // No fetchStudentBalance here — caller handles it
  };

  const fetchStudentBalance = async (studentId) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/students/${studentId}/balance/`,
        { headers: getAuthHeaders() },
      );
      if (res.status === 401) {
        handleApiError({ status: 401 });
        return;
      }
      const data = await res.json();
      if (data.success) {
        setStudentBalance(data.data.current_balance);
        setCreditBalance(data.data.credit_balance);
        setInvoices(data.data.invoices || []);
      }
    } catch {
      showToast("Failed to load student balance", "error");
    }
  };

  const processPayment = async () => {
    if (!selectedStudent) {
      showToast("Please select a student first", "error");
      return;
    }
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount < 5) {
      showToast("Minimum payment amount is KSh 5.00", "warning");
      return;
    }
    if (paymentMethod === "MPESA" && !mobileMoneyNo) {
      showToast("Please enter M-PESA number", "warning");
      return;
    }
    if (paymentMethod === "Bank Transfer" && !bankName) {
      showToast("Please enter bank name", "warning");
      return;
    }
    if (paymentMethod === "Cheque" && !chequeNo) {
      showToast("Please enter cheque number", "warning");
      return;
    }
    setShowConfirmation(true);
  };

  const confirmPayment = async () => {
    setLoading(true);
    try {
      const transactionData = {
        student_id: selectedStudent.id,
        amount_kes: parseFloat(paymentAmount),
        payment_mode: paymentMethod,
        payment_reference: paymentReference || `PAY-${Date.now()}`,
        bank_name: bankName,
        cheque_no: chequeNo,
        mobile_money_no: mobileMoneyNo,
        status: "COMPLETED",
        payment_date: new Date().toISOString(),
      };
      const res = await fetch(
        `${API_BASE_URL}/api/bursar/transactions/create/`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(transactionData),
        },
      );
      const data = await res.json();
      if (data.success) {
        setCurrentTransaction(data.data.transaction);
        setShowConfirmation(false);
        setShowReceipt(true);
        showToast("Payment processed successfully!", "success");
        await fetchRecentTransactions();
      } else showToast(data.error || "Failed to process payment", "error");
    } catch {
      showToast("Failed to process payment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setCurrentTransaction(null);
    resetForm();
  };

  const resetForm = () => {
    setSelectedStudent(null);
    setStudentBalance(null);
    setCreditBalance(0);
    setInvoices([]);
    setPaymentAmount("");
    setPaymentReference("");
    setMobileMoneyNo("");
    setBankName("");
    setChequeNo("");
    setSearchQuery("");
    setSelectedClass("");
    setStudents([]);
    setStudentList("");
    setCurrentClass("");
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return "KSh 0.00";
    return `KSh ${num.toLocaleString("en-KE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCurrentBalance = () =>
    studentBalance !== null ? studentBalance : 0;
  const getNewBalance = () =>
    getCurrentBalance() - (parseFloat(paymentAmount) || 0);
  const getExcessPayment = () => {
    const c = getCurrentBalance();
    const p = parseFloat(paymentAmount) || 0;
    if (c > 0 && p > c) return p - c;
    return 0;
  };

  const handleSearch = () => {
    if (searchMode === "admission") searchByAdmission();
    else if (searchMode === "name") searchByName();
    else if (searchMode === "class") getStudentsByClass();
  };

  const handleSelectStudent = async (student) => {
    setSelectedStudent(student);
    setCurrentClass(student.class_name || "");
    setShowStudentModal(false);
    await checkStudentInvoice(student.id);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Authentication Required</h2>
          <a
            href="/login"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionExpiredModal
        isOpen={showSessionExpired}
        onLogout={handleLogout}
      />
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          type={t.type}
          onClose={() =>
            setToasts((prev) => prev.filter((t2) => t2.id !== t.id))
          }
        />
      ))}

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Fee Payment Management
          </h1>
          <p className="text-gray-600 mt-1">
            Process student fee payments and generate receipts
          </p>
          {user && (
            <p className="text-xs text-gray-400 mt-1">
              {user.first_name} {user.last_name} · {user.role}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBadge
            label="Recent Transactions"
            value={recentTransactions.length}
            icon={FileText}
            color="blue"
          />
          <StatBadge
            label="Selected Student"
            value={selectedStudent ? "1" : "0"}
            icon={User}
            color="green"
          />
          <StatBadge
            label="Outstanding Balance"
            value={
              selectedStudent ? formatCurrency(getCurrentBalance()) : "N/A"
            }
            icon={DollarSign}
            color="orange"
          />
          <StatBadge
            label="Credit Balance"
            value={selectedStudent ? formatCurrency(creditBalance) : "N/A"}
            icon={CreditCard}
            color="purple"
          />
        </div>

        {/* Search Section */}
        <div className="bg-white border border-gray-300 overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-base font-semibold text-gray-900">
              Find Student
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {["admission", "name", "class"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setSearchMode(mode);
                    setSearchQuery("");
                    setSelectedClass("");
                    setStudents([]);
                  }}
                  className={`px-4 py-2 text-sm font-medium border ${searchMode === mode ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}
                >
                  {mode === "admission"
                    ? "Admission Number"
                    : mode === "name"
                      ? "Student Name"
                      : "By Class"}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(searchMode === "admission" || searchMode === "name") && (
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    placeholder={
                      searchMode === "admission"
                        ? "Enter admission number"
                        : "Enter student name"
                    }
                  />
                </div>
              )}
              {searchMode === "class" && (
                <div className="md:col-span-2">
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.class_name} ({cls.class_code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <button
                  onClick={handleSearch}
                  disabled={loading || isCheckingInvoice}
                  className="w-full px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {(loading || isCheckingInvoice) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {loading
                    ? "Searching..."
                    : isCheckingInvoice
                      ? "Checking Invoice..."
                      : "Search"}
                </button>
              </div>
            </div>

            {students.length > 0 && searchMode === "name" && (
              <div className="mt-4 border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <span className="font-medium text-sm">
                    Select Student ({students.length} found)
                  </span>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {students.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => {
                        setSelectedStudent(s);
                        setCurrentClass(s.class_name || "");
                        checkStudentInvoice(s.id);
                        setStudents([]);
                        setSearchQuery("");
                      }}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium text-sm">
                          {s.first_name} {s.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {s.admission_no}
                        </div>
                      </div>
                      <ChevronRight className="text-gray-400" size={16} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Student Info & Payment Form */}
        {selectedStudent && (
          <div className="bg-white border border-gray-300 overflow-hidden mb-6">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedStudent.first_name} {selectedStudent.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedStudent.admission_no}
                  </p>
                </div>
              </div>
              <button
                onClick={resetForm}
                className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-3 py-1 hover:bg-red-50"
              >
                Change Student
              </button>
            </div>

            {/* Balance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 pb-0">
              <div className="bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Current Balance
                </p>
                <p
                  className={`text-2xl font-bold ${getCurrentBalance() < 0 ? "text-green-600" : getCurrentBalance() > 0 ? "text-red-600" : "text-gray-600"}`}
                >
                  {formatCurrency(getCurrentBalance())}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Credit Balance
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(creditBalance)}
                </p>
              </div>
              <div className="bg-gray-50 border border-gray-200 p-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </p>
                <span
                  className={`inline-block px-3 py-1 text-sm font-semibold ${getCurrentBalance() < 0 ? "bg-green-100 text-green-800" : getCurrentBalance() > 0 ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {getCurrentBalance() < 0
                    ? "CREDIT"
                    : getCurrentBalance() > 0
                      ? "OUTSTANDING"
                      : "PAID"}
                </span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Amount (KES) *
                    </label>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      min="5"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Minimum 5.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Payment Method *
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    >
                      <option value="CASH">Cash</option>
                      <option value="MPESA">M-PESA</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                      <option value="CHEQUE">Cheque</option>
                    </select>
                  </div>
                  {paymentMethod === "MPESA" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        M-PESA Number *
                      </label>
                      <input
                        type="text"
                        value={mobileMoneyNo}
                        onChange={(e) => setMobileMoneyNo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="07XX XXX XXX"
                      />
                    </div>
                  )}
                  {paymentMethod === "BANK_TRANSFER" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Bank Name *
                      </label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="Bank name"
                      />
                    </div>
                  )}
                  {paymentMethod === "CHEQUE" && (
                    <div>
                      <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                        Cheque Number *
                      </label>
                      <input
                        type="text"
                        value={chequeNo}
                        onChange={(e) => setChequeNo(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                        placeholder="Cheque number"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      placeholder="Payment reference"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Payment Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Current Balance</span>
                      <span
                        className={`font-bold ${getCurrentBalance() < 0 ? "text-green-600" : getCurrentBalance() > 0 ? "text-red-600" : ""}`}
                      >
                        {formatCurrency(getCurrentBalance())}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-500">Payment Amount</span>
                      <span className="font-bold text-blue-600">
                        {formatCurrency(paymentAmount)}
                      </span>
                    </div>
                    {getExcessPayment() > 0 && (
                      <div className="flex justify-between text-yellow-600 border-b border-gray-200 pb-2">
                        <span>Excess (Credit)</span>
                        <span>+{formatCurrency(getExcessPayment())}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-1">
                      <span className="font-bold text-gray-700">
                        New Balance
                      </span>
                      <span
                        className={`font-bold text-base ${getNewBalance() < 0 ? "text-green-600" : getNewBalance() > 0 ? "text-red-600" : ""}`}
                      >
                        {formatCurrency(getNewBalance())}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={processPayment}
                    disabled={!paymentAmount || parseFloat(paymentAmount) < 5}
                    className="w-full mt-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 font-semibold flex items-center justify-center gap-2 text-sm"
                  >
                    <Calculator size={16} /> Process Payment
                  </button>
                  {getExcessPayment() > 0 && (
                    <p className="text-xs text-yellow-600 text-center mt-2">
                      Excess payment will be recorded as student credit
                    </p>
                  )}
                </div>
              </div>

              {/* Invoices */}
              {invoices.length > 0 && (
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Active Invoices
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                            Invoice No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                            Due Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wide">
                            Total
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wide">
                            Paid
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wide">
                            Balance
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices.map((inv, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 font-mono text-xs">
                              {inv.invoice_no}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(inv.invoice_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {new Date(inv.due_date).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-right text-sm">
                              {formatCurrency(inv.total_amount)}
                            </td>
                            <td className="px-4 py-3 text-right text-sm text-green-600">
                              {formatCurrency(inv.amount_paid)}
                            </td>
                            <td
                              className={`px-4 py-3 text-right text-sm font-bold ${parseFloat(inv.balance_amount) < 0 ? "text-green-600" : parseFloat(inv.balance_amount) > 0 ? "text-red-600" : ""}`}
                            >
                              {formatCurrency(inv.balance_amount)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-0.5 text-xs font-medium ${inv.payment_status === "PAID" ? "bg-green-100 text-green-800" : inv.payment_status === "PARTIAL" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                              >
                                {inv.payment_status || inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-base font-semibold text-gray-900">
              Recent Transactions
            </h3>
            <button
              onClick={fetchRecentTransactions}
              className="flex items-center gap-1 text-blue-600 text-sm font-medium"
            >
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                    Receipt No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                    Student
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-white uppercase tracking-wide">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wide">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500 text-sm"
                    >
                      No recent transactions
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">
                        {t.transaction_no}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">
                          {t.first_name} {t.last_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {t.admission_no}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-700">
                        {formatCurrency(t.amount_kes)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 text-xs font-medium ${t.payment_mode === "MPESA" ? "bg-green-100 text-green-800" : t.payment_mode === "CASH" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"}`}
                        >
                          {t.payment_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(t.payment_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Jawabu School Management System.
            All rights reserved.
          </p>
        </div>
      </div>

      <StudentSelectionModal
        isOpen={showStudentModal}
        onClose={() => setShowStudentModal(false)}
        students={studentList}
        onSelect={handleSelectStudent}
        loading={loading}
      />
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmPayment}
        title="Confirm Payment"
        message={`Confirm payment of ${formatCurrency(paymentAmount)} for ${selectedStudent?.first_name} ${selectedStudent?.last_name}?`}
        loading={loading}
      />
      <ReceiptModal
        isOpen={showReceipt}
        onClose={handleReceiptClose}
        transaction={currentTransaction}
        student={selectedStudent}
        formatCurrency={formatCurrency}
        currentClass={currentClass}
        invoices={invoices}
      />
    </div>
  );
};

export default PaymentManagement;
