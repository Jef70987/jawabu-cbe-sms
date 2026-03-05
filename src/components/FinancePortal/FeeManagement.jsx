/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  FiPlus, FiTrash2, FiEdit, FiDollarSign, FiBook, 
  FiLayers, FiSearch, FiDownload, FiFilter, 
  FiCreditCard, FiBarChart2, FiCalendar, FiPercent,
  FiCheckCircle, FiXCircle, FiFileText, FiRefreshCw,
  FiEye, FiPrinter, FiSave, FiX, FiUser, 
  FiTrendingUp, FiTrendingDown, FiDatabase, FiLoader,
  FiChevronDown, FiChevronUp, FiGrid, FiList, FiSettings,
  FiAlertCircle, FiBell, FiCheck, FiInfo
} from "react-icons/fi";
import axios from 'axios';

// Django API Base URL - Changed to Django port 8000
const API_BASE_URL = import.meta.env.VITE_API_URL;


const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// NEW: Toast Notification Component
const Toast = React.memo(({ message, type, onClose, autoClose = true }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 4000); // Auto-close after 4 seconds

      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const bgColor = {
    success: 'bg-gradient-to-r from-emerald-500 to-green-500',
    error: 'bg-gradient-to-r from-rose-500 to-pink-500',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    warning: 'bg-gradient-to-r from-amber-500 to-orange-500'
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
      <div className={`${bgColor[type]} text-white rounded-lg shadow-xl p-4 min-w-[320px] max-w-md transform transition-all duration-300 hover:scale-[1.02]`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              {icon[type]}
            </div>
            <div>
              <p className="font-semibold capitalize">{type}</p>
              <p className="text-sm text-white/90 mt-1">{message}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>
        {autoClose && (
          <div className="mt-3 h-1 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white/80 rounded-full animate-toast-progress"></div>
          </div>
        )}
      </div>
    </div>
  );
});

// CategoryForm Component
const CategoryForm = React.memo(({ 
  isEditMode, 
  editingItem, 
  newCategory, 
  onCategoryChange, 
  onStructureChange,
  frequencies,
  academicYears,
  availableTerms,
  classes,
  feeCategories,
  onSubmit,
  onCancel,
  loading,
  onStructureSubmit,
  isStructureEditMode,
  newStructure,
  structureLoading
}) => {
  const formData = isEditMode && editingItem ? editingItem : newCategory;
  
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2">
          <FiBook className="text-blue-600" size={20} />
          <h4 className="font-semibold text-gray-800">
            {isEditMode ? 'Edit Category Details' : 'New Fee Category'}
          </h4>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the details for the fee category
        </p>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category_code}
              onChange={(e) => onCategoryChange('category_code', e.target.value)}
              placeholder="e.g., TUIT001, LIB002"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              required
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <FiInfo size={12} /> Unique identifier for the category
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.category_name}
              onChange={(e) => onCategoryChange('category_name', e.target.value)}
              placeholder="e.g., Tuition Fee, Library Fee"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => onCategoryChange('description', e.target.value)}
            rows="3"
            placeholder="Brief description of this fee category..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
            <div className="relative">
              <select
                value={formData.frequency}
                onChange={(e) => onCategoryChange('frequency', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 appearance-none bg-white"
              >
                {frequencies.map(freq => (
                  <option key={freq} value={freq}>{freq.replace('_', ' ').toLowerCase()}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">GL Account Code</label>
            <input
              type="text"
              value={formData.gl_account_code}
              onChange={(e) => onCategoryChange('gl_account_code', e.target.value)}
              placeholder="e.g., 4101, 4201"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
            />
            <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
              <FiInfo size={12} /> For accounting system integration
            </p>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-100">
          <h5 className="text-sm font-semibold text-gray-700 mb-3">Settings</h5>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${formData.is_mandatory ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  {formData.is_mandatory && <FiCheck className="text-white" size={12} />}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Mandatory Fee</span>
                  <p className="text-xs text-gray-500">All students must pay this fee</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_mandatory}
                onChange={(e) => onCategoryChange('is_mandatory', e.target.checked)}
                className="sr-only"
              />
            </label>
            
            <label className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${formData.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  {formData.is_active && <FiCheck className="text-white" size={12} />}
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Active Status</span>
                  <p className="text-xs text-gray-500">Category is currently active</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => onCategoryChange('is_active', e.target.checked)}
                className="sr-only"
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium hover:shadow-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <FiLoader className="animate-spin" />
              Saving...
            </span>
          ) : isEditMode ? (
            <span className="flex items-center gap-2">
              <FiSave size={16} />
              Update Category
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FiPlus size={16} />
              Create Category
            </span>
          )}
        </button>
      </div>
    </form>
  );
});

