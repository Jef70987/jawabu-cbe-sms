/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  DollarSign,
  CreditCard,
  Calendar,
  AlertCircle,
  Loader2,
  LogOut,
  RefreshCw,
  Settings,
  ChevronRight,
  Download,
  Eye,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Wallet,
  Receipt,
  Banknote,
  Info,
  Printer,
  Building,
  History,
  PieChart as PieChartIcon,
  Clock,
  Smartphone,
  X
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Toast Component
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

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className={`${bgColor[type]} text-white shadow-lg p-3 max-w-md mx-auto`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold capitalize text-sm">{type}</p>
            <p className="text-xs text-white/90 mt-0.5">{message}</p>
          </div>
          <button onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }} className="text-white/70 hover:text-white shrink-0">
            <X size={14} />
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
      <div className="bg-white shadow-xl max-w-md w-full">
        <div className="p-5">
          <div className="flex items-center mb-3">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Session Expired</h3>
          </div>
          <p className="text-sm text-gray-600 mb-5">Your session has expired. Please login again to continue.</p>
          <div className="flex justify-end">
            <button onClick={onLogout} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 text-sm">
              <LogOut className="h-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, onClick, subtitle }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    amber: 'bg-amber-100 text-amber-700'
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer active:bg-gray-50"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 truncate">{title}</p>
          <p className="text-lg font-bold text-gray-900 mt-0.5 break-words">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
        <div className={`p-2 ${colorClasses[color]} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};

// Invoice Card Component
const InvoiceCard = ({ invoice, onViewDetails, onPrintReceipt }) => {
  const statusColors = {
    Paid: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Overdue: 'bg-red-100 text-red-700',
    Partial: 'bg-blue-100 text-blue-700'
  };

  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{invoice.invoice_no}</p>
          <p className="text-xs text-gray-500 mt-0.5">{invoice.term} - {invoice.academic_year}</p>
        </div>
        <span className={`px-2 py-1 text-xs font-medium ${statusColors[invoice.status]}`}>
          {invoice.status}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total Amount</span>
          <span className="font-semibold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Amount Paid</span>
          <span className="font-semibold text-green-600">{formatCurrency(invoice.amount_paid)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Balance</span>
          <span className={`font-semibold ${invoice.balance_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(invoice.balance_amount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Due Date</span>
          <span className="text-gray-700">{formatDate(invoice.due_date)}</span>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails(invoice)}
          className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
        {invoice.status === 'Paid' && (
          <button
            onClick={() => onPrintReceipt(invoice)}
            className="px-3 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1"
          >
            <Printer className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };

  const getPaymentIcon = (mode) => {
    const icons = {
      'Cash': <Banknote className="w-4 h-4" />,
      'Mobile Money': <Smartphone className="w-4 h-4" />,
      'Bank Transfer': <Building className="w-4 h-4" />,
      'Cheque': <FileText className="w-4 h-4" />
    };
    return icons[mode] || <Receipt className="w-4 h-4" />;
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="p-2 bg-green-100">
        {getPaymentIcon(transaction.payment_mode)}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <p className="text-sm font-medium text-gray-900">
            {formatCurrency(transaction.amount)}
          </p>
          <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700">
            Completed
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{transaction.payment_mode}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">{formatDate(transaction.payment_date)}</span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-400">{formatTime(transaction.payment_date)}</span>
        </div>
        {transaction.payment_reference && (
          <p className="text-xs text-gray-400 mt-1">Ref: {transaction.payment_reference}</p>
        )}
      </div>
    </div>
  );
};

// Fee Structure Item Component
const FeeStructureItem = ({ fee }) => {
  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{fee.category_name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{fee.description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">Due: {formatDate(fee.due_date)}</span>
          {fee.frequency && (
            <>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">{fee.frequency}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-gray-900">{formatCurrency(fee.amount)}</p>
        {fee.late_fee_percentage > 0 && (
          <p className="text-xs text-red-500 mt-0.5">Late fee: {fee.late_fee_percentage}%</p>
        )}
      </div>
    </div>
  );
};

// Invoice Details Modal
const InvoiceDetailsModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoice.invoice_no}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school { font-size: 24px; font-weight: bold; }
          .title { font-size: 20px; margin-top: 10px; }
          .info { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background: #f5f5f5; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school">JAWABU SCHOOL</div>
          <div class="title">INVOICE</div>
        </div>
        <div><strong>Invoice No:</strong> ${invoice.invoice_no}</div>
        <div><strong>Date:</strong> ${formatDate(invoice.invoice_date)}</div>
        <div><strong>Due Date:</strong> ${formatDate(invoice.due_date)}</div>
        <div class="info">
          <div class="info-row"><strong>Student:</strong> ${invoice.student_name || 'Student Name'}</div>
          <div class="info-row"><strong>Class:</strong> ${invoice.class_name || 'Class'}</div>
          <div class="info-row"><strong>Term:</strong> ${invoice.term}</div>
          <div class="info-row"><strong>Academic Year:</strong> ${invoice.academic_year}</div>
        </div>
        <table class="table">
          <thead><tr><th>Description</th><th style="text-align:right">Amount (KES)</th> </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr><td>${item.description}</td><td style="text-align:right">${parseFloat(item.net_amount).toLocaleString()}</td> </tr>
            `).join('')}
            <tr style="font-weight:bold"><tr><td>TOTAL</td><td style="text-align:right">${parseFloat(invoice.total_amount).toLocaleString()}</td> </tr>
            <tr><td>Amount Paid</td><td style="text-align:right">${parseFloat(invoice.amount_paid).toLocaleString()}</td> </tr>
            <tr><td>Balance</td><td style="text-align:right">${parseFloat(invoice.balance_amount).toLocaleString()}</td> </tr>
          </tbody>
        </table>
        <div class="footer">
          <p>This is a computer-generated invoice.</p>
          <button onclick="window.print()">Print Invoice</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Invoice Details</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="text-center mb-5">
            <Receipt className="w-12 h-12 text-blue-600 mx-auto mb-2" />
            <p className="text-xl font-bold text-gray-900">{invoice.invoice_no}</p>
            <p className="text-sm text-gray-500">{invoice.term} - {invoice.academic_year}</p>
          </div>

          <div className="space-y-3 mb-5">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Invoice Date</span>
              <span className="font-medium text-gray-900">{formatDate(invoice.invoice_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Due Date</span>
              <span className="font-medium text-gray-900">{formatDate(invoice.due_date)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
            </div>
            {invoice.discount_amount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-{formatCurrency(invoice.discount_amount)}</span>
              </div>
            )}
            {invoice.late_fee_amount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Late Fee</span>
                <span className="font-medium text-red-600">{formatCurrency(invoice.late_fee_amount)}</span>
              </div>
            )}
            <div className="flex justify-between py-3 bg-gray-50 px-3 -mx-3">
              <span className="font-semibold text-gray-900">Total Amount</span>
              <span className="font-bold text-gray-900">{formatCurrency(invoice.total_amount)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-medium text-green-600">{formatCurrency(invoice.amount_paid)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Balance</span>
              <span className={`font-bold ${invoice.balance_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(invoice.balance_amount)}
              </span>
            </div>
          </div>

          {invoice.items && invoice.items.length > 0 && (
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Fee Breakdown</h4>
              <div className="space-y-2">
                {invoice.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.description}</span>
                    <span className="font-medium text-gray-900">{formatCurrency(item.net_amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Invoice
            </button>
          </div>

          {invoice.balance_amount > 0 && (
            <div className="bg-yellow-50 p-3 mt-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-yellow-600 mt-0.5" />
                <p className="text-xs text-yellow-800">
                  Please pay the outstanding balance of {formatCurrency(invoice.balance_amount)} by {formatDate(invoice.due_date)} to avoid late fees.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Fee Statement Modal
const FeeStatementModal = ({ isOpen, onClose, feeSummary, transactions, studentProfile }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Statement</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school { font-size: 24px; font-weight: bold; }
          .title { font-size: 20px; margin-top: 10px; }
          .student-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .card { background: #f5f5f5; padding: 15px; text-align: center; }
          .card-amount { font-size: 20px; font-weight: bold; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background: #f5f5f5; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school">JAWABU SCHOOL</div>
          <div>STRIVING FOR EXCELLENCE</div>
          <div class="title">FEE STATEMENT</div>
        </div>
        <div class="student-info">
          <div><strong>Student:</strong> ${studentProfile?.first_name} ${studentProfile?.last_name}</div>
          <div><strong>Admission No:</strong> ${studentProfile?.admission_no}</div>
          <div><strong>Class:</strong> ${studentProfile?.current_class?.class_name || 'N/A'}</div>
          <div><strong>Term:</strong> ${feeSummary?.term}</div>
          <div><strong>Academic Year:</strong> ${feeSummary?.academic_year}</div>
          <div><strong>Statement Date:</strong> ${formatDate(new Date())}</div>
        </div>
        <div class="summary">
          <div class="card"><div>Total Fees</div><div class="card-amount">${formatCurrency(feeSummary?.total_fees || 0)}</div></div>
          <div class="card"><div>Total Paid</div><div class="card-amount" style="color:green">${formatCurrency(feeSummary?.total_paid || 0)}</div></div>
          <div class="card"><div>Balance</div><div class="card-amount" style="color:${feeSummary?.balance > 0 ? 'red' : 'green'}">${formatCurrency(feeSummary?.balance || 0)}</div></div>
          <div class="card"><div>Overdue</div><div class="card-amount" style="color:${feeSummary?.overdue_amount > 0 ? 'red' : 'black'}">${formatCurrency(feeSummary?.overdue_amount || 0)}</div></div>
        </div>
        <h3>Payment History</h3>
        <table class="table">
          <thead><tr><th>Date</th><th>Receipt No</th><th>Payment Mode</th><th style="text-align:right">Amount</th><th>Reference</th> </thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td>${formatDate(t.payment_date)}</td>
                <td>${t.transaction_no}</td>
                <td>${t.payment_mode}</td>
                <td style="text-align:right">${formatCurrency(t.amount)}</td>
                <td>${t.payment_reference || '-'}</td>
               </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>This is an electronically generated statement.</p>
          <button onclick="window.print()">Print Statement</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Fee Statement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Fee Statement</h2>
            <p className="text-sm text-gray-500 mt-1">As of {formatDate(new Date())}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-blue-100 p-3 text-center">
              <p className="text-xs text-blue-700">Total Fees</p>
              <p className="text-lg font-bold text-blue-900">{formatCurrency(feeSummary?.total_fees || 0)}</p>
            </div>
            <div className="bg-green-100 p-3 text-center">
              <p className="text-xs text-green-700">Total Paid</p>
              <p className="text-lg font-bold text-green-900">{formatCurrency(feeSummary?.total_paid || 0)}</p>
            </div>
            <div className="bg-orange-100 p-3 text-center">
              <p className="text-xs text-orange-700">Balance</p>
              <p className="text-lg font-bold text-orange-900">{formatCurrency(feeSummary?.balance || 0)}</p>
            </div>
            <div className="bg-red-100 p-3 text-center">
              <p className="text-xs text-red-700">Overdue</p>
              <p className="text-lg font-bold text-red-900">{formatCurrency(feeSummary?.overdue_amount || 0)}</p>
            </div>
          </div>

          {transactions && transactions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Payment History</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {transactions.map((t, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm text-gray-900">{formatDate(t.payment_date)}</p>
                      <p className="text-xs text-gray-500">{t.payment_mode}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">{formatCurrency(t.amount)}</p>
                      <p className="text-xs text-gray-400">{t.transaction_no || 'Receipt available'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={handlePrint}
              className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Statement
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              This is an electronically generated statement. For any queries, please contact the accounts office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentFeeManagement = () => {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();
  
  // State
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [feeSummary, setFeeSummary] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [feeStructure, setFeeStructure] = useState([]);
  const [feeBreakdown, setFeeBreakdown] = useState([]);
  const [paymentTrend, setPaymentTrend] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showSessionExpired, setShowSessionExpired] = useState(false);
  const [activeTab, setActiveTab] = useState('invoices');

  // Colors for charts
  const COLORS = ['#10a73b','#ec1310', '#F59E0B', '#EF4444'];

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

  // Fetch Fee Data
  const fetchFeeData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // 1. Fetch student profile
      const profileRes = await fetch(`${API_BASE_URL}/api/student/profile/`, {
        headers: getAuthHeaders()
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success) {
          setStudentProfile(profileData.data);
        }
      }
      
      // 2. Fetch fee summary
      const summaryRes = await fetch(`${API_BASE_URL}/api/student/fees/summary/`, {
        headers: getAuthHeaders()
      });
      
      if (summaryRes.status === 401) { 
        handleApiError({ status: 401 }); 
        setLoading(false);
        return; 
      }
      
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json();
        if (summaryData.success) {
          setFeeSummary(summaryData.data);
          
          // Calculate fee breakdown for chart
          if (summaryData.data) {
            const breakdown = [
              { name: 'Paid', value: parseFloat(summaryData.data.total_paid) || 0 },
              { name: 'Pending', value: parseFloat(summaryData.data.total_fees) - (parseFloat(summaryData.data.total_paid) || 0) },
              { name: 'Overdue', value: parseFloat(summaryData.data.overdue_amount) || 0 }
            ];
            setFeeBreakdown(breakdown.filter(item => item.value > 0));
          }
        }
      }
      
      // 3. Fetch invoices
      const invoicesRes = await fetch(`${API_BASE_URL}/api/student/fees/invoices/`, {
        headers: getAuthHeaders()
      });
      
      if (invoicesRes.ok) {
        const invoicesData = await invoicesRes.json();
        if (invoicesData.success) {
          setInvoices(invoicesData.data || []);
        }
      }
      
      // 4. Fetch transactions
      const transactionsRes = await fetch(`${API_BASE_URL}/api/student/fees/transactions/`, {
        headers: getAuthHeaders()
      });
      
      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        if (transactionsData.success) {
          setTransactions(transactionsData.data || []);
          
          // Generate payment trend data
          const last6Months = [];
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last6Months.push(monthNames[d.getMonth()]);
          }
          
          const paymentsByMonth = {};
          last6Months.forEach(month => paymentsByMonth[month] = 0);
          
          (transactionsData.data || []).forEach(t => {
            const date = new Date(t.payment_date);
            const month = monthNames[date.getMonth()];
            if (paymentsByMonth[month] !== undefined) {
              paymentsByMonth[month] += parseFloat(t.amount) || 0;
            }
          });
          
          const trendData = last6Months.map(month => ({
            month,
            amount: paymentsByMonth[month]
          }));
          setPaymentTrend(trendData);
        }
      }
      
      // 5. Fetch fee structure
      const structureRes = await fetch(`${API_BASE_URL}/api/student/fees/structure/`, {
        headers: getAuthHeaders()
      });
      
      if (structureRes.ok) {
        const structureData = await structureRes.json();
        if (structureData.success) {
          setFeeStructure(structureData.data || []);
        }
      }
      
    } catch (err) {
      console.error('Error fetching fee data:', err);
      showToast('Failed to load fee data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Print Receipt
  const handlePrintReceipt = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - ${invoice.invoice_no}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .receipt { max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school { font-size: 24px; font-weight: bold; }
          .title { font-size: 20px; margin-top: 10px; }
          .info { margin: 20px 0; }
          .info-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background: #f5f5f5; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="school">JAWABU SCHOOL</div> 
            <div class="title">OFFICIAL PAYMENT RECEIPT</div>
          </div>
          <div><strong>Receipt No:</strong> ${invoice.invoice_no}</div>
          <div><strong>Date:</strong> ${new Date(invoice.invoice_date).toLocaleDateString()}</div>
          <div class="info">
            <div class="info-row"><strong>Student:</strong> ${studentProfile?.first_name} ${studentProfile?.last_name}</div>
            <div class="info-row"><strong>Admission No:</strong> ${studentProfile?.admission_no}</div>
            <div class="info-row"><strong>Class:</strong> ${studentProfile?.current_class?.class_name || 'N/A'}</div>
            <div class="info-row"><strong>Term:</strong> ${invoice.term}</div>
            <div class="info-row"><strong>Academic Year:</strong> ${invoice.academic_year}</div>
          </div>
          <table class="table">
            <thead><tr><th>Description</th><th style="text-align:right">Amount (KES)</th> </thead>
            <tbody>
              ${invoice.items.map(item => `
                <tr><td>${item.description}</td><td style="text-align:right">${parseFloat(item.net_amount).toLocaleString()}</td> </tr>
              `).join('')}
              <tr style="font-weight:bold"><tr><td>TOTAL</td><td style="text-align:right">${parseFloat(invoice.total_amount).toLocaleString()}</td> </tr>
              <tr><td>Amount Paid</td><td style="text-align:right">${parseFloat(invoice.amount_paid).toLocaleString()}</td></tr>
              <tr><td>Balance</td><td style="text-align:right">${parseFloat(invoice.balance_amount).toLocaleString()}</td></tr>
            </tbody>
          </table>
          <div class="footer">
            <p>Thank you for your payment!</p>
            <button onclick="window.print()">Print Receipt</button>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast('Receipt opened for printing', 'success');
  };

  // Print Statement
  const handlePrintStatement = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fee Statement</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .school { font-size: 24px; font-weight: bold; }
          .title { font-size: 20px; margin-top: 10px; }
          .student-info { background: #f5f5f5; padding: 15px; margin-bottom: 20px; }
          .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .card { background: #f5f5f5; padding: 15px; text-align: center; }
          .card-amount { font-size: 20px; font-weight: bold; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background: #f5f5f5; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="school">JAWABU SCHOOL</div>
          <div class="title">FEE STATEMENT</div>
        </div>
        <div class="student-info">
          <div><strong>Student:</strong> ${studentProfile?.first_name} ${studentProfile?.last_name}</div>
          <div><strong>Admission No:</strong> ${studentProfile?.admission_no}</div>
          <div><strong>Class:</strong> ${studentProfile?.current_class?.class_name || 'N/A'}</div>
          <div><strong>Term:</strong> ${feeSummary?.term}</div>
          <div><strong>Academic Year:</strong> ${feeSummary?.academic_year}</div>
          <div><strong>Statement Date:</strong> ${new Date().toLocaleDateString()}</div>
        </div>
        <div class="summary">
          <div class="card"><div>Total Fees</div><div class="card-amount">${formatCurrency(feeSummary?.total_fees || 0)}</div></div>
          <div class="card"><div>Total Paid</div><div class="card-amount" style="color:green">${formatCurrency(feeSummary?.total_paid || 0)}</div></div>
          <div class="card"><div>Balance</div><div class="card-amount" style="color:${feeSummary?.balance > 0 ? 'red' : 'green'}">${formatCurrency(feeSummary?.balance || 0)}</div></div>
          <div class="card"><div>Overdue</div><div class="card-amount" style="color:${feeSummary?.overdue_amount > 0 ? 'red' : 'black'}">${formatCurrency(feeSummary?.overdue_amount || 0)}</div></div>
        </div>
        <h3>Payment History</h3>
        <table class="table">
          <thead><tr><th>Date</th><th>Receipt No</th><th>Payment Mode</th><th style="text-align:right">Amount</th><th>Reference</th> </thead>
          <tbody>
            ${transactions.map(t => `
              <tr>
                <td>${new Date(t.payment_date).toLocaleDateString()}</td>
                <td>${t.transaction_no}</td>
                <td>${t.payment_mode}</td>
                <td style="text-align:right">${formatCurrency(t.amount)}</td>
                <td>${t.payment_reference || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="footer">
          <p>This is an electronically generated statement.</p>
          <button onclick="window.print()">Print Statement</button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    showToast('Statement opened for printing', 'success');
  };

  // Refresh data
  const refreshData = () => {
    fetchFeeData();
    showToast('Data refreshed', 'success');
  };

  // Effects
  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      fetchFeeData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Authentication Required</h2>
          <p className="text-gray-600 mt-2 text-sm">Please login to access fee management</p>
          <a href="/login" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white text-sm">Go to Login</a>
        </div>
      </div>
    );
  }

  if (user?.role !== 'student') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold">Access Denied</h2>
          <p className="text-gray-600 mt-2 text-sm">This page is only for students.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout} />
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(prev => prev.filter(t2 => t2.id !== t.id))} />
      ))}

      {/* Invoice Details Modal */}
      <InvoiceDetailsModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        invoice={selectedInvoice}
      />

      {/* Fee Statement Modal */}
      <FeeStatementModal
        isOpen={showStatementModal}
        onClose={() => setShowStatementModal(false)}
        feeSummary={feeSummary}
        transactions={transactions}
        studentProfile={studentProfile}
      />

      {/* Main Content */}
      <div className="w-full px-3 md:px-6 py-4 md:py-6">
        <div className="h-2 md:hidden"></div>
        
        {/* Header - Green Background */}
        <div className="mb-6 bg-green-700 p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">Fee Management</h1>
              <p className="text-sm text-green-100 mt-1">View your fee details, invoices, and payment history</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handlePrintStatement}
                className="px-3 py-2 bg-white text-green-700 hover:bg-gray-100 flex items-center gap-1 text-sm font-medium"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Statement</span>
                <span className="sm:hidden">Statement</span>
              </button>
              <button 
                onClick={refreshData}
                className="px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 flex items-center gap-1 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <StatCard
                title="Total Fees"
                value={formatCurrency(feeSummary?.total_fees || 0)}
                icon={Receipt}
                color="blue"
              />
              <StatCard
                title="Amount Paid"
                value={formatCurrency(feeSummary?.total_paid || 0)}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Balance"
                value={formatCurrency(feeSummary?.balance || 0)}
                icon={Wallet}
                color={feeSummary?.balance > 0 ? 'orange' : 'green'}
              />
              <StatCard
                title="Overdue"
                value={formatCurrency(feeSummary?.overdue_amount || 0)}
                icon={AlertCircle}
                color="red"
              />
            </div>

            {/* Charts Section - Untouched */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="bg-white shadow-sm border border-gray-800 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Fee Breakdown</h3>
                {feeBreakdown.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={feeBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#d89584"
                        dataKey="value"
                      >
                        {feeBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <PieChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No data available</p>
                  </div>
                )}
              </div>

              <div className="bg-white shadow-sm border border-gray-800 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment History Trend</h3>
                {paymentTrend.length > 0 && paymentTrend.some(p => p.amount > 0) ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={paymentTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `KES ${(value / 1000).toFixed(0)}K`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Area type="monotone" dataKey="amount" stroke="#67f31c73" fill="#44a013b4" fillOpacity={0.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">No payment history available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white shadow-sm border border-gray-600 overflow-hidden mb-6">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'invoices'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4" />
                    Invoices
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'transactions'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <History className="w-4 h-4" />
                    Transaction History
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === 'structure'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Building className="w-4 h-4" />
                    Fee Structure
                  </div>
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'invoices' ? (
                  invoices.length === 0 ? (
                    <div className="text-center py-8">
                      <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No invoices found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {invoices.map(invoice => (
                        <InvoiceCard
                          key={invoice.id}
                          invoice={invoice}
                          onViewDetails={(inv) => {
                            setSelectedInvoice(inv);
                            setShowInvoiceModal(true);
                          }}
                          onPrintReceipt={handlePrintReceipt}
                        />
                      ))}
                    </div>
                  )
                ) : activeTab === 'transactions' ? (
                  transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No transactions found</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {transactions.map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))}
                    </div>
                  )
                ) : (
                  feeStructure.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No fee structure available</p>
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      {feeStructure.map((fee, idx) => (
                        <FeeStructureItem key={idx} fee={fee} />
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-blue-100 p-4 mb-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-700 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">Important Information</h4>
                  <p className="text-xs text-blue-800 mt-1">
                    For any queries regarding fee payments, receipts, or statements, please contact the accounts office during working hours.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div className="h-4 md:hidden"></div>
    </div>
  );
};

export default StudentFeeManagement;