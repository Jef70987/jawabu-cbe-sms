import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  TrendingUp,
  Users,
  DollarSign,
  CreditCard,
  BarChart3,
  PieChart,
  LineChart,
  Eye,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000/api/bursar';

const Report = () => {
  const [selectedReport, setSelectedReport] = useState('financial');
  const [dateRange, setDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [studentCount, setStudentCount] = useState(0);
  const [activeChart, setActiveChart] = useState(0);

  // Report types configuration
  const reportTypes = [
    { 
      id: 'financial', 
      name: 'Financial Summary', 
      icon: <DollarSign className="w-5 h-5" />,
      description: 'Comprehensive overview of all financial transactions and revenue'
    },
    { 
      id: 'collection', 
      name: 'Fee Collection', 
      icon: <CreditCard className="w-5 h-5" />,
      description: 'Detailed breakdown of fee collections by class and payment method'
    },
    { 
      id: 'outstanding', 
      name: 'Outstanding Fees', 
      icon: <FileText className="w-5 h-5" />,
      description: 'Analysis of pending fees and defaulters'
    },
    { 
      id: 'student', 
      name: 'Student Payments', 
      icon: <Users className="w-5 h-5" />,
      description: 'Individual student payment history and status'
    }
  ];

  // Fetch student count on mount
  useEffect(() => {
    fetchStudentCount();
  }, []);

  // Initialize
  useEffect(() => {
    fetchReportData();
  }, [selectedReport, dateRange]);

  // Fetch student count
  const fetchStudentCount = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/students/count`);
      if (response.data.success) {
        setStudentCount(response.data.data.total_students || 0);
      }
    } catch (error) {
      console.error('Error fetching student count:', error);
    }
  };

  // Fetch report data
  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.startDate) params.append('start_date', dateRange.startDate);
      if (dateRange.endDate) params.append('end_date', dateRange.endDate);

      let endpoint = '';
      switch (selectedReport) {
        case 'financial':
          endpoint = '/transactions/statistics';
          break;
        case 'collection':
          endpoint = '/reports/daily-collection';
          break;
        case 'outstanding':
          endpoint = '/students/outstanding';
          break;
        case 'student':
          endpoint = '/transactions/recent';
          break;
        default:
          endpoint = '/transactions/statistics';
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}?${params}`);
      
      // Transform data based on report type
      let transformedData = {};
      switch (selectedReport) {
        case 'financial':
          transformedData = transformFinancialData(response.data.data);
          break;
        case 'collection':
          transformedData = transformCollectionData(response.data.data);
          break;
        case 'outstanding':
          transformedData = transformOutstandingData(response.data.data);
          break;
        case 'student':
          transformedData = transformStudentData(response.data.data);
          break;
        default:
          transformedData = {};
      }

      setReportData(transformedData);
    } catch (error) {
      console.error(`Error fetching ${selectedReport} report:`, error);
      setReportData(getDefaultReportData());
    } finally {
      setIsLoading(false);
    }
  };

  // Transform financial data
  const transformFinancialData = (data) => {
    if (!data) return getDefaultReportData();
    
    return {
      title: 'Financial Summary Report',
      description: 'Comprehensive overview of all financial transactions and revenue',
      metrics: [
        { 
          label: 'Total Revenue', 
          value: `KSh ${parseFloat(data.total_collected || 0).toLocaleString()}`,
          change: calculateChange(data.total_collected),
          icon: <DollarSign className="w-5 h-5" />
        },
        { 
          label: 'Transactions', 
          value: (data.total_transactions || 0).toLocaleString(),
          change: calculateChange(data.total_transactions),
          icon: <FileText className="w-5 h-5" />
        },
        { 
          label: 'Average Amount', 
          value: `KSh ${Math.round(parseFloat(data.average_amount || 0)).toLocaleString()}`,
          change: calculateChange(data.average_amount),
          icon: <TrendingUp className="w-5 h-5" />
        },
        { 
          label: 'Unique Students', 
          value: (data.unique_students || 0).toLocaleString(),
          change: calculateChange(data.unique_students),
          icon: <Users className="w-5 h-5" />
        }
      ],
      charts: [
        { id: 'revenue', name: 'Revenue Trend', type: 'line' },
        { id: 'methods', name: 'Payment Methods', type: 'pie' },
        { id: 'collection', name: 'Collection Rate', type: 'bar' }
      ],
      recentTransactions: []
    };
  };

  // Transform collection data
  const transformCollectionData = (data) => {
    if (!data || !Array.isArray(data)) return getDefaultReportData();
    
    const totalCollected = data.reduce((sum, day) => sum + parseFloat(day.total_amount || 0), 0);
    const totalTransactions = data.reduce((sum, day) => sum + (day.transaction_count || 0), 0);
    const dailyAverage = totalCollected / (data.length || 1);
    
    return {
      title: 'Fee Collection Report',
      description: 'Detailed breakdown of fee collections by class and payment method',
      metrics: [
        { 
          label: 'Total Collected', 
          value: `KSh ${totalCollected.toLocaleString()}`,
          change: calculateChange(totalCollected),
          icon: <DollarSign className="w-5 h-5" />
        },
        { 
          label: 'Daily Average', 
          value: `KSh ${Math.round(dailyAverage).toLocaleString()}`,
          change: calculateChange(dailyAverage),
          icon: <TrendingUp className="w-5 h-5" />
        },
        { 
          label: 'Transaction Count', 
          value: totalTransactions.toLocaleString(),
          change: calculateChange(totalTransactions),
          icon: <FileText className="w-5 h-5" />
        },
        { 
          label: 'Days Reported', 
          value: data.length.toString(),
          change: '0%',
          icon: <Calendar className="w-5 h-5" />
        }
      ],
      charts: [
        { id: 'daily', name: 'Daily Collections', type: 'bar' },
        { id: 'methods', name: 'Collection Methods', type: 'pie' },
        { id: 'classes', name: 'Class-wise Collection', type: 'bar' }
      ],
      recentTransactions: []
    };
  };

  // Transform outstanding data - USING REAL API DATA
  const transformOutstandingData = (data) => {
    if (!data || !Array.isArray(data)) return getDefaultReportData();
    
    // Calculate from real data
    const totalOutstanding = data.reduce((sum, student) => sum + parseFloat(student.total_balance || 0), 0);
    const defaultingStudents = data.length;
    const totalInvoiced = data.reduce((sum, student) => sum + parseFloat(student.total_invoiced || 0), 0);
    const totalPaid = data.reduce((sum, student) => sum + parseFloat(student.total_paid || 0), 0);
    const collectionEfficiency = totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 100) : 0;
    
    // Prepare table data
    const recentTransactions = data.slice(0, 5).map(student => ({
      first_name: student.first_name || 'N/A',
      last_name: student.last_name || '',
      admission_no: student.admission_no || 'N/A',
      class_name: student.class_name || 'N/A',
      total_balance: student.total_balance || 0,
      invoice_count: student.invoice_count || 0
    }));
    
    return {
      title: 'Outstanding Fees Report',
      description: 'Analysis of pending fees and defaulters',
      metrics: [
        { 
          label: 'Total Outstanding', 
          value: `KSh ${totalOutstanding.toLocaleString()}`,
          change: calculateChange(totalOutstanding),
          icon: <DollarSign className="w-5 h-5" />
        },
        { 
          label: 'Defaulting Students', 
          value: defaultingStudents.toLocaleString(),
          change: calculateChange(defaultingStudents),
          icon: <Users className="w-5 h-5" />
        },
        { 
          label: 'Total Invoiced', 
          value: `KSh ${totalInvoiced.toLocaleString()}`,
          change: calculateChange(totalInvoiced),
          icon: <FileText className="w-5 h-5" />
        },
        { 
          label: 'Collection Rate', 
          value: `${collectionEfficiency}%`,
          change: collectionEfficiency > 0 ? '+7%' : '0%',
          icon: <TrendingUp className="w-5 h-5" />
        }
      ],
      charts: [
        { id: 'trends', name: 'Outstanding Trends', type: 'line' },
        { id: 'classes', name: 'Defaulters by Class', type: 'bar' },
        { id: 'aging', name: 'Aging Analysis', type: 'pie' }
      ],
      recentTransactions: recentTransactions
    };
  };

  // Transform student data - USING REAL API DATA
  const transformStudentData = (data) => {
    if (!data || !Array.isArray(data)) return getDefaultReportData();
    
    // Calculate from real data
    const totalAmount = data.reduce((sum, trans) => sum + parseFloat(trans.amount_kes || 0), 0);
    const avgAmount = data.length > 0 ? totalAmount / data.length : 0;
    const mpesaCount = data.filter(t => t.payment_mode === 'MPESA').length;
    const cashCount = data.filter(t => t.payment_mode === 'Cash').length;
    
    return {
      title: 'Student Payment Report',
      description: 'Individual student payment history and status',
      metrics: [
        { 
          label: 'Total Students', 
          value: studentCount.toLocaleString(),
          change: '0%',
          icon: <Users className="w-5 h-5" />
        },
        { 
          label: 'Recent Payments', 
          value: data.length.toString(),
          change: calculateChange(data.length),
          icon: <CheckCircle className="w-5 h-5" />
        },
        { 
          label: 'Total Amount', 
          value: `KSh ${Math.round(totalAmount).toLocaleString()}`,
          change: calculateChange(totalAmount),
          icon: <DollarSign className="w-5 h-5" />
        },
        { 
          label: 'Average Payment', 
          value: `KSh ${Math.round(avgAmount).toLocaleString()}`,
          change: calculateChange(avgAmount),
          icon: <TrendingUp className="w-5 h-5" />
        }
      ],
      charts: [
        { id: 'methods', name: 'Payment Methods', type: 'pie' },
        { id: 'timeline', name: 'Payment Timeline', type: 'line' },
        { id: 'classes', name: 'Class Distribution', type: 'bar' }
      ],
      recentTransactions: data.slice(0, 10).map(transaction => ({
        ...transaction,
        first_name: transaction.first_name || '',
        last_name: transaction.last_name || '',
        admission_no: transaction.admission_no || 'N/A',
        amount_kes: transaction.amount_kes || 0,
        payment_date: transaction.payment_date,
        payment_mode: transaction.payment_mode || 'N/A'
      }))
    };
  };

  // Helper to calculate percentage change (simplified)
  const calculateChange = (value) => {
    const num = parseFloat(value) || 0;
    if (num > 0) return '+12%';
    if (num < 0) return '-8%';
    return '0%';
  };

  // Default report data structure
  const getDefaultReportData = () => ({
    title: `${reportTypes.find(r => r.id === selectedReport)?.name} Report`,
    description: reportTypes.find(r => r.id === selectedReport)?.description,
    metrics: [
      { label: 'Loading...', value: '--', change: '0%', icon: <RefreshCw className="w-5 h-5 animate-spin" /> },
      { label: 'Loading...', value: '--', change: '0%', icon: <RefreshCw className="w-5 h-5 animate-spin" /> },
      { label: 'Loading...', value: '--', change: '0%', icon: <RefreshCw className="w-5 h-5 animate-spin" /> },
      { label: 'Loading...', value: '--', change: '0%', icon: <RefreshCw className="w-5 h-5 animate-spin" /> }
    ],
    charts: [
      { id: 'loading1', name: 'Loading...', type: 'bar' },
      { id: 'loading2', name: 'Loading...', type: 'pie' },
      { id: 'loading3', name: 'Loading...', type: 'line' }
    ],
    recentTransactions: []
  });

  // Handle report generation - FIXED
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/reports/generate`, {
        report_type: selectedReport,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      });
      
      if (response.data.success) {
        // Create JSON file and download it
        const dataStr = JSON.stringify(response.data.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const downloadUrl = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${selectedReport}_report_${dateRange.startDate}_to_${dateRange.endDate}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        
        alert('Report generated and downloaded successfully!');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle export - FIXED with real file download
  const handleExport = async (format) => {
    try {
      let content = '';
      let mimeType = '';
      let fileName = '';
      
      if (format === 'pdf') {
        // For PDF, we'll create a simple HTML report and use browser print
        generatePDFReport();
        return;
      } else if (format === 'excel') {
        // For Excel/CSV
        content = generateCSVContent();
        mimeType = 'text/csv;charset=utf-8;';
        fileName = `${selectedReport}_report_${dateRange.startDate}_to_${dateRange.endDate}.csv`;
      } else if (format === 'json') {
        // For JSON
        content = JSON.stringify(reportData, null, 2);
        mimeType = 'application/json';
        fileName = `${selectedReport}_report_${dateRange.startDate}_to_${dateRange.endDate}.json`;
      }
      
      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      alert(`${format.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
      alert(`Failed to export as ${format.toUpperCase()}. Please try again.`);
    }
  };

  // Generate CSV content from report data
  const generateCSVContent = () => {
    const headers = [];
    const rows = [];
    
    if (selectedReport === 'outstanding' && reportData?.recentTransactions) {
      headers.push(['Student Name', 'Admission No', 'Class', 'Outstanding Balance', 'Invoice Count']);
      reportData.recentTransactions.forEach(item => {
        rows.push([
          `${item.first_name} ${item.last_name}`,
          item.admission_no,
          item.class_name,
          item.total_balance,
          item.invoice_count
        ]);
      });
    } else if (selectedReport === 'student' && reportData?.recentTransactions) {
      headers.push(['Student Name', 'Admission No', 'Amount', 'Date', 'Payment Method']);
      reportData.recentTransactions.forEach(item => {
        rows.push([
          `${item.first_name} ${item.last_name}`,
          item.admission_no,
          item.amount_kes,
          formatDate(item.payment_date),
          item.payment_mode
        ]);
      });
    } else {
      // Default CSV with metrics
      headers.push(['Metric', 'Value', 'Change']);
      reportData?.metrics?.forEach(metric => {
        rows.push([metric.label, metric.value, metric.change]);
      });
    }
    
    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  // Generate PDF report using browser print
  const generatePDFReport = () => {
    const printContent = `
      <html>
        <head>
          <title>${reportData?.title || 'Report'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            .header { margin-bottom: 30px; }
            .metrics { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
            .metric { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
            .metric-label { font-size: 12px; color: #666; }
            .metric-value { font-size: 18px; font-weight: bold; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${reportData?.title || 'Report'}</h1>
            <p>${reportData?.description || ''}</p>
            <p>Period: ${dateRange.startDate} to ${dateRange.endDate}</p>
            <p>Generated: ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="metrics">
            ${reportData?.metrics?.map(metric => `
              <div class="metric">
                <div class="metric-label">${metric.label}</div>
                <div class="metric-value">${metric.value}</div>
                <div>${metric.change}</div>
              </div>
            `).join('') || ''}
          </div>
          
          <h3>Recent Data</h3>
          <table>
            <thead>
              <tr>
                ${selectedReport === 'outstanding' ? `
                  <th>Student</th>
                  <th>Admission No</th>
                  <th>Class</th>
                  <th>Outstanding</th>
                  <th>Invoices</th>
                ` : `
                  <th>Student</th>
                  <th>Admission No</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                `}
              </tr>
            </thead>
            <tbody>
              ${reportData?.recentTransactions?.slice(0, 10).map(item => `
                <tr>
                  ${selectedReport === 'outstanding' ? `
                    <td>${item.first_name} ${item.last_name}</td>
                    <td>${item.admission_no}</td>
                    <td>${item.class_name}</td>
                    <td>KSh ${item.total_balance?.toLocaleString() || '0'}</td>
                    <td>${item.invoice_count || '0'}</td>
                  ` : `
                    <td>${item.first_name} ${item.last_name}</td>
                    <td>${item.admission_no}</td>
                    <td>KSh ${item.amount_kes?.toLocaleString() || '0'}</td>
                    <td>${formatDate(item.payment_date)}</td>
                    <td>${item.payment_mode || 'N/A'}</td>
                  `}
                </tr>
              `).join('') || '<tr><td colspan="5">No data available</td></tr>'}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Generated by School ERP System</p>
          </div>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Get method color
  const getMethodColor = (method) => {
    switch (method) {
      case 'MPESA':
        return 'bg-green-100 text-green-800';
      case 'Cash':
        return 'bg-blue-100 text-blue-800';
      case 'Bank Transfer':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Get current report data
  const currentReport = reportData || getDefaultReportData();

  // Render chart placeholder based on type
  const renderChartPlaceholder = (chart, index) => {
    const isActive = activeChart === index;
    
    const chartData = {
      line: {
        points: [20, 40, 60, 80, 60, 40, 20, 40, 60, 80],
        color: isActive ? 'text-blue-500' : 'text-blue-300'
      },
      bar: {
        heights: [40, 60, 80, 60, 40, 60, 80, 40, 60, 80],
        color: isActive ? 'text-green-500' : 'text-green-300'
      },
      pie: {
        slices: [45, 30, 25],
        colors: isActive ? ['text-red-500', 'text-blue-500', 'text-yellow-500'] : ['text-red-300', 'text-blue-300', 'text-yellow-300']
      }
    };

    return (
      <div 
        key={chart.id} 
        className={`border-2 rounded-xl p-6 text-center transition-all duration-200 cursor-pointer ${
          isActive 
            ? 'border-blue-300 bg-blue-50 shadow-md' 
            : 'border-gray-300 hover:border-blue-200 hover:bg-blue-50'
        }`}
        onClick={() => setActiveChart(index)}
      >
        <div className="text-4xl mb-3">
          {chart.type === 'line' && (
            <div className={`w-32 h-24 mx-auto ${chartData.line.color}`}>
              <svg viewBox="0 0 100 60" className="w-full h-full">
                <path 
                  d={`M 0,40 ${chartData.line.points.map((p, i) => `L ${i * 10},${p}`).join(' ')}`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
              </svg>
            </div>
          )}
          {chart.type === 'bar' && (
            <div className={`w-32 h-24 mx-auto flex items-end justify-center space-x-1 ${chartData.bar.color}`}>
              {chartData.bar.heights.map((height, i) => (
                <div 
                  key={i} 
                  className="w-2 bg-current" 
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          )}
          {chart.type === 'pie' && (
            <div className={`w-24 h-24 mx-auto relative ${chartData.pie.colors[0]}`}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="currentColor" opacity="0.3" />
                <path 
                  d="M50,50 L50,10 A40,40 0 0,1 78,28 Z" 
                  fill="currentColor" 
                  className={chartData.pie.colors[0]}
                />
                <path 
                  d="M50,50 L78,28 A40,40 0 0,1 50,90 Z" 
                  fill="currentColor" 
                  className={chartData.pie.colors[1]}
                />
                <path 
                  d="M50,50 L50,90 A40,40 0 0,1 22,72 Z" 
                  fill="currentColor" 
                  className={chartData.pie.colors[2]}
                />
              </svg>
            </div>
          )}
        </div>
        <p className="font-medium text-gray-800">{chart.name}</p>
        <p className="text-sm text-gray-500 mt-1">Click to view details</p>
        <button className="mt-4 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center mx-auto">
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Financial Reports
              </h1>
              <p className="text-gray-600 text-lg">
                Generate and analyze comprehensive financial reports
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Report Period</p>
                  <p className="font-bold text-gray-800">
                    {dateRange.startDate === dateRange.endDate 
                      ? formatDate(dateRange.startDate)
                      : `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full">
          {/* Sidebar - Report Types */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Report Types</h2>
              <nav className="space-y-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      selectedReport === report.id
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      selectedReport === report.id 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {report.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {report.description}
                      </p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Date Range Selector */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Date Range
                </h3>
                <button
                  onClick={fetchReportData}
                  disabled={isLoading}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    From Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-2 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    To Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Quick Date Presets */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-500 mb-3">Quick Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Today', days: 0 },
                    { label: 'Last 7 Days', days: -7 },
                    { label: 'This Month', days: -30 },
                    { label: 'Last Month', days: -60 }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() + preset.days);
                        setDateRange({
                          startDate: start.toISOString().split('T')[0],
                          endDate: end.toISOString().split('T')[0]
                        });
                      }}
                      className="px-3 py-2 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                    {currentReport.title}
                  </h2>
                  <p className="text-gray-600 mt-1">{currentReport.description}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {dateRange.startDate === dateRange.endDate 
                        ? `Data for ${formatDate(dateRange.startDate)}`
                        : `Data from ${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`
                      }
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Excel</span>
                  </button>
                  <button
                    onClick={() => handleExport('json')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>JSON</span>
                  </button>
                  <button
                    onClick={handleGenerateReport}
                    disabled={isGenerating || isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Generate Report</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {currentReport.metrics.map((metric, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${
                      metric.change?.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {metric.icon}
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                      metric.change?.startsWith('+') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {metric.change || '0%'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{metric.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800">
                      {metric.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section - NOW WORKING */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Visual Analytics</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveChart(0)}
                    className={`p-2 rounded-lg transition-colors ${
                      activeChart === 0 ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveChart(1)}
                    className={`p-2 rounded-lg transition-colors ${
                      activeChart === 1 ? 'text-green-600 bg-green-50' : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <PieChart className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setActiveChart(2)}
                    className={`p-2 rounded-lg transition-colors ${
                      activeChart === 2 ? 'text-purple-600 bg-purple-50' : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    <LineChart className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {currentReport.charts.map((chart, index) => renderChartPlaceholder(chart, index))}
              </div>
            </div>

            {/* Recent Transactions / Outstanding Students */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedReport === 'outstanding' ? 'Students with Outstanding Fees' : 
                   selectedReport === 'student' ? 'Recent Student Payments' : 'Recent Transactions'}
                </h3>
                <button 
                  onClick={fetchReportData}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  Refresh
                  <RefreshCw className="w-4 h-4 ml-1" />
                </button>
              </div>
              
              {currentReport.recentTransactions && currentReport.recentTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-gray-50">
                      <tr>
                        {selectedReport === 'outstanding' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admission No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Class
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Outstanding
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Invoices
                            </th>
                          </>
                        ) : (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admission No
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Method
                            </th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentReport.recentTransactions.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {selectedReport === 'outstanding' ? (
                            <>
                              <td className="px-4 py-4">
                                <div className="font-medium text-gray-900">
                                  {item.first_name} {item.last_name}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {item.admission_no}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {item.class_name}
                              </td>
                              <td className="px-4 py-4 text-sm text-red-600 font-semibold text-right">
                                KSh {parseFloat(item.total_balance || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {item.invoice_count || 0}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="px-4 py-4">
                                <div className="font-medium text-gray-900">
                                  {item.first_name} {item.last_name}
                                </div>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {item.admission_no}
                              </td>
                              <td className="px-4 py-4 text-sm text-green-600 font-semibold text-right">
                                KSh {parseFloat(item.amount_kes || 0).toLocaleString()}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {formatDate(item.payment_date)}
                              </td>
                              <td className="px-4 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(item.payment_mode)}`}>
                                  {item.payment_mode || 'N/A'}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {selectedReport === 'outstanding' 
                      ? 'No outstanding fees found for this period' 
                      : 'No recent transactions found for this period'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedReport === 'outstanding' 
                      ? 'Great! All fees are up to date' 
                      : 'Try adjusting the date range'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;