// StructureForm Component
const StructureForm = React.memo(({ 
  isEditMode, 
  editingItem, 
  newStructure, 
  onCategoryChange, 
  onStructureChange,
  frequencies,
  academicYears,
  availableTerms,
  classes,
  feeCategories,
  onSubmit,
  onCancel,
  loading,
  onStructureSubmit,
  isStructureEditMode,
  structureLoading
}) => {
  const formData = isStructureEditMode && editingItem ? editingItem : newStructure;
  
  return (
    <form onSubmit={onStructureSubmit} className="space-y-6">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl mb-4">
        <div className="flex items-center gap-2">
          <FiLayers className="text-purple-600" size={20} />
          <h4 className="font-semibold text-gray-800">
            {isStructureEditMode ? 'Edit Fee Structure' : 'New Fee Structure'}
          </h4>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Configure fee structure for specific academic period
        </p>
      </div>
      
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.academic_year}
                onChange={(e) => onStructureChange('academic_year', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select Academic Year</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <FiCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Term <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.term}
                onChange={(e) => onStructureChange('term', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select Term</option>
                {availableTerms.map(term => (
                  <option key={term.value} value={term.value}>{term.label}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Class <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.class_id_id}
                onChange={(e) => onStructureChange('class_id_id', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} ({cls.class_code})
                  </option>
                ))}
              </select>
              <FiUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fee Category <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.category_id}
                onChange={(e) => onStructureChange('category_id', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200 appearance-none bg-white"
                required
              >
                <option value="">Select Category</option>
                {feeCategories.filter(c => c.is_active).map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name} ({cat.category_code})
                  </option>
                ))}
              </select>
              <FiBook className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount (KES) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">KES</span>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => onStructureChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-14 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Due Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => onStructureChange('due_date', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                required
              />
              <FiCalendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100">
          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <FiAlertCircle className="text-amber-600" size={16} />
            Late Fee Configuration
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Late Fee Percentage</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.late_fee_percentage}
                  onChange={(e) => onStructureChange('late_fee_percentage', parseFloat(e.target.value) || 0)}
                  step="0.01"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200 pr-12"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600 font-semibold">%</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apply After (Days)</label>
              <input
                type="number"
                value={formData.late_fee_after_days}
                onChange={(e) => onStructureChange('late_fee_after_days', parseInt(e.target.value) || 0)}
                min="0"
                className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all duration-200"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-100">
            <label className="flex items-center justify-between mb-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${formData.installment_allowed ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                  {formData.installment_allowed && <FiCheck className="text-white" size={14} />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Allow Installments</span>
                  <p className="text-xs text-gray-500">Students can pay in installments</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.installment_allowed}
                onChange={(e) => onStructureChange('installment_allowed', e.target.checked)}
                className="sr-only"
              />
            </label>
            
            {formData.installment_allowed && (
              <div className="mt-4 ml-9">
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Installments</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.max_installments}
                    onChange={(e) => onStructureChange('max_installments', parseInt(e.target.value) || 1)}
                    min="1"
                    max="12"
                    className="w-full px-4 py-2 border-2 border-emerald-200 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-200"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-600 font-medium text-sm">months</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-xl border border-cyan-100">
            <label className="flex items-center justify-between mb-4 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${formData.discount_allowed ? 'bg-cyan-500' : 'bg-gray-300'}`}>
                  {formData.discount_allowed && <FiCheck className="text-white" size={14} />}
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-700">Allow Discounts</span>
                  <p className="text-xs text-gray-500">Apply discounts to this fee</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.discount_allowed}
                onChange={(e) => onStructureChange('discount_allowed', e.target.checked)}
                className="sr-only"
              />
            </label>
            
            {formData.discount_allowed && (
              <div className="mt-4 ml-9">
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Discount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.max_discount_percentage}
                    onChange={(e) => onStructureChange('max_discount_percentage', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border-2 border-cyan-200 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all duration-200 pr-12"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-600 font-semibold">%</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-xl border border-gray-100">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${formData.is_active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                {formData.is_active && <FiCheck className="text-white" size={14} />}
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700">Active Status</span>
                <p className="text-xs text-gray-500">This fee structure is currently active</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => onStructureChange('is_active', e.target.checked)}
              className="sr-only"
            />
          </label>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200 font-medium hover:shadow-md"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={structureLoading}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {structureLoading ? (
            <span className="flex items-center gap-2">
              <FiLoader className="animate-spin" />
              Saving...
            </span>
          ) : isStructureEditMode ? (
            <span className="flex items-center gap-2">
              <FiSave size={16} />
              Update Structure
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FiPlus size={16} />
              Create Structure
            </span>
          )}
        </button>
      </div>
    </form>
  );
});

// Modal Component
const Modal = React.memo(({ show, onClose, title, children }) => {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
});

// Main component
const FeeManagement = () => {
  // State for data
  const [feeCategories, setFeeCategories] = useState([]);
  const [feeStructures, setFeeStructures] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [classes, setClasses] = useState([]);
  

  // Update the existing useEffect
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Loading states
  const [loading, setLoading] = useState({
    categories: false,
    structures: false,
    transactions: false,
    statistics: false,
    classes: false,
    academicYears: false,
    form: false
  });

  // Form states
  const [newCategory, setNewCategory] = useState({
    category_code: "",
    category_name: "",
    description: "",
    frequency: "TERM",
    is_mandatory: true,
    is_active: true,
    gl_account_code: ""
  });

  const [newStructure, setNewStructure] = useState({
    academic_year: "",
    term: "TERM_1",
    class_id_id: "",
    category_id: "",
    amount: "",
    due_date: "",
    late_fee_percentage: 5.00,
    late_fee_after_days: 15,
    installment_allowed: false,
    max_installments: 1,
    discount_allowed: false,
    max_discount_percentage: 0,
    is_active: true
  });

  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [editMode, setEditMode] = useState({
    category: false,
    structure: false
  });

  // UI states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState({
    category: false,
    structure: false
  });
  const [filters, setFilters] = useState({
    academic_year: "",
    term: "",
    class_id: "",
    status: "",
    payment_mode: ""
  });

  useEffect(() => {
    fetchAllData();
  }, [filters, activeTab]);
  // NEW: Toast notifications state (multiple toasts)
  const [toasts, setToasts] = useState([]);

  // Real data from database
  const [academicYears, setAcademicYears] = useState([]);
  const [availableTerms, setAvailableTerms] = useState([
    { value: "TERM_1", label: "Term 1" },
    { value: "TERM_2", label: "Term 2" },
    { value: "TERM_3", label: "Term 3" },
    { value: "SEMESTER_1", label: "Semester 1" },
    { value: "SEMESTER_2", label: "Semester 2" },
    { value: "ANNUAL", label: "Annual" }
  ]);

  const [frequencies] = useState(["TERM", "SEMESTER", "ANNUAL", "MONTHLY", "ONE_TIME"]);

  // Statistics
  const [statistics, setStatistics] = useState({
    categories: { total: 0, active: 0 },
    structures: { total: 0, active: 0, total_amount: 0 },
    transactions: { 
      total: 0, 
      completed: 0, 
      pending: 0, 
      total_collected: 0 
    },
    collection_rate: 0
  });

  // NEW: Show toast notification
  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  }, []);

  // NEW: Remove toast
  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // FIXED: Optimized form handlers with useCallback
  const handleCategoryChange = useCallback((field, value) => {
    if (editMode.category && editingItem) {
      setEditingItem(prev => ({
        ...prev,
        [field]: field === 'category_code' ? value.toUpperCase() : value
      }));
    } else {
      setNewCategory(prev => ({
        ...prev,
        [field]: field === 'category_code' ? value.toUpperCase() : value
      }));
    }
  }, [editMode.category, editingItem]);

  const handleStructureChange = useCallback((field, value) => {
    if (editMode.structure && editingItem) {
      setEditingItem(prev => ({
        ...prev,
        [field]: value
      }));
    } else {
      setNewStructure(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }, [editMode.structure, editingItem]);

  // Fetch classes from database
  const fetchClasses = async () => {
    try {
      setLoading(prev => ({ ...prev, classes: true }));
      const response = await axios.get(`${API_BASE_URL}/api/classes/`, {
        headers: getAuthHeaders()
      });
      
      console.log('Classes API Response:', response.data);
      
      if (response.data.success) {
        setClasses(response.data.data || []);
      } else {
        console.error('Failed to load classes:', response.data.message);
        showToast(response.data.message || 'Failed to load classes', 'error');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      showToast(
        error.response?.data?.message || 
        error.message || 
        'Error loading classes', 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, classes: false }));
    }
  };

  // Fetch academic years from database
  const fetchAcademicYears = async () => {
    try {
      setLoading(prev => ({ ...prev, academicYears: true }));
      const response = await axios.get(
        `${API_BASE_URL}/api/fees/structures/academic-years/`, 
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('Academic Years Response:', response.data);
      
      if (response.data.success) {
        const years = response.data.data || [];
        setAcademicYears(years);
        
        // Set default academic year if none selected
        if (years.length > 0 && !newStructure.academic_year) {
          setNewStructure(prev => ({
            ...prev,
            academic_year: years[0]
          }));
        } else if (years.length === 0) {
          // Generate current academic year
          const currentYear = new Date().getFullYear();
          const currentMonth = new Date().getMonth();
          const defaultYear = currentMonth >= 6 ? 
            `${currentYear}-${currentYear + 1}` : 
            `${currentYear - 1}-${currentYear}`;
          
          setAcademicYears([defaultYear]);
          setNewStructure(prev => ({
            ...prev,
            academic_year: defaultYear
          }));
        }
      } else {
        showToast(response.data.message || 'Failed to load academic years', 'error');
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
      
      // Generate fallback academic year
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const defaultYear = currentMonth >= 6 ? 
        `${currentYear}-${currentYear + 1}` : 
        `${currentYear - 1}-${currentYear}`;
      
      setAcademicYears([defaultYear]);
      setNewStructure(prev => ({
        ...prev,
        academic_year: defaultYear
      }));
      
      showToast('Using fallback academic year', 'warning');
    } finally {
      setLoading(prev => ({ ...prev, academicYears: false }));
    }
  };


  // Fetch fee categories
    const fetchFeeCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await axios.get(`${API_BASE_URL}/api/fees/categories/`, {
        headers: getAuthHeaders(),
        params: {
          search: searchTerm || undefined
        }
      });
      
      console.log('Categories Response:', response.data);
      
      if (response.data.success) {
        setFeeCategories(response.data.data || []);
      } else {
        showToast(response.data.message || 'Failed to load fee categories', 'error');
      }
    } catch (error) {
      console.error('Error fetching fee categories:', error);
      showToast(
        error.response?.data?.message || 
        'Error loading fee categories', 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

    // Fetch fee structures
    const fetchFeeStructures = async () => {
      try {
        setLoading(prev => ({ ...prev, structures: true }));
        const response = await axios.get(`${API_BASE_URL}/api/fees/structures/`, {
          headers: getAuthHeaders(),
          params: {
            academic_year: filters.academic_year || undefined,
            term: filters.term || undefined,
            class_id: filters.class_id || undefined,
            search: searchTerm || undefined
          }
        });
        
        console.log('Structures Response:', response.data);
        
        if (response.data.success) {
          setFeeStructures(response.data.data || []);
        } else {
          showToast(response.data.message || 'Failed to load fee structures', 'error');
        }
      } catch (error) {
        console.error('Error fetching fee structures:', error);
        showToast(
          error.response?.data?.message || 
          'Error loading fee structures', 
          'error'
        );
      } finally {
        setLoading(prev => ({ ...prev, structures: false }));
      }
    };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      const response = await axios.get(`${API_BASE_URL}/api/fees/transactions/`, {
        headers: getAuthHeaders(),
        params: {
          limit: 100,
          status: filters.status || undefined,
          search: searchTerm || undefined
        }
      });
      
      console.log('Transactions Response:', response.data);
      
      if (response.data.success) {
        setTransactions(response.data.data || []);
      } else {
        showToast(response.data.message || 'Failed to load transactions', 'error');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      showToast(
        error.response?.data?.message || 
        'Error loading transactions', 
        'error'
      );
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setLoading(prev => ({ ...prev, statistics: true }));
      
      const [categoriesRes, structuresRes, transactionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/fees/categories/stats/`, {
          headers: getAuthHeaders()
        }),
        axios.get(`${API_BASE_URL}/api/fees/structures/stats/`, {
          headers: getAuthHeaders()
        }),
        axios.get(`${API_BASE_URL}/api/fees/transactions/stats/`, {
          headers: getAuthHeaders()
        })
      ]);

      console.log('Categories Stats:', categoriesRes.data);
      console.log('Structures Stats:', structuresRes.data);
      console.log('Transactions Stats:', transactionsRes.data);

      setStatistics({
        categories: categoriesRes.data.success ? categoriesRes.data.data : { count: 0, active_count: 0 },
        structures: structuresRes.data.success ? structuresRes.data.data : { total: 0, active_count: 0, total_amount: 0 },
        transactions: transactionsRes.data.success ? transactionsRes.data.data : { 
          total_transactions: 0, 
          completed_transactions: 0, 
          pending_transactions: 0, 
          total_collected: 0,
          collection_rate: 0
        }
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      showToast('Error loading statistics', 'error');
    } finally {
      setLoading(prev => ({ ...prev, statistics: false }));
    }
  };


  // Fetch all data
  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchFeeCategories(),
        fetchFeeStructures(),
        fetchTransactions(),
        fetchStatistics(),
        fetchClasses(),
        fetchAcademicYears()
      ]);
      
      showToast('Data refreshed successfully', 'success');
    } catch (error) {
      console.error('Error fetching all data:', error);
      showToast('Error refreshing data', 'error');
    }
  };

  // CRUD Operations for Categories
  const createCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await axios.post(
        `${API_BASE_URL}/api/fees/categories/`, 
        newCategory,
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('Create Category Response:', response.data);
      
      if (response.data.success) {
        setFeeCategories([response.data.data, ...feeCategories]);
        setNewCategory({
          category_code: "",
          category_name: "",
          description: "",
          frequency: "TERM",
          is_mandatory: true,
          is_active: true,
          gl_account_code: ""
        });
        setShowForm({ ...showForm, category: false });
        showToast('Category created successfully', 'success');
      } else {
        showToast(response.data.message || 'Error creating category', 'error');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError)) {
          showToast(firstError[0], 'error');
        } else {
          showToast(firstError, 'error');
        }
      } else {
        showToast(
          error.response?.data?.message || 
          'Error creating category', 
          'error'
        );
      }
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const updateCategory = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await axios.put(
        `${API_BASE_URL}/api/fees/categories/${editingItem.id}/`, 
        editingItem,
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('Update Category Response:', response.data);
      
      if (response.data.success) {
        setFeeCategories(feeCategories.map(item => 
          item.id === editingItem.id ? response.data.data : item
        ));
        setEditingItem(null);
        setEditMode({ ...editMode, category: false });
        setShowForm({ ...showForm, category: false });
        showToast('Category updated successfully', 'success');
      } else {
        showToast(response.data.message || 'Error updating category', 'error');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError)) {
          showToast(firstError[0], 'error');
        } else {
          showToast(firstError, 'error');
        }
      } else {
        showToast(
          error.response?.data?.message || 
          'Error updating category', 
          'error'
        );
      }
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const editCategory = (category) => {
    setEditingItem({...category});
    setEditMode({ ...editMode, category: true });
    setShowForm({ ...showForm, category: true });
  };

  // CRUD Operations for Structures
  const createStructure = async (e) => {
    e.preventDefault();
    try {
      setLoading(prev => ({ ...prev, form: true }));
      const response = await axios.post(`${API_BASE_URL}/api/fees/structures`, newStructure);
      
      if (response.data.success) {
        setFeeStructures([response.data.data, ...feeStructures]);
        
        fetchAcademicYears();
        
        setNewStructure({
          academic_year: academicYears[0] || "",
          term: "TERM_1",
          class_id_id: "",
          category_id: "",
          amount: "",
          due_date: "",
          late_fee_percentage: 5.00,
          late_fee_after_days: 15,
          installment_allowed: false,
          max_installments: 1,
          discount_allowed: false,
          max_discount_percentage: 0,
          is_active: true
        });
        
        setShowForm({ ...showForm, structure: false });
        showToast('Fee structure created successfully', 'success');
      } else {
        showToast(response.data.message || 'Error creating structure', 'error');
      }
    } catch (error) {
      console.error('Error creating structure:', error);
      showToast(error.response?.data?.message || 'Error creating structure', 'error');
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const updateStructure = async (e) => {
    e.preventDefault();
    if (!editingItem) return;
    
    try {
      setLoading(prev => ({ ...prev, form: true }));
      
      // Format the data for Django
      const structureData = {
        ...editingItem,
        class_id: editingItem.class_id_id, // Django expects class_id
        category: editingItem.category_id   // Django expects category
      };
      
      // Remove the _id fields if they exist
      delete structureData.class_id_id;
      delete structureData.category_id;
      
      const response = await axios.put(
        `${API_BASE_URL}/api/fees/structures/${editingItem.id}/`, 
        structureData,
        {
          headers: getAuthHeaders()
        }
      );
      
      console.log('Update Structure Response:', response.data);
      
      if (response.data.success) {
        setFeeStructures(feeStructures.map(item => 
          item.id === editingItem.id ? response.data.data : item
        ));
        setEditingItem(null);
        setEditMode({ ...editMode, structure: false });
        setShowForm({ ...showForm, structure: false });
        showToast('Fee structure updated successfully', 'success');
      } else {
        showToast(response.data.message || 'Error updating structure', 'error');
      }
    } catch (error) {
      console.error('Error updating structure:', error);
      
      if (error.response?.data?.errors) {
        const firstError = Object.values(error.response.data.errors)[0];
        if (Array.isArray(firstError)) {
          showToast(firstError[0], 'error');
        } else {
          showToast(firstError, 'error');
        }
      } else {
        showToast(
          error.response?.data?.message || 
          'Error updating structure', 
          'error'
        );
      }
    } finally {
      setLoading(prev => ({ ...prev, form: false }));
    }
  };

  const editStructure = (structure) => {
    // Map Django field names to React field names
    const mappedStructure = {
      ...structure,
      class_id_id: structure.class_id, // Map class_id to class_id_id
      category_id: structure.category   // Map category to category_id
    };
    
    setEditingItem(mappedStructure);
    setEditMode({ ...editMode, structure: true });
    setShowForm({ ...showForm, structure: true });
  };

  const deleteItem = async (type, id) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;

    try {
      const endpoint = type === 'category' 
        ? `${API_BASE_URL}/api/fees/categories/${id}/`
        : `${API_BASE_URL}/api/fees/structures/${id}/`;
      
      const response = await axios.delete(endpoint, {
        headers: getAuthHeaders()
      });
      
      console.log(`Delete ${type} Response:`, response.data);
      
      if (response.data.success) {
        if (type === 'category') {
          setFeeCategories(feeCategories.filter(item => item.id !== id));
        } else if (type === 'structure') {
          setFeeStructures(feeStructures.filter(item => item.id !== id));
        }
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`, 'success');
      } else {
        showToast(response.data.message || `Error deleting ${type}`, 'error');
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      showToast(
        error.response?.data?.message || 
        `Error deleting ${type}`, 
        'error'
      );
    }
  };

  // FIXED: Use useMemo for filtered data
  const getFilteredStructures = useMemo(() => {
    return feeStructures.filter(structure => {
      const matchesSearch = searchTerm === "" || 
        structure.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        structure.class_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        structure.academic_year?.includes(searchTerm) ||
        structure.category_code?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = !filters.academic_year || structure.academic_year === filters.academic_year;
      const matchesTerm = !filters.term || structure.term === filters.term;
      const matchesClass = !filters.class_id || structure.class_id_id == filters.class_id;

      return matchesSearch && matchesYear && matchesTerm && matchesClass;
    });
  }, [feeStructures, searchTerm, filters]);

  const getFilteredCategories = useMemo(() => {
    return feeCategories.filter(category => {
      return searchTerm === "" || 
        category.category_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [feeCategories, searchTerm]);

  // Helper functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPaymentMethodBadge = (method) => {
    const styles = {
      CASH: "bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200",
      MPESA: "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200",
      BANK_TRANSFER: "bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200",
      CHEQUE: "bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200",
      CREDIT_CARD: "bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200",
      BANK_DEPOSIT: "bg-gradient-to-r from-cyan-100 to-teal-100 text-cyan-800 border border-cyan-200",
      OTHER: "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200"
    };
    return `px-3 py-1.5 rounded-lg text-xs font-medium ${styles[method] || styles.OTHER}`;
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'add_category':
        setShowForm({ ...showForm, category: true });
        setActiveTab('categories');
        break;
      case 'add_structure':
        setShowForm({ ...showForm, structure: true });
        setActiveTab('structures');
        break;
      case 'refresh':
        fetchAllData();
        break;
      case 'export':
        showToast('Export feature coming soon', 'info');
        break;
      default:
        break;
    }
  };

  // Reset form when modal closes
  const resetForms = () => {
    setShowForm({ category: false, structure: false });
    setEditingItem(null);
    setEditMode({ category: false, structure: false });
    
    if (!editMode.category) {
      setNewCategory({
        category_code: "",
        category_name: "",
        description: "",
        frequency: "TERM",
        is_mandatory: true,
        is_active: true,
        gl_account_code: ""
      });
    }
    
    if (!editMode.structure) {
      setNewStructure({
        academic_year: academicYears[0] || "",
        term: "TERM_1",
        class_id_id: "",
        category_id: "",
        amount: "",
        due_date: "",
        late_fee_percentage: 5.00,
        late_fee_after_days: 15,
        installment_allowed: false,
        max_installments: 1,
        discount_allowed: false,
        max_discount_percentage: 0,
        is_active: true
      });
    }
  };

  // Dashboard Statistics Cards
  const StatCard = ({ title, value, subValue, icon: Icon, color, trend }) => {
    const gradientColors = {
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      green: 'from-emerald-500 to-teal-500',
      orange: 'from-amber-500 to-orange-500',
      red: 'from-rose-500 to-pink-500',
      indigo: 'from-indigo-500 to-purple-500'
    };

    const bgColors = {
      blue: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100',
      purple: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100',
      green: 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100',
      orange: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100'
    };

    return (
      <div className={`${bgColors[color]} border-2 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-2">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
            {subValue && (
              <p className={`text-sm mt-2 font-medium ${trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-gray-500'}`}>
                {subValue}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientColors[color]} shadow-md`}>
            <Icon className="text-white text-xl" />
          </div>
        </div>
        <div className="mt-4 h-1.5 w-full bg-gradient-to-r from-transparent via-white to-transparent rounded-full">
          <div className={`h-full rounded-full bg-gradient-to-r ${gradientColors[color]}`}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-slate-100 min-h-screen">
      {/* Toast Notifications Stack */}
      {toasts.map((toast, index) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <FiDollarSign className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Fee Management</h1>
                <p className="text-gray-600">Accountant Portal • Manage fee categories and structures</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => handleQuickAction('refresh')}
              className="px-4 py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-xl flex items-center gap-2 hover:from-gray-200 hover:to-slate-200 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 font-medium"
              disabled={loading.statistics}
            >
              <FiRefreshCw className={loading.statistics ? 'animate-spin' : ''} />
              Refresh Data
            </button>
            <div className="relative">
              <button className="p-3 rounded-xl bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200">
                <FiBell className="text-gray-600" />
              </button>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                3
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Fee Categories"
            value={statistics.categories.count}
            subValue={`${statistics.categories.active_count} active`}
            icon={FiBook}
            color="blue"
          />
          
          <StatCard
            title="Fee Structures Total"
            value={statistics.structures.total}
            subValue={formatCurrency(statistics.structures.total_amount)}
            icon={FiLayers}
            color="purple"
          />
          
          <StatCard
            title="Total Transactions"
            value={statistics.transactions.total_transactions}
            subValue={`${statistics.transactions.completed_transactions} completed`}
            icon={FiCreditCard}
            color="green"
          />
          
          <StatCard
            title="Collection Rate"
            value={`${statistics.transactions.collection_rate}%`}
            subValue={`KES ${formatCurrency(statistics.transactions.total_collected)}`}
            icon={FiBarChart2}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-100 rounded-2xl p-6 mb-8 shadow-lg relative overflow-hidden">
          {/* Decorative gradient border */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500 rounded-l-xl"></div>
          
          <div className="flex justify-between items-center mb-6 ml-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
              <p className="text-gray-600 text-sm mt-1">Common accountant tools and shortcuts</p>
            </div>
            <span className="text-xs font-medium px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full">
              Accountant Tools
            </span>
          </div>
          <div className="flex flex-wrap gap-3 ml-4">
            <button 
              onClick={() => handleQuickAction('add_category')}
              className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-xl flex items-center gap-2 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              <FiPlus className="text-blue-600" />
              New Category
            </button>
            <button 
              onClick={() => handleQuickAction('add_structure')}
              className="px-5 py-3 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl flex items-center gap-2 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              <FiPlus className="text-purple-600" />
              New Structure
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className="px-5 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-xl flex items-center gap-2 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              <FiEye className="text-emerald-600" />
              View Transactions
            </button>
            <button 
              onClick={() => handleQuickAction('export')}
              className="px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-xl flex items-center gap-2 hover:from-amber-100 hover:to-orange-100 border-2 border-amber-200 hover:border-amber-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
            >
              <FiDownload className="text-amber-600" />
              Export Report
            </button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-2xl p-2 mb-6 shadow-lg border border-gray-100">
          <nav className="flex space-x-1">
            {['dashboard', 'categories', 'structures', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 text-sm font-semibold capitalize rounded-xl transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {tab === 'dashboard' && <FiGrid size={16} />}
                  {tab === 'categories' && <FiBook size={16} />}
                  {tab === 'structures' && <FiLayers size={16} />}
                  {tab === 'transactions' && <FiCreditCard size={16} />}
                  {tab === 'dashboard' ? 'Dashboard' : 
                   tab === 'categories' ? 'Categories' :
                   tab === 'structures' ? 'Structures' : 'Transactions'}
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, code, class, or academic year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-200 bg-gray-50"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <select 
                className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition-all duration-200 font-medium"
                value={filters.academic_year}
                onChange={(e) => setFilters({...filters, academic_year: e.target.value})}
              >
                <option value="">All Years</option>
                {academicYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              
              <select 
                className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition-all duration-200 font-medium"
                value={filters.term}
                onChange={(e) => setFilters({...filters, term: e.target.value})}
              >
                <option value="">All Terms</option>
                {availableTerms.map(term => (
                  <option key={term.value} value={term.value}>{term.label}</option>
                ))}
              </select>
              
              <select 
                className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition-all duration-200 font-medium"
                value={filters.class_id}
                onChange={(e) => setFilters({...filters, class_id: e.target.value})}
              >
                <option value="">All Classes</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} ({cls.class_code})
                  </option>
                ))}
              </select>
              
              {activeTab === 'transactions' && (
                <select 
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-gray-50 transition-all duration-200 font-medium"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              )}
              
              <button className="px-4 py-3 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 rounded-xl hover:from-gray-200 hover:to-slate-200 border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md transition-all duration-200 font-medium">
                <FiFilter />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Overview Dashboard</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Structures */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-gray-800">Recent Fee Structures</h4>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All →
                  </button>
                </div>
                <div className="space-y-4">
                  {feeStructures.slice(0, 5).map(structure => (
                    <div key={structure.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{structure.category_name}</p>
                          <p className="text-sm text-gray-600 mt-1">{structure.class_name} • {structure.academic_year}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-lg">{formatCurrency(structure.amount)}</p>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${structure.is_active ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800' : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800'}`}>
                            {structure.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <FiCalendar size={12} />
                          Due: {formatDate(structure.due_date)}
                        </span>
                        <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                        <span>{structure.term.replace('_', ' ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-bold text-gray-800">Recent Transactions</h4>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View All →
                  </button>
                </div>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map(transaction => (
                    <div key={transaction.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{transaction.admission_no}</p>
                          <p className="text-sm text-gray-600 mt-1">{transaction.first_name} {transaction.last_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-800 text-lg">{formatCurrency(transaction.amount_kes)}</p>
                          <span className={getPaymentMethodBadge(transaction.payment_mode)}>
                            {transaction.payment_mode}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-500 flex items-center justify-between">
                        <span>{transaction.transaction_no}</span>
                        <span>{formatDate(transaction.payment_date)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Fee Categories</h3>
                <p className="text-gray-600 mt-1">Manage all fee categories and their settings</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleQuickAction('add_category')}
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm flex items-center gap-2 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  <FiPlus size={16} />
                  Add Category
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Frequency</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">GL Account</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getFilteredCategories.map(category => (
                    <tr key={category.id} className="hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-cyan-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <code className="text-blue-600 font-mono text-sm bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-1.5 rounded-lg border border-blue-200 font-bold">
                          {category.category_code}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-800">{category.category_name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 max-w-xs truncate">{category.description || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-700">{category.frequency}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${category.is_mandatory ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200' : 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border border-emerald-200'}`}>
                          {category.is_mandatory ? 'Mandatory' : 'Optional'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">{category.gl_account_code || '-'}</code>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${category.is_active ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200' : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200'}`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => editCategory(category)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border border-transparent hover:border-blue-200 transition-all duration-200"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteItem('category', category.id)}
                            className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 border border-transparent hover:border-rose-200 transition-all duration-200"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredCategories.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                    <FiBook className="text-blue-400 text-3xl" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No fee categories found</p>
                  <p className="text-gray-400 text-sm mt-2 mb-6">Create your first fee category to get started</p>
                  <button 
                    onClick={() => handleQuickAction('add_category')}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <FiPlus size={18} />
                      Create New Category
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Structures Tab */}
        {activeTab === 'structures' && (
          <div>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Fee Structures</h3>
                <p className="text-gray-600 mt-1">Configure fee structures for different academic periods</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleQuickAction('add_structure')}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm flex items-center gap-2 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                >
                  <FiPlus size={16} />
                  Add Structure
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Academic Year</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Class</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Late Fee</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Installments</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {getFilteredStructures.map(structure => (
                    <tr key={structure.id} className="hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-pink-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{structure.academic_year}</p>
                          <p className="text-xs text-gray-500">{structure.term.replace('_', ' ')}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{structure.class_name}</p>
                          <p className="text-xs text-gray-500">Level {structure.numeric_level}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{structure.category_name}</p>
                          <p className="text-xs text-gray-500">{structure.category_code}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-lg">{formatCurrency(structure.amount)}</p>
                        <div className="flex gap-2 mt-2">
                          {structure.installment_allowed && (
                            <span className="text-xs font-semibold bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-2 py-1 rounded-lg border border-blue-200">Installments</span>
                          )}
                          {structure.discount_allowed && (
                            <span className="text-xs font-semibold bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200">Discounts</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-800">{formatDate(structure.due_date)}</p>
                      </td>
                      <td className="px-6 py-4">
                        {structure.late_fee_percentage > 0 ? (
                          <div>
                            <p className="text-sm font-bold text-rose-600">{structure.late_fee_percentage}%</p>
                            <p className="text-xs text-gray-500">after {structure.late_fee_after_days} days</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 font-medium">None</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {structure.installment_allowed ? (
                          <p className="text-sm font-semibold">Max {structure.max_installments}</p>
                        ) : (
                          <p className="text-sm text-gray-400 font-medium">Not allowed</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${structure.is_active ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200' : 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200'}`}>
                          {structure.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => editStructure(structure)}
                            className="p-2 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 border border-transparent hover:border-blue-200 transition-all duration-200"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteItem('structure', structure.id)}
                            className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-gradient-to-r hover:from-rose-50 hover:to-pink-50 border border-transparent hover:border-rose-200 transition-all duration-200"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {getFilteredStructures.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-100">
                    <FiLayers className="text-purple-400 text-3xl" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No fee structures found</p>
                  <p className="text-gray-400 text-sm mt-2 mb-6">Create your first fee structure to get started</p>
                  <button 
                    onClick={() => handleQuickAction('add_structure')}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <FiPlus size={18} />
                      Create New Structure
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions Tab (View Only) */}
        {activeTab === 'transactions' && (
          <div>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Fee Transactions</h3>
                <p className="text-gray-600 mt-1">View all fee payments processed by bursar department</p>
              </div>
              <p className="text-sm text-gray-500 font-medium px-3 py-1.5 bg-gradient-to-r from-gray-100 to-slate-100 rounded-lg border border-gray-200">
                View Only
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Transaction No</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map(transaction => (
                    <tr key={transaction.id} className="hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <p className="font-bold text-blue-600">{transaction.transaction_no}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-800">{transaction.first_name} {transaction.last_name}</p>
                          <p className="text-sm text-gray-500">{transaction.admission_no}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium">{formatDate(transaction.payment_date)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800 text-lg">{formatCurrency(transaction.amount_kes)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={getPaymentMethodBadge(transaction.payment_mode)}>
                          {transaction.payment_mode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                          transaction.status === 'COMPLETED' ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200' :
                          transaction.status === 'PENDING' ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border border-amber-200' :
                          transaction.status === 'VERIFIED' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200' :
                          'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200'
                        }`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-gray-600">{transaction.payment_reference || '-'}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                    <FiCreditCard className="text-emerald-400 text-3xl" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No transactions found</p>
                  <p className="text-gray-400 text-sm mt-2">Transactions will appear here when payments are processed</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      <Modal 
        show={showForm.category} 
        onClose={resetForms}
        title={editMode.category ? "Edit Fee Category" : "Create New Fee Category"}
      >
        <CategoryForm 
          isEditMode={editMode.category}
          editingItem={editingItem}
          newCategory={newCategory}
          onCategoryChange={handleCategoryChange}
          onStructureChange={handleStructureChange}
          frequencies={frequencies}
          academicYears={academicYears}
          availableTerms={availableTerms}
          classes={classes}
          feeCategories={feeCategories}
          onSubmit={editMode.category ? updateCategory : createCategory}
          onCancel={resetForms}
          loading={loading.form}
          onStructureSubmit={editMode.structure ? updateStructure : createStructure}
          isStructureEditMode={editMode.structure}
          newStructure={newStructure}
          structureLoading={loading.form}
        />
      </Modal>

      {/* Structure Modal */}
      <Modal 
        show={showForm.structure} 
        onClose={resetForms}
        title={editMode.structure ? "Edit Fee Structure" : "Create Fee Structure"}
      >
        <StructureForm 
          isEditMode={editMode.category}
          editingItem={editingItem}
          newCategory={newCategory}
          onCategoryChange={handleCategoryChange}
          onStructureChange={handleStructureChange}
          frequencies={frequencies}
          academicYears={academicYears}
          availableTerms={availableTerms}
          classes={classes}
          feeCategories={feeCategories}
          onSubmit={editMode.category ? updateCategory : createCategory}
          onCancel={resetForms}
          loading={loading.form}
          onStructureSubmit={editMode.structure ? updateStructure : createStructure}
          isStructureEditMode={editMode.structure}
          newStructure={newStructure}
          structureLoading={loading.form}
        />
      </Modal>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-toast-progress {
          animation: toastProgress 4s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default FeeManagement;