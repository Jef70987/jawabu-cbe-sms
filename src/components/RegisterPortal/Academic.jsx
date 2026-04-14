/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  Plus, Trash2, RefreshCw, Calendar, BookOpen,
  Layers, Target, CheckCircle, AlertCircle, X, Loader2,
  ChevronRight, FolderTree, GraduationCap, Clock,
  Award, Users, FileText, Link, Unlink, UserCheck, UserPlus, UserMinus, Globe, Search,
  Pencil
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ─────────────────────────────────────────────────────────────────────────────
//  O(1) REQUEST CACHE & DEDUPLICATION  (module-level — survives re-renders)
// ─────────────────────────────────────────────────────────────────────────────
const _cache   = new Map();
const _pending = new Map();
const CACHE_TTL_MS = 30_000; // 30 s

function invalidateCachePrefix(prefix) {
  for (const key of _cache.keys()) {
    if (key.includes(prefix)) _cache.delete(key);
  }
}

function flushCache() {
  _cache.clear();
  _pending.clear();
}

// ─────────────────────────────────────────────────────────────────────────────
//  DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const toMidnight = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

function getActiveTermFromDates(terms) {
  if (!terms?.length) return null;
  const today = toMidnight(new Date());
  return terms.find(t => {
    const s = toMidnight(t.start_date);
    const e = toMidnight(t.end_date);
    return today >= s && today <= e;
  }) ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
//  TERM COUNTDOWN
// ─────────────────────────────────────────────────────────────────────────────
function TermCountdown({ term }) {
  const MS = 86_400_000;
  const today = toMidnight(new Date());
  const start = toMidnight(term.start_date);
  const end   = toMidnight(term.end_date);

  if (today < start) {
    const days = Math.round((start - today) / MS);
    if (days === 1) return <p className="text-xs text-blue-500 mt-1">Starts tomorrow</p>;
    return <p className="text-xs text-gray-400 mt-1">Starts in {days} days</p>;
  }
  if (today.getTime() === end.getTime()) {
    return <p className="text-xs text-orange-500 font-medium mt-1">Ends today</p>;
  }
  if (today < end) {
    const days = Math.round((end - today) / MS);
    return <p className="text-xs text-green-600 font-medium mt-1">{days} day{days !== 1 ? 's' : ''} remaining</p>;
  }
  const days = Math.round((today - end) / MS);
  return <p className="text-xs text-gray-400 mt-1">Ended {days} day{days !== 1 ? 's' : ''} ago</p>;
}

// ─────────────────────────────────────────────────────────────────────────────
//  UI PRIMITIVES
// ─────────────────────────────────────────────────────────────────────────────
const SessionExpiredModal = ({ isOpen, onLogout }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4"><AlertCircle className="h-8 w-8 text-red-500 mr-3"/><h3 className="text-xl font-semibold text-gray-900">Session Expired</h3></div>
        <p className="text-gray-600 mb-6">Your session has expired. Please login again to continue.</p>
        <div className="flex justify-end"><button onClick={onLogout} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Logout</button></div>
      </div>
    </div>
  );
};

const Notification = ({ type, message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 5000); return () => clearTimeout(t); }, [onClose]);
  const icons  = { success:<CheckCircle className="h-5 w-5 text-green-500"/>, error:<AlertCircle className="h-5 w-5 text-red-500"/>, warning:<AlertCircle className="h-5 w-5 text-yellow-500"/>, info:<FileText className="h-5 w-5 text-blue-500"/> };
  const styles = { success:'bg-green-50 border-green-200 text-green-800', error:'bg-red-50 border-red-200 text-red-800', warning:'bg-yellow-50 border-yellow-200 text-yellow-800', info:'bg-blue-50 border-blue-200 text-blue-800' };
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${styles[type]} animate-slide-in`}>
      {icons[type]}<p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-4"><X className="h-4 w-4"/></button>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type='warning' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4"><AlertCircle className={`h-6 w-6 ${type==='danger'?'text-red-500':'text-yellow-500'} mr-3`}/><h3 className="text-lg font-semibold text-gray-900">{title}</h3></div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg ${type==='danger'?'bg-red-600 hover:bg-red-700':'bg-blue-600 hover:bg-blue-700'}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const FormModal = ({ isOpen, onClose, onSubmit, title, children, submitText='Save', loading=false }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5"/></button>
        </div>
        <div className="p-6">{children}</div>
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={onSubmit} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            {loading&&<Loader2 className="h-4 w-4 animate-spin"/>}{submitText}
          </button>
        </div>
      </div>
    </div>
  );
};

const GradingScale = () => {
  const levels = [
    {r:'EE',sub:1,color:'bg-green-100 text-green-800',pct:'80-100%',pts:8},{r:'EE',sub:2,color:'bg-green-100 text-green-800',pct:'70-79%',pts:7},
    {r:'ME',sub:1,color:'bg-blue-100 text-blue-800',pct:'60-69%',pts:6},{r:'ME',sub:2,color:'bg-blue-100 text-blue-800',pct:'50-59%',pts:5},
    {r:'AE',sub:1,color:'bg-yellow-100 text-yellow-800',pct:'40-49%',pts:4},{r:'AE',sub:2,color:'bg-yellow-100 text-yellow-800',pct:'30-39%',pts:3},
    {r:'BE',sub:1,color:'bg-red-100 text-red-800',pct:'20-29%',pts:2},{r:'BE',sub:2,color:'bg-red-100 text-red-800',pct:'0-19%',pts:1},
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><Award className="h-4 w-4"/>CBC Grading Scale (8 Levels)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {levels.map((l,i)=><div key={i} className={`${l.color} rounded-lg p-2 text-center border`}><div className="font-bold text-sm">{l.r}{l.sub}</div><div className="text-xs">{l.pct}</div><div className="text-xs font-medium mt-1">{l.pts} pts</div></div>)}
      </div>
    </div>
  );
};

const CompetencyTable = ({ classData, competencies, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
      <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Competencies — {classData?.class_name} (Level {classData?.numeric_level})</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5"/></button>
      </div>
      <div className="p-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50"><tr>{['Learning Area','Strand','Sub-strand','Code','Statement','Type'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-200">
            {competencies.map((c,i)=>(
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{c.learning_area}</td><td className="px-4 py-3 text-sm">{c.strand}</td>
                <td className="px-4 py-3 text-sm">{c.substrand}</td><td className="px-4 py-3 text-sm font-mono text-blue-600">{c.competency_code}</td>
                <td className="px-4 py-3 text-sm">{c.competency_statement}</td>
                <td className="px-4 py-3 text-sm"><span className={`px-2 py-1 text-xs rounded-full ${c.is_core?'bg-blue-100 text-blue-800':'bg-gray-100 text-gray-800'}`}>{c.is_core?'Core':'Supplementary'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AssignSubjectModal = ({ isOpen, onClose, onSubmit, allLearningAreas, assignedAreaIds, loading }) => {
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [displayOrder, setDisplayOrder]     = useState('');
  const available = allLearningAreas.filter(a=>!assignedAreaIds.includes(a.id));
  const handleSubmit = () => { if(!selectedAreaId)return; onSubmit({learning_area_id:selectedAreaId,display_order:displayOrder||1}); setSelectedAreaId(''); setDisplayOrder(''); };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-800">Assign Subject to Grade</h3><button onClick={onClose}><X className="h-5 w-5 text-gray-400"/></button></div>
        {available.length===0?<p className="text-sm text-gray-500 py-4 text-center">All available subjects are already assigned.</p>:(
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Subject / Learning Area *</label><select value={selectedAreaId} onChange={e=>setSelectedAreaId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="">Select Subject</option>{available.map(a=><option key={a.id} value={a.id}>{a.area_name} ({a.area_code}) — {a.area_type}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label><input type="number" value={displayOrder} onChange={e=>setDisplayOrder(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" placeholder="1"/></div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
          {available.length>0&&<button onClick={handleSubmit} disabled={!selectedAreaId||loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">{loading&&<Loader2 className="h-4 w-4 animate-spin"/>}Assign</button>}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  TEACHER ASSIGNMENT TAB
// ─────────────────────────────────────────────────────────────────────────────
const TeacherAssignmentTab = ({ getAuthHeaders, handleApiError, addNotification }) => {
  const [teachersList,   setTeachersList]   = useState([]);
  const [classesList,    setClassesList]    = useState([]);
  const [areasList,      setAreasList]      = useState([]);
  const [assignments,    setAssignments]    = useState([]);
  const [loadingData,    setLoadingData]    = useState(true);
  const [submitting,     setSubmitting]     = useState(false);
  const [showForm,       setShowForm]       = useState(false);
  const [delConfirm,     setDelConfirm]     = useState(null);
  const [searchTeacher,  setSearchTeacher]  = useState('');
  const [filterClass,    setFilterClass]    = useState('');
  const [filterArea,     setFilterArea]     = useState('');
  const [form, setForm] = useState({teacher_id:'',class_id:'',learning_area_id:''});

  const cachedGet = useCallback(async url => {
    const hit = _cache.get(url);
    if (hit && Date.now()<hit.expiresAt) return hit.data;
    if (_pending.has(url)) return _pending.get(url);
    const p = fetch(url,{headers:getAuthHeaders()}).then(async res=>{
      _pending.delete(url);
      if(res.status===401){handleApiError({status:401});return null;}
      const data=await res.json();
      _cache.set(url,{data,expiresAt:Date.now()+CACHE_TTL_MS});
      return data;
    }).catch(e=>{_pending.delete(url);throw e;});
    _pending.set(url,p);
    return p;
  },[getAuthHeaders,handleApiError]);

  const fetchAll = useCallback(async()=>{
    setLoadingData(true);
    try {
      const [t,c,a,as_] = await Promise.all([
        cachedGet(`${API_BASE_URL}/api/registrar/users/teachers/`),
        cachedGet(`${API_BASE_URL}/api/registrar/classes/`),
        cachedGet(`${API_BASE_URL}/api/registrar/academic/learning-areas/`),
        cachedGet(`${API_BASE_URL}/api/registrar/academic/teacher-assignments/`),
      ]);
      if(t?.success)  setTeachersList(t.data);
      if(c?.success)  setClassesList(c.data);
      if(a?.success)  setAreasList(a.data);
      if(as_?.success)setAssignments(as_.data);
    } catch { addNotification('error','Failed to load assignment data'); }
    finally { setLoadingData(false); }
  },[cachedGet,addNotification]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const mutate = async(url,opts,successMsg)=>{
    setSubmitting(true);
    try {
      const res=await fetch(url,{headers:getAuthHeaders(),...opts});
      if(res.status===401){handleApiError({status:401});return;}
      const data=await res.json();
      if(data?.success){
        invalidateCachePrefix('/api/registrar/academic/teacher-assignments');
        addNotification('success',data.message||successMsg);
        setShowForm(false); setDelConfirm(null);
        setForm({teacher_id:'',class_id:'',learning_area_id:''});
        fetchAll();
      } else addNotification('error',data?.error||'Operation failed');
    } catch {addNotification('error','Network error');}
    finally {setSubmitting(false);}
  };

  const filtered = assignments.filter(a=>{
    const mt=!searchTeacher||a.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase());
    const mc=!filterClass||String(a.class_id)===filterClass;
    const ma=!filterArea||String(a.learning_area_id)===filterArea;
    return mt&&mc&&ma;
  });

  const grouped = filtered.reduce((acc,a)=>{
    if(!acc[a.teacher_id])acc[a.teacher_id]={teacher_name:a.teacher_name,teacher_email:a.teacher_email,employee_id:a.employee_id,items:[]};
    acc[a.teacher_id].items.push(a);
    return acc;
  },{});

  if(loadingData)return<div className="flex justify-center items-center h-64"><Loader2 className="h-10 w-10 text-blue-600 animate-spin"/></div>;

  return(
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-4 flex items-center gap-3">
        <UserCheck className="h-8 w-8 text-indigo-600 flex-shrink-0"/>
        <div><h3 className="font-semibold text-indigo-800">Teacher — Class — Subject Assignments</h3><p className="text-sm text-indigo-600">Assign teachers to specific classes and learning areas.</p></div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-3 flex-1">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"/><input type="text" placeholder="Search teacher..." value={searchTeacher} onChange={e=>setSearchTeacher(e.target.value)} className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm w-48 focus:ring-2 focus:ring-blue-500"/></div>
            <select value={filterClass} onChange={e=>setFilterClass(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">All Classes</option>{classesList.map(c=><option key={c.id} value={c.id}>{c.class_name}</option>)}</select>
            <select value={filterArea} onChange={e=>setFilterArea(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm"><option value="">All Subjects</option>{areasList.map(a=><option key={a.id} value={a.id}>{a.area_name}</option>)}</select>
          </div>
          <button onClick={()=>setShowForm(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm whitespace-nowrap"><UserPlus className="h-4 w-4"/>Assign Teacher</button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{label:'Total Assignments',value:assignments.length,color:'text-blue-600',bg:'bg-blue-50'},{label:'Teachers Assigned',value:Object.keys(grouped).length,color:'text-indigo-600',bg:'bg-indigo-50'},{label:'Classes Covered',value:[...new Set(assignments.map(a=>a.class_id))].length,color:'text-green-600',bg:'bg-green-50'}].map(s=>(
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-200`}><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-sm text-gray-600 mt-1">{s.label}</p></div>
        ))}
      </div>
      {Object.keys(grouped).length===0?(
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><Users className="h-12 w-12 text-gray-300 mx-auto mb-3"/><p className="text-gray-500 font-medium">No assignments found</p><p className="text-gray-400 text-sm mt-1">Click "Assign Teacher" to get started</p></div>
      ):(
        <div className="space-y-4">
          {Object.entries(grouped).map(([tid,group])=>(
            <div key={tid} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center"><span className="text-indigo-700 font-bold text-sm">{group.teacher_name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase()}</span></div>
                <div><p className="font-semibold text-gray-800">{group.teacher_name}</p><p className="text-xs text-gray-500">{group.teacher_email}{group.employee_id?` · ID: ${group.employee_id}`:''}</p></div>
                <span className="ml-auto px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">{group.items.length} assignment{group.items.length!==1?'s':''}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map(a=>(
                  <div key={a.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4 text-blue-500"/><span className="text-sm font-medium text-gray-800">{a.class_name}</span>{a.numeric_level&&<span className="text-xs text-gray-400">Level {a.numeric_level}</span>}</div>
                      <ChevronRight className="h-4 w-4 text-gray-300"/>
                      <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-green-500"/><span className="text-sm text-gray-700">{a.learning_area_name}</span><span className="text-xs text-gray-400">({a.learning_area_code})</span></div>
                    </div>
                    <button onClick={()=>setDelConfirm({id:a.id,name:`${group.teacher_name} — ${a.class_name} — ${a.learning_area_name}`})} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><UserMinus className="h-4 w-4"/></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <FormModal isOpen={showForm} onClose={()=>{setShowForm(false);setForm({teacher_id:'',class_id:'',learning_area_id:''}); }} onSubmit={()=>mutate(`${API_BASE_URL}/api/registrar/academic/teacher-assignments/create/`,{method:'POST',body:JSON.stringify(form)},'Assignment created')} title="Assign Teacher to Class & Subject" submitText="Assign" loading={submitting}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Teacher *</label><select value={form.teacher_id} onChange={e=>setForm({...form,teacher_id:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="">Select Teacher</option>{teachersList.map(t=><option key={t.id} value={t.id}>{t.full_name}{t.employee_id?` (${t.employee_id})`:''}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Class *</label><select value={form.class_id} onChange={e=>setForm({...form,class_id:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="">Select Class</option>{classesList.map(c=><option key={c.id} value={c.id}>{c.class_name}{c.numeric_level?` (Level ${c.numeric_level})`:''}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Learning Area / Subject *</label><select value={form.learning_area_id} onChange={e=>setForm({...form,learning_area_id:e.target.value})} className="w-full border border-gray-300 rounded-lg px-3 py-2"><option value="">Select Learning Area</option>{areasList.map(a=><option key={a.id} value={a.id}>{a.area_name} ({a.area_code})</option>)}</select></div>
        </div>
      </FormModal>
      <ConfirmationModal isOpen={!!delConfirm} onClose={()=>setDelConfirm(null)} onConfirm={()=>mutate(`${API_BASE_URL}/api/registrar/academic/teacher-assignments/${delConfirm?.id}/delete/`,{method:'DELETE'},'Assignment removed')} title="Remove Assignment" message={`Remove: "${delConfirm?.name}"?`} type="danger"/>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  SUBJECT SECTION
// ─────────────────────────────────────────────────────────────────────────────
const SubjectSection = ({ title, subtitle, subjects, assignedAreaIds, selectedGradeClass, onAssignToAllGrades, onDelete, badgeStyle, headerStyle }) => {
  if (!subjects.length) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className={`px-5 py-3 border-b border-gray-200 flex items-center justify-between ${headerStyle}`}>
        <div><h3 className="font-semibold text-sm">{title}</h3><p className="text-xs mt-0.5 opacity-75">{subtitle} · {subjects.length} subject{subjects.length!==1?'s':''}</p></div>
        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${badgeStyle}`}>{subjects.length}</span>
      </div>
      <div className="divide-y divide-gray-100">
        {subjects.map(area=>{
          const isAssigned=assignedAreaIds.includes(area.id);
          return(
            <div key={area.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${area.area_type==='Core'?'bg-blue-100 text-blue-700':area.area_type==='Optional'?'bg-yellow-100 text-yellow-700':'bg-gray-100 text-gray-700'}`}>{area.area_code?.slice(0,3)}</div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{area.area_name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap"><span className="text-xs text-gray-400">{area.area_code}</span>{!area.is_active&&<span className="px-1.5 py-0.5 text-xs rounded-full bg-red-100 text-red-600">Inactive</span>}{area.description&&<span className="text-xs text-gray-400 truncate max-w-xs hidden md:block">{area.description}</span>}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                {isAssigned&&selectedGradeClass?(<span className="px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg flex items-center gap-1 font-medium"><CheckCircle className="h-3 w-3"/>Assigned</span>):(<button onClick={()=>onAssignToAllGrades(area.id,area.area_name)} className="px-3 py-1.5 text-xs bg-green-50 text-green-700 border border-green-200 rounded-lg hover:bg-green-100 flex items-center gap-1 transition-colors"><Link className="h-3 w-3"/>Assign to All Grades</button>)}
                <button onClick={()=>onDelete(area.id,area.area_name)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="h-4 w-4"/></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function AcademicManagement() {
  const { user, getAuthHeaders, isAuthenticated, logout } = useAuth();

  const [activeTab,setActiveTab]         = useState('academic-calendar');
  const [loading,setLoading]             = useState(false);
  const [error,setError]                 = useState(null);
  const [success,setSuccess]             = useState(null);
  const [showModal,setShowModal]         = useState(false);
  const [modalType,setModalType]         = useState('');
  const [formData,setFormData]           = useState({});
  const [deleteConfirm,setDeleteConfirm] = useState(null);
  const [submitting,setSubmitting]       = useState(false);
  const [editingYear,setEditingYear]     = useState(null);
  const [editingTerm,setEditingTerm]     = useState(null);
  const [editSubmitting,setEditSubmitting]= useState(false);
  const [showCompetencyTable,setShowCompetencyTable] = useState(false);
  const [selectedClassForCompetencies,setSelectedClassForCompetencies] = useState(null);
  const [classCompetencies,setClassCompetencies]     = useState([]);
  const [showSessionExpired,setShowSessionExpired]   = useState(false);
  const [academicYears,setAcademicYears]             = useState([]);
  const [terms,setTerms]                             = useState([]);
  const [selectedAcademicYear,setSelectedAcademicYear] = useState(null);
  const [activeTerm,setActiveTerm]                   = useState(null);
  const [allLearningAreas,setAllLearningAreas]       = useState([]);
  const [classes,setClasses]                         = useState([]);
  const [selectedGradeClass,setSelectedGradeClass]   = useState(null);
  const [gradeMappings,setGradeMappings]             = useState([]);
  const [gradeMappingsLoading,setGradeMappingsLoading] = useState(false);
  const [showAssignSubjectModal,setShowAssignSubjectModal] = useState(false);
  const [assignSubjectLoading,setAssignSubjectLoading]     = useState(false);
  const [selectedGradeArea,setSelectedGradeArea]     = useState(null);
  const [strands,setStrands]                         = useState([]);
  const [substrands,setSubstrands]                   = useState([]);
  const [competencies,setCompetencies]               = useState([]);
  const [selectedStrand,setSelectedStrand]           = useState(null);
  const [selectedSubstrand,setSelectedSubstrand]     = useState(null);
  const [curriculumView,setCurriculumView]           = useState('grade-curriculum');

  // ── FIX: guard against re-entrant autoFixCurrentTerm calls ──────────────
  const autoFixRunning = useRef(false);

  const addNotification = useCallback((type,msg)=>{
    if(type==='error'||type==='warning')setError(msg); else if(type==='success')setSuccess(msg);
    setTimeout(()=>{setError(null);setSuccess(null);},5000);
  },[]);
  const handleApiError = useCallback(err=>{ if(err?.status===401)setShowSessionExpired(true); },[]);
  const handleLogout   = ()=>{ setShowSessionExpired(false); logout(); window.location.href='/logout'; };

  // ── Cached fetch — O(1) cache + O(1) dedup ──────────────────────────────
  const apiFetch = useCallback(async(url,opts={})=>{
    const isRead=!opts.method||opts.method==='GET';
    if(isRead){
      const hit=_cache.get(url);
      if(hit&&Date.now()<hit.expiresAt) return hit.data;
      if(_pending.has(url)) return _pending.get(url);
      const p=fetch(url,{headers:getAuthHeaders(),...opts}).then(async res=>{
        _pending.delete(url);
        if(res.status===401){handleApiError({status:401});return null;}
        const data=await res.json();
        _cache.set(url,{data,expiresAt:Date.now()+CACHE_TTL_MS});
        return data;
      }).catch(e=>{_pending.delete(url);throw e;});
      _pending.set(url,p);
      return p;
    }
    // Mutations: fire directly, invalidate related prefix
    const res=await fetch(url,{headers:getAuthHeaders(),...opts});
    if(res.status===401){handleApiError({status:401});return null;}
    const data=await res.json();
    const prefix=url.replace(API_BASE_URL,'').split('/').slice(0,5).join('/');
    invalidateCachePrefix(prefix);
    return data;
  },[getAuthHeaders,handleApiError]);

  // Bootstrap — single batch on mount
  useEffect(()=>{ if(isAuthenticated){fetchAcademicYears();fetchAllLearningAreas();fetchClasses();} },[isAuthenticated]); // eslint-disable-line

  // Resolve active term from real dates every time terms changes
  useEffect(()=>{
    if(!terms.length) return;
    const found=getActiveTermFromDates(terms);
    setActiveTerm(found??null);
    if(found&&!found.is_current) autoFixCurrentTerm(found,terms);
  },[terms]); // eslint-disable-line

  useEffect(()=>{ if(selectedAcademicYear) fetchTerms(selectedAcademicYear.id); },[selectedAcademicYear]); // eslint-disable-line

  // ── FIX: use apiFetch so Content-Type header is set correctly,
  //         and guard with autoFixRunning ref to prevent infinite loop
  //         (terms effect → autoFix → fetchTerms → terms effect → …)
  const autoFixCurrentTerm = useCallback(async (correct, all) => {
    if (autoFixRunning.current) return;
    autoFixRunning.current = true;
    try {
      const stale = all.filter(t => t.is_current && t.id !== correct.id);
      await Promise.all(
        stale.map(t =>
          apiFetch(`${API_BASE_URL}/api/registrar/academic/terms/${t.id}/`, {
            method: 'PUT',
            body: JSON.stringify({ is_current: false }),
          })
        )
      );
      await apiFetch(`${API_BASE_URL}/api/registrar/academic/terms/${correct.id}/`, {
        method: 'PUT',
        body: JSON.stringify({ is_current: true }),
      });
      invalidateCachePrefix('/api/registrar/academic/terms');
      if (selectedAcademicYear) fetchTerms(selectedAcademicYear.id);
    } catch {
      /* silent — non-critical background sync */
    } finally {
      autoFixRunning.current = false;
    }
  }, [apiFetch, selectedAcademicYear]); // eslint-disable-line

  // ── Fetchers ────────────────────────────────────────────────────────────
  const fetchAcademicYears=async()=>{
    setLoading(true);
    try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/academic-years/`);if(data?.success){setAcademicYears(data.data);const cur=data.data.find(y=>y.is_current);setSelectedAcademicYear(cur||data.data[0]||null);}}
    catch{addNotification('error','Failed to fetch academic years');}finally{setLoading(false);}
  };
  const fetchTerms=async yearId=>{try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/terms/?academic_year=${yearId}`);if(data?.success)setTerms(data.data);}catch{addNotification('error','Failed to fetch terms');}};
  const fetchClasses=async()=>{try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/classes/`);if(data?.success)setClasses(data.data);}catch{addNotification('error','Failed to fetch classes');}};
  const fetchAllLearningAreas=async()=>{try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/learning-areas/`);if(data?.success)setAllLearningAreas(data.data);}catch{addNotification('error','Failed to fetch learning areas');}};
  const fetchGradeMappings=async lvl=>{setGradeMappingsLoading(true);try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/curriculum-mappings/?grade_level=${lvl}`);if(data?.success)setGradeMappings(data.data);else setGradeMappings([]);}catch{addNotification('error','Failed to fetch grade subjects');}finally{setGradeMappingsLoading(false);}};
  const fetchStrands=async(aId,lvl=null)=>{try{let u=`${API_BASE_URL}/api/registrar/academic/strands/?learning_area=${aId}`;if(lvl!==null)u+=`&numeric_level=${lvl}`;const data=await apiFetch(u);if(data?.success)setStrands(data.data);}catch{addNotification('error','Failed to fetch strands');}};
  const fetchSubstrands=async sId=>{try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/substrands/?strand=${sId}`);if(data?.success)setSubstrands(data.data);}catch{addNotification('error','Failed to fetch substrands');}};
  const fetchCompetencies=async ssId=>{try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/competencies/?substrand=${ssId}`);if(data?.success)setCompetencies(data.data);}catch{addNotification('error','Failed to fetch competencies');}};

  // ── Edit handlers ────────────────────────────────────────────────────────
  const handleUpdateAcademicYear=async()=>{
    if(!editingYear?.year_name||!editingYear?.year_code||!editingYear?.start_date||!editingYear?.end_date){addNotification('warning','Fill all required fields');return;}
    setEditSubmitting(true);
    try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/academic-years/${editingYear.id}/`,{method:'PUT',body:JSON.stringify({year_name:editingYear.year_name,year_code:editingYear.year_code,start_date:editingYear.start_date,end_date:editingYear.end_date,is_current:editingYear.is_current})});if(data?.success){addNotification('success','Academic year updated');setEditingYear(null);fetchAcademicYears();}else addNotification('error',data?.error||'Update failed');}
    catch{addNotification('error','Network error');}finally{setEditSubmitting(false);}
  };

  const handleUpdateTerm=async()=>{
    if(!editingTerm?.term||!editingTerm?.start_date||!editingTerm?.end_date){addNotification('warning','Fill all required fields');return;}
    setEditSubmitting(true);
    try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/terms/${editingTerm.id}/`,{method:'PUT',body:JSON.stringify({term:editingTerm.term,start_date:editingTerm.start_date,end_date:editingTerm.end_date,is_current:editingTerm.is_current})});if(data?.success){addNotification('success','Term updated');setEditingTerm(null);if(selectedAcademicYear)fetchTerms(selectedAcademicYear.id);}else addNotification('error',data?.error||'Update failed');}
    catch{addNotification('error','Network error');}finally{setEditSubmitting(false);}
  };

  // ── Curriculum helpers ────────────────────────────────────────────────────
  const handleSelectGradeClass=async cls=>{setSelectedGradeClass(cls);setSelectedGradeArea(null);setSelectedStrand(null);setSelectedSubstrand(null);setStrands([]);setSubstrands([]);setCompetencies([]);setGradeMappings([]);await fetchGradeMappings(cls.numeric_level);};
  const handleSelectGradeArea =async area=>{setSelectedGradeArea(area);setSelectedStrand(null);setSelectedSubstrand(null);setStrands([]);setSubstrands([]);setCompetencies([]);if(selectedGradeClass?.numeric_level)await fetchStrands(area.id,selectedGradeClass.numeric_level);};
  const handleSelectStrand    =async s=>{setSelectedStrand(s);setSelectedSubstrand(null);setSubstrands([]);setCompetencies([]);await fetchSubstrands(s.id);};
  const handleSelectSubstrand =async ss=>{setSelectedSubstrand(ss);setCompetencies([]);await fetchCompetencies(ss.id);};

  const handleAssignSubjectToGrade=async({learning_area_id,display_order})=>{
    if(!selectedGradeClass)return;setAssignSubjectLoading(true);
    try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/curriculum-mappings/create/`,{method:'POST',body:JSON.stringify({numeric_level:selectedGradeClass.numeric_level,learning_area:learning_area_id,display_order:display_order||1})});if(data?.success){addNotification('success','Subject assigned');setShowAssignSubjectModal(false);await fetchGradeMappings(selectedGradeClass.numeric_level);}else addNotification('error',data?.error||'Failed to assign subject');}
    catch{addNotification('error','Network error');}finally{setAssignSubjectLoading(false);}
  };

  const handleRemoveSubjectFromGrade=async mappingId=>{
    setSubmitting(true);
    try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/curriculum-mappings/${mappingId}/`,{method:'DELETE'});if(data?.success){addNotification('success','Subject removed');setSelectedGradeArea(null);setSelectedStrand(null);setSelectedSubstrand(null);setStrands([]);setSubstrands([]);setCompetencies([]);await fetchGradeMappings(selectedGradeClass.numeric_level);}else addNotification('error',data?.error||'Failed');}
    catch{addNotification('error','Network error');}finally{setSubmitting(false);setDeleteConfirm(null);}
  };

  const postCreate=async(url,body,onSuccess)=>{
    setSubmitting(true);
    try{const data=await apiFetch(url,{method:'POST',body:JSON.stringify(body)});if(data?.success){addNotification('success','Created successfully');setShowModal(false);setFormData({});onSuccess();}else addNotification('error',data?.error||'Creation failed');}
    catch{addNotification('error','Network error');}finally{setSubmitting(false);}
  };

  const handleCreateAcademicYear=()=>{if(!formData.year_name||!formData.year_code||!formData.start_date||!formData.end_date){addNotification('warning','Fill all required fields');return;}postCreate(`${API_BASE_URL}/api/registrar/academic/academic-years/create/`,formData,fetchAcademicYears);};
  const handleCreateTerm=()=>{if(!formData.term||!formData.start_date||!formData.end_date){addNotification('warning','Fill all required fields');return;}postCreate(`${API_BASE_URL}/api/registrar/academic/terms/create/`,{...formData,academic_year:selectedAcademicYear.id},()=>fetchTerms(selectedAcademicYear.id));};
  const handleCreateLearningArea=()=>{if(!formData.area_code||!formData.area_name){addNotification('warning','Area code and name required');return;}postCreate(`${API_BASE_URL}/api/registrar/academic/learning-areas/create/`,formData,fetchAllLearningAreas);};
  const handleCreateStrand=()=>{if(!formData.strand_code||!formData.strand_name||!selectedGradeArea||!selectedGradeClass?.numeric_level){addNotification('warning','Fill all fields and select a grade');return;}postCreate(`${API_BASE_URL}/api/registrar/academic/strands/create/`,{...formData,learning_area:selectedGradeArea.id,numeric_level:selectedGradeClass.numeric_level},()=>fetchStrands(selectedGradeArea.id,selectedGradeClass.numeric_level));};
  const handleCreateSubstrand=()=>{if(!formData.substrand_code||!formData.substrand_name||!selectedStrand){addNotification('warning','Fill all required fields');return;}postCreate(`${API_BASE_URL}/api/registrar/academic/substrands/create/`,{...formData,strand:selectedStrand.id},()=>fetchSubstrands(selectedStrand.id));};
  const handleCreateCompetency=()=>{if(!formData.competency_code||!formData.competency_statement||!selectedSubstrand){addNotification('warning','Fill all required fields');return;}postCreate(`${API_BASE_URL}/api/registrar/academic/competencies/create/`,{...formData,substrand:selectedSubstrand.id},()=>fetchCompetencies(selectedSubstrand.id));};

  const handleDeleteLearningArea=async id=>{setSubmitting(true);try{const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/learning-areas/${id}/`,{method:'DELETE'});if(data?.success){addNotification('success','Deleted');fetchAllLearningAreas();}else addNotification('error',data?.error||'Delete failed');}catch{addNotification('error','Network error');}finally{setSubmitting(false);setDeleteConfirm(null);}};

  const handleDeleteGeneric=async(type,id)=>{
    const map={academicYear:`/api/registrar/academic/academic-years/${id}/`,term:`/api/registrar/academic/terms/${id}/`,strand:`/api/registrar/academic/strands/${id}/`,substrand:`/api/registrar/academic/substrands/${id}/`,competency:`/api/registrar/academic/competencies/${id}/`};
    setSubmitting(true);
    try{const data=await apiFetch(`${API_BASE_URL}${map[type]}`,{method:'DELETE'});if(data?.success){addNotification('success','Deleted');({academicYear:fetchAcademicYears,term:()=>fetchTerms(selectedAcademicYear?.id),strand:()=>selectedGradeArea&&fetchStrands(selectedGradeArea.id,selectedGradeClass?.numeric_level),substrand:()=>selectedStrand&&fetchSubstrands(selectedStrand.id),competency:()=>selectedSubstrand&&fetchCompetencies(selectedSubstrand.id)})[type]?.();}else addNotification('error',data?.error||'Delete failed');}
    catch{addNotification('error','Network error');}finally{setSubmitting(false);setDeleteConfirm(null);}
  };

  const handleAssignToAllGrades=async learningAreaId=>{
    setSubmitting(true);let ok=0,skip=0;
    try{for(const cls of classes){const data=await apiFetch(`${API_BASE_URL}/api/registrar/academic/curriculum-mappings/create/`,{method:'POST',body:JSON.stringify({numeric_level:cls.numeric_level,learning_area:learningAreaId,display_order:1})});if(data?.success)ok++;else skip++;}addNotification('success',`Assigned to ${ok} grade(s)${skip>0?`, ${skip} already had it`:''}`);if(selectedGradeClass)await fetchGradeMappings(selectedGradeClass.numeric_level);}
    catch{addNotification('error','Partial failure during bulk assign');}finally{setSubmitting(false);setDeleteConfirm(null);}
  };

  // ── RENDER: Academic Calendar ─────────────────────────────────────────────
  const renderAcademicCalendar=()=>(
    <div className="space-y-8">
      {activeTerm?(
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="h-8 w-8 text-green-600"/>
          <div><h3 className="font-semibold text-green-800">Currently Active Term</h3><p className="text-sm text-green-700"><span className="font-bold">{activeTerm.term}</span> is active — {new Date(activeTerm.start_date).toLocaleDateString()} to {new Date(activeTerm.end_date).toLocaleDateString()}</p></div>
        </div>
      ):(
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <Clock className="h-8 w-8 text-gray-400"/>
          <div><h3 className="font-semibold text-gray-700">No Active Term</h3><p className="text-sm text-gray-500">Today's date does not fall within any configured term's date range.</p></div>
        </div>
      )}

      {/* Academic Years */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div><h2 className="font-semibold text-gray-800">Academic Years</h2><p className="text-sm text-gray-500">Manage school academic years</p></div>
          <button onClick={()=>{setModalType('academicYear');setFormData({year_name:'',year_code:'',start_date:'',end_date:'',is_current:false});setShowModal(true);}} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Plus className="h-4 w-4"/>Add Year</button>
        </div>
        <div className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {academicYears.map(year=>(
            <div key={year.id} className={`border rounded-lg p-4 ${year.is_current?'border-green-300 bg-green-50':'border-gray-200'}`}>
              <div className="flex justify-between items-start mb-2"><h3 className="font-semibold text-gray-800">{year.year_name}</h3><span className={`px-2 py-1 text-xs rounded-full ${year.is_current?'bg-green-100 text-green-800':'bg-gray-100 text-gray-600'}`}>{year.is_current?'Current':'Inactive'}</span></div>
              <p className="text-sm text-gray-600 mb-1">{year.year_code}</p>
              <p className="text-xs text-gray-500">{new Date(year.start_date).toLocaleDateString()} — {new Date(year.end_date).toLocaleDateString()}</p>
              <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-100">
                <button onClick={()=>setEditingYear({...year})} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"><Pencil className="h-3 w-3"/>Edit</button>
                <button onClick={()=>setDeleteConfirm({id:year.id,name:year.year_name,type:'academicYear'})} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            </div>
          ))}
          {academicYears.length===0&&<p className="text-gray-400 col-span-3 text-center py-6">No academic years yet</p>}
        </div></div>
      </div>

      {/* Terms */}
      {selectedAcademicYear&&(
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <div><h2 className="font-semibold text-gray-800">Terms — {selectedAcademicYear.year_name}</h2><p className="text-sm text-gray-500">Active term resolved automatically from today's date vs saved date ranges</p></div>
            <button onClick={()=>{setModalType('term');setFormData({term:'',start_date:'',end_date:'',is_current:false});setShowModal(true);}} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"><Plus className="h-4 w-4"/>Add Term</button>
          </div>
          <div className="p-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {terms.map(term=>{
              const isActive=activeTerm?.id===term.id;
              return(
                <div key={term.id} className={`border rounded-lg p-4 ${isActive?'border-green-300 bg-green-50':'border-gray-200'}`}>
                  <div className="flex justify-between items-start mb-2"><h3 className="font-semibold text-gray-800">{term.term}</h3>{isActive&&<span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active Now</span>}</div>
                  <p className="text-sm text-gray-600">{new Date(term.start_date).toLocaleDateString()} — {new Date(term.end_date).toLocaleDateString()}</p>
                  <TermCountdown term={term}/>
                  <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-100">
                    <button onClick={()=>setEditingTerm({...term})} className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"><Pencil className="h-3 w-3"/>Edit</button>
                    <button onClick={()=>setDeleteConfirm({id:term.id,name:term.term,type:'term'})} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                  </div>
                </div>
              );
            })}
            {terms.length===0&&<p className="text-gray-400 col-span-3 text-center py-6">No terms yet</p>}
          </div></div>
        </div>
      )}
      <GradingScale/>
    </div>
  );

  const renderCoreSubjects=()=>{
    const assignedAreaIds=gradeMappings.map(m=>m.learning_area_id||m.learning_area?.id||m.learning_area);
    const core=allLearningAreas.filter(a=>a.area_type==='Core');
    const optional=allLearningAreas.filter(a=>a.area_type==='Optional');
    const extra=allLearningAreas.filter(a=>a.area_type==='Extracurricular');
    const doAssign=(id,name)=>setDeleteConfirm({id,name:`Assign "${name}" to all grades`,type:'assignAllGrades',areaId:id});
    const doDel=(id,name)=>setDeleteConfirm({id,name,type:'learningArea'});
    return(
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
          <Globe className="h-8 w-8 text-purple-600 flex-shrink-0 mt-0.5"/>
          <div className="flex-1"><h3 className="font-semibold text-purple-800">Subject Pool</h3><p className="text-sm text-purple-600 mt-0.5">All learning areas grouped by type. {selectedGradeClass?<>Showing assignment status for <span className="underline font-medium">{selectedGradeClass.class_name}</span>.</>:<>Select a grade in Grade Curriculum to see assignment status.</>}</p></div>
          <button onClick={()=>{setModalType('learningArea');setFormData({area_code:'',area_name:'',short_name:'',area_type:'Core',description:'',is_active:true});setShowModal(true);}} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-1.5 text-sm whitespace-nowrap flex-shrink-0"><Plus className="h-4 w-4"/>Add Subject</button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[{label:'Core',value:core.length,color:'text-blue-700',bg:'bg-blue-50',border:'border-blue-200'},{label:'Optional / Subsidiary',value:optional.length,color:'text-yellow-700',bg:'bg-yellow-50',border:'border-yellow-200'},{label:'Extracurricular',value:extra.length,color:'text-gray-700',bg:'bg-gray-50',border:'border-gray-200'}].map(s=><div key={s.label} className={`${s.bg} rounded-xl p-4 border ${s.border}`}><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p><p className="text-sm text-gray-600 mt-1">{s.label}</p></div>)}
        </div>
        {allLearningAreas.length===0?<div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3"/><p className="text-gray-500 font-medium">No subjects yet</p></div>:(
          <><SubjectSection title="Core Subjects" subtitle="Compulsory for all learners" subjects={core} assignedAreaIds={assignedAreaIds} selectedGradeClass={selectedGradeClass} onAssignToAllGrades={doAssign} onDelete={doDel} headerStyle="bg-blue-50 text-blue-800" badgeStyle="bg-blue-100 text-blue-700"/>
          <SubjectSection title="Optional / Subsidiary Subjects" subtitle="Learner-selected or school-offered" subjects={optional} assignedAreaIds={assignedAreaIds} selectedGradeClass={selectedGradeClass} onAssignToAllGrades={doAssign} onDelete={doDel} headerStyle="bg-yellow-50 text-yellow-800" badgeStyle="bg-yellow-100 text-yellow-700"/>
          <SubjectSection title="Extracurricular Activities" subtitle="Co-curricular and enrichment" subjects={extra} assignedAreaIds={assignedAreaIds} selectedGradeClass={selectedGradeClass} onAssignToAllGrades={doAssign} onDelete={doDel} headerStyle="bg-gray-50 text-gray-700" badgeStyle="bg-gray-200 text-gray-600"/></>
        )}
      </div>
    );
  };

  const renderGradeCurriculum=()=>{
    const assignedAreaIds=gradeMappings.map(m=>m.learning_area_id||m.learning_area?.id||m.learning_area);
    return(
      <div className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-3"><GraduationCap className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0"/><p className="text-sm text-amber-800">Select a grade/class on the left to manage its assigned subjects. Strands and sub-strands are grade-specific.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Grades */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50"><h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm"><GraduationCap className="h-4 w-4"/>Grades / Classes</h3></div>
            <div className="max-h-[600px] overflow-y-auto">
              {classes.length===0&&<p className="text-xs text-gray-400 text-center py-6">No classes found</p>}
              {classes.map(cls=><div key={cls.id} onClick={()=>handleSelectGradeClass(cls)} className={`border-b border-gray-100 px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 ${selectedGradeClass?.id===cls.id?'bg-blue-50 border-l-2 border-l-blue-500':''}`}><div><p className="font-medium text-gray-800 text-sm">{cls.class_name}</p><p className="text-xs text-gray-500">Level {cls.numeric_level}</p></div></div>)}
            </div>
          </div>
          {/* Subjects */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm"><BookOpen className="h-4 w-4"/>{selectedGradeClass?`${selectedGradeClass.class_name} Subjects`:'Subjects'}</h3>
              {selectedGradeClass&&<button onClick={()=>setShowAssignSubjectModal(true)} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus className="h-4 w-4"/></button>}
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {!selectedGradeClass?<p className="text-xs text-gray-400 text-center py-8">← Select a grade</p>
                :gradeMappingsLoading?<div className="flex justify-center py-8"><Loader2 className="h-5 w-5 text-blue-500 animate-spin"/></div>
                :gradeMappings.length===0?(<div className="text-center py-8 px-4"><BookOpen className="h-8 w-8 text-gray-300 mx-auto mb-2"/><p className="text-xs text-gray-500">No subjects assigned</p><button onClick={()=>setShowAssignSubjectModal(true)} className="mt-2 text-xs text-blue-600 hover:underline">+ Assign a subject</button></div>)
                :gradeMappings.map(mapping=>{const areaId=mapping.learning_area_id||mapping.learning_area?.id||mapping.learning_area;const area=allLearningAreas.find(a=>a.id===areaId)||mapping.learning_area||{};return(<div key={mapping.id} onClick={()=>handleSelectGradeArea({id:areaId,area_name:area.area_name,area_code:area.area_code})} className={`border-b border-gray-100 px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 ${selectedGradeArea?.id===areaId?'bg-blue-50 border-l-2 border-l-blue-500':''}`}><div><p className="font-medium text-gray-800 text-sm">{area.area_name}</p><p className="text-xs text-gray-400">{area.area_code}</p></div><button onClick={e=>{e.stopPropagation();setDeleteConfirm({id:mapping.id,name:`${area.area_name} from ${selectedGradeClass.class_name}`,type:'gradeMapping'});}} className="p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded"><Unlink className="h-3.5 w-3.5"/></button></div>);})}
            </div>
          </div>
          {/* Strands/Substrands/Competencies */}
          <div className="lg:col-span-7 space-y-3">
            {/* Strands */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm"><Layers className="h-4 w-4"/>Strands{selectedGradeArea&&<span className="text-gray-400 font-normal">— {selectedGradeArea.area_name}</span>}</h3><button onClick={()=>{if(!selectedGradeArea){addNotification('warning','Select a subject first');return;}setModalType('strand');setFormData({strand_code:'',strand_name:'',description:'',display_order:''});setShowModal(true);}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus className="h-4 w-4"/></button></div>
              <div className="max-h-[170px] overflow-y-auto">
                {!selectedGradeArea?<p className="text-xs text-gray-400 text-center py-4">Select a subject to manage its strands</p>:strands.length===0?<p className="text-xs text-gray-400 text-center py-4">No strands yet — click + to add</p>:strands.map(s=><div key={s.id} className={`border-b border-gray-100 ${selectedStrand?.id===s.id?'bg-blue-50':'hover:bg-gray-50'}`}><div className="px-4 py-2 cursor-pointer flex justify-between items-center" onClick={()=>handleSelectStrand(s)}><div><span className="text-sm text-gray-800">{s.strand_name}</span><span className="text-xs text-gray-400 ml-1">({s.strand_code})</span></div><button onClick={e=>{e.stopPropagation();setDeleteConfirm({id:s.id,name:s.strand_name,type:'strand'});}} className="text-red-400 hover:text-red-600"><Trash2 className="h-3 w-3"/></button></div></div>)}
              </div>
            </div>
            {/* Sub-strands */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm"><FolderTree className="h-4 w-4"/>Sub-strands{selectedStrand&&<span className="text-gray-400 font-normal">— {selectedStrand.strand_name}</span>}</h3><button onClick={()=>{if(!selectedStrand){addNotification('warning','Select a strand first');return;}setModalType('substrand');setFormData({substrand_code:'',substrand_name:'',description:'',display_order:''});setShowModal(true);}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus className="h-4 w-4"/></button></div>
              <div className="max-h-[170px] overflow-y-auto">
                {!selectedStrand?<p className="text-xs text-gray-400 text-center py-4">Select a strand to manage sub-strands</p>:substrands.length===0?<p className="text-xs text-gray-400 text-center py-4">No sub-strands yet — click + to add</p>:substrands.map(ss=><div key={ss.id} className={`border-b border-gray-100 ${selectedSubstrand?.id===ss.id?'bg-blue-50':'hover:bg-gray-50'}`}><div className="px-4 py-2 cursor-pointer flex justify-between items-center" onClick={()=>handleSelectSubstrand(ss)}><div><span className="text-sm text-gray-800">{ss.substrand_name}</span><span className="text-xs text-gray-400 ml-1">({ss.substrand_code})</span></div><button onClick={e=>{e.stopPropagation();setDeleteConfirm({id:ss.id,name:ss.substrand_name,type:'substrand'});}} className="text-red-400 hover:text-red-600"><Trash2 className="h-3 w-3"/></button></div></div>)}
              </div>
            </div>
            {/* Competencies */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center"><h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm"><Target className="h-4 w-4"/>Competencies{selectedSubstrand&&<span className="text-gray-400 font-normal">— {selectedSubstrand.substrand_name}</span>}</h3><button onClick={()=>{if(!selectedSubstrand){addNotification('warning','Select a sub-strand first');return;}setModalType('competency');setFormData({competency_code:'',competency_statement:'',performance_indicator:'',is_core_competency:true,display_order:''});setShowModal(true);}} className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Plus className="h-4 w-4"/></button></div>
              <div className="max-h-[240px] overflow-y-auto p-2">
                {!selectedSubstrand?<p className="text-xs text-gray-400 text-center py-4">Select a sub-strand to manage competencies</p>:competencies.length===0?<p className="text-xs text-gray-400 text-center py-4">No competencies yet — click + to add</p>:competencies.map(c=><div key={c.id} className="p-2 border-b border-gray-100"><div className="flex justify-between"><div className="flex-1 pr-2"><div className="flex items-center gap-2"><span className="font-mono text-xs text-blue-600">{c.competency_code}</span><span className={`px-1.5 py-0.5 text-xs rounded-full ${c.is_core_competency?'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600'}`}>{c.is_core_competency?'Core':'Supp.'}</span></div><p className="text-xs text-gray-700 mt-0.5">{c.competency_statement?.substring(0,120)}{c.competency_statement?.length>120?'…':''}</p></div><button onClick={()=>setDeleteConfirm({id:c.id,name:c.competency_code,type:'competency'})} className="text-red-400 hover:text-red-600 flex-shrink-0"><Trash2 className="h-3 w-3"/></button></div></div>)}
              </div>
            </div>
          </div>
        </div>
        <AssignSubjectModal isOpen={showAssignSubjectModal} onClose={()=>setShowAssignSubjectModal(false)} onSubmit={handleAssignSubjectToGrade} allLearningAreas={allLearningAreas} assignedAreaIds={assignedAreaIds} loading={assignSubjectLoading}/>
      </div>
    );
  };

  const renderCurriculum=()=>(
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-1 flex gap-1 w-fit">
        <button onClick={()=>setCurriculumView('grade-curriculum')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${curriculumView==='grade-curriculum'?'bg-blue-600 text-white':'text-gray-600 hover:bg-gray-100'}`}><GraduationCap className="h-4 w-4"/>Grade Curriculum</button>
        <button onClick={()=>setCurriculumView('core-subjects')} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${curriculumView==='core-subjects'?'bg-purple-600 text-white':'text-gray-600 hover:bg-gray-100'}`}><Globe className="h-4 w-4"/>Subject Pool</button>
      </div>
      {curriculumView==='grade-curriculum'?renderGradeCurriculum():renderCoreSubjects()}
    </div>
  );

  const renderModalContent=()=>{
    switch(modalType){
      case 'academicYear':return(<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Year Code *</label><input type="text" value={formData.year_code||''} onChange={e=>setFormData({...formData,year_code:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="2024-2025"/></div><div><label className="block text-sm font-medium mb-1">Year Name *</label><input type="text" value={formData.year_name||''} onChange={e=>setFormData({...formData,year_name:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="2024-2025 Academic Year"/></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={formData.start_date||''} onChange={e=>setFormData({...formData,start_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div><div><label className="block text-sm font-medium mb-1">End Date *</label><input type="date" value={formData.end_date||''} onChange={e=>setFormData({...formData,end_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_current||false} onChange={e=>setFormData({...formData,is_current:e.target.checked})} className="h-4 w-4 rounded"/><span className="text-sm">Set as current academic year</span></label></div>);
      case 'term':return(<div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Term *</label><select value={formData.term||''} onChange={e=>setFormData({...formData,term:e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="">Select Term</option><option value="Term 1">Term 1 (Jan–Mar)</option><option value="Term 2">Term 2 (May–Jul)</option><option value="Term 3">Term 3 (Sep–Nov)</option></select></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={formData.start_date||''} onChange={e=>setFormData({...formData,start_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div><div><label className="block text-sm font-medium mb-1">End Date *</label><input type="date" value={formData.end_date||''} onChange={e=>setFormData({...formData,end_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_current||false} onChange={e=>setFormData({...formData,is_current:e.target.checked})} className="h-4 w-4 rounded"/><span className="text-sm">Set as current term</span></label></div>);
      case 'learningArea':return(<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Area Code *</label><input type="text" value={formData.area_code||''} onChange={e=>setFormData({...formData,area_code:e.target.value.toUpperCase()})} className="w-full border rounded-lg px-3 py-2" placeholder="MATH"/></div><div><label className="block text-sm font-medium mb-1">Short Name</label><input type="text" value={formData.short_name||''} onChange={e=>setFormData({...formData,short_name:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Maths"/></div></div><div><label className="block text-sm font-medium mb-1">Area Name *</label><input type="text" value={formData.area_name||''} onChange={e=>setFormData({...formData,area_name:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Mathematics"/></div><div><label className="block text-sm font-medium mb-1">Area Type</label><select value={formData.area_type||'Core'} onChange={e=>setFormData({...formData,area_type:e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="Core">Core</option><option value="Optional">Optional (Subsidiary)</option><option value="Extracurricular">Extracurricular</option></select></div><div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description||''} onChange={e=>setFormData({...formData,description:e.target.value})} rows="2" className="w-full border rounded-lg px-3 py-2"/></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_active!==false} onChange={e=>setFormData({...formData,is_active:e.target.checked})} className="h-4 w-4 rounded"/><span className="text-sm">Active</span></label></div>);
      case 'strand':return(<div className="space-y-4"><div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">Adding strand to <strong>{selectedGradeArea?.area_name}</strong> for <strong>{selectedGradeClass?.class_name}</strong></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Strand Code *</label><input type="text" value={formData.strand_code||''} onChange={e=>setFormData({...formData,strand_code:e.target.value.toUpperCase()})} className="w-full border rounded-lg px-3 py-2" placeholder="MATH-NS"/></div><div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={formData.display_order||''} onChange={e=>setFormData({...formData,display_order:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="1"/></div></div><div><label className="block text-sm font-medium mb-1">Strand Name *</label><input type="text" value={formData.strand_name||''} onChange={e=>setFormData({...formData,strand_name:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Numbers and Algebra"/></div><div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description||''} onChange={e=>setFormData({...formData,description:e.target.value})} rows="2" className="w-full border rounded-lg px-3 py-2"/></div></div>);
      case 'substrand':return(<div className="space-y-4"><div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">Adding sub-strand to <strong>{selectedStrand?.strand_name}</strong></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Sub-strand Code *</label><input type="text" value={formData.substrand_code||''} onChange={e=>setFormData({...formData,substrand_code:e.target.value.toUpperCase()})} className="w-full border rounded-lg px-3 py-2" placeholder="MATH-NS1"/></div><div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={formData.display_order||''} onChange={e=>setFormData({...formData,display_order:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="1"/></div></div><div><label className="block text-sm font-medium mb-1">Sub-strand Name *</label><input type="text" value={formData.substrand_name||''} onChange={e=>setFormData({...formData,substrand_name:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="Counting and Place Value"/></div><div><label className="block text-sm font-medium mb-1">Description</label><textarea value={formData.description||''} onChange={e=>setFormData({...formData,description:e.target.value})} rows="2" className="w-full border rounded-lg px-3 py-2"/></div></div>);
      case 'competency':return(<div className="space-y-4"><div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">Adding competency to <strong>{selectedSubstrand?.substrand_name}</strong> · {selectedGradeClass?.class_name}</div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Competency Code *</label><input type="text" value={formData.competency_code||''} onChange={e=>setFormData({...formData,competency_code:e.target.value.toUpperCase()})} className="w-full border rounded-lg px-3 py-2" placeholder="MATH-NS1.1"/></div><div><label className="block text-sm font-medium mb-1">Display Order</label><input type="number" value={formData.display_order||''} onChange={e=>setFormData({...formData,display_order:e.target.value})} className="w-full border rounded-lg px-3 py-2" placeholder="1"/></div></div><div><label className="block text-sm font-medium mb-1">Competency Statement *</label><textarea value={formData.competency_statement||''} onChange={e=>setFormData({...formData,competency_statement:e.target.value})} rows="3" className="w-full border rounded-lg px-3 py-2" placeholder="The learner should be able to…"/></div><div><label className="block text-sm font-medium mb-1">Performance Indicator</label><textarea value={formData.performance_indicator||''} onChange={e=>setFormData({...formData,performance_indicator:e.target.value})} rows="2" className="w-full border rounded-lg px-3 py-2" placeholder="How will this be measured?"/></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={formData.is_core_competency!==false} onChange={e=>setFormData({...formData,is_core_competency:e.target.checked})} className="h-4 w-4 rounded"/><span className="text-sm">Core Competency</span></label></div>);
      default:return null;
    }
  };

  if(!isAuthenticated)return(<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-center"><AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4"/><h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2><p className="text-gray-600 mt-2 mb-6">Please login to access academic management</p><a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Go to Login</a></div></div>);

  const tabs=[{id:'academic-calendar',label:'Academic Calendar',icon:<Calendar className="h-4 w-4"/>},{id:'curriculum',label:'Curriculum Structure',icon:<BookOpen className="h-4 w-4"/>},{id:'teacher-assignments',label:'Teacher Assignments',icon:<UserCheck className="h-4 w-4"/>}];

  const handleConfirmAction=()=>{
    const{type,id,areaId}=deleteConfirm||{};
    if(type==='gradeMapping')handleRemoveSubjectFromGrade(id);
    else if(type==='learningArea')handleDeleteLearningArea(id);
    else if(type==='assignAllGrades')handleAssignToAllGrades(areaId);
    else handleDeleteGeneric(type,id);
  };

  return(
    <div className="min-h-screen bg-gray-50">
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}.animate-slide-in{animation:slideIn .3s ease-out}`}</style>
      <SessionExpiredModal isOpen={showSessionExpired} onLogout={handleLogout}/>
      {error&&<Notification type="error" message={error} onClose={()=>setError(null)}/>}
      {success&&<Notification type="success" message={success} onClose={()=>setSuccess(null)}/>}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div><h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><GraduationCap className="h-7 w-7 text-blue-600"/>Academic Management</h1><p className="text-gray-500 text-sm">Manage academic years, terms, CBE curriculum and teacher assignments</p>{user&&<p className="text-xs text-gray-400 mt-0.5">{user.first_name} {user.last_name} · {user.role}</p>}</div>
            <div className="flex items-center gap-3">
              {activeTerm&&<div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1"><Clock className="h-3 w-3"/>{activeTerm.term}</div>}
              <button onClick={()=>{flushCache();fetchAcademicYears();fetchAllLearningAreas();fetchClasses();}} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg" title="Refresh all data"><RefreshCw className="h-5 w-5"/></button>
            </div>
          </div>
        </div>
        <div className="px-6 border-b border-gray-200">
          <div className="flex gap-6">{tabs.map(tab=><button key={tab.id} onClick={()=>setActiveTab(tab.id)} className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${activeTab===tab.id?'border-blue-600 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700'}`}>{tab.icon}{tab.label}</button>)}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading?<div className="flex justify-center items-center h-64"><Loader2 className="h-12 w-12 text-blue-600 animate-spin"/></div>
          :activeTab==='academic-calendar'?renderAcademicCalendar()
          :activeTab==='curriculum'?renderCurriculum()
          :<TeacherAssignmentTab getAuthHeaders={getAuthHeaders} handleApiError={handleApiError} addNotification={addNotification}/>}
      </div>

      {/* Create */}
      <FormModal isOpen={showModal} onClose={()=>setShowModal(false)} onSubmit={()=>({academicYear:handleCreateAcademicYear,term:handleCreateTerm,learningArea:handleCreateLearningArea,strand:handleCreateStrand,substrand:handleCreateSubstrand,competency:handleCreateCompetency})[modalType]?.()} title={({academicYear:'Add Academic Year',term:'Add Term',learningArea:'Add Learning Area / Subject',strand:'Add Strand',substrand:'Add Sub-strand',competency:'Add Competency'})[modalType]||'Add'} loading={submitting}>{renderModalContent()}</FormModal>

      {/* Edit Academic Year */}
      <FormModal isOpen={!!editingYear} onClose={()=>setEditingYear(null)} onSubmit={handleUpdateAcademicYear} title="Edit Academic Year" submitText="Save Changes" loading={editSubmitting}>
        {editingYear&&<div className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Year Code *</label><input type="text" value={editingYear.year_code} onChange={e=>setEditingYear({...editingYear,year_code:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div><div><label className="block text-sm font-medium mb-1">Year Name *</label><input type="text" value={editingYear.year_name} onChange={e=>setEditingYear({...editingYear,year_name:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={editingYear.start_date?.slice(0,10)||''} onChange={e=>setEditingYear({...editingYear,start_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div><div><label className="block text-sm font-medium mb-1">End Date *</label><input type="date" value={editingYear.end_date?.slice(0,10)||''} onChange={e=>setEditingYear({...editingYear,end_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingYear.is_current||false} onChange={e=>setEditingYear({...editingYear,is_current:e.target.checked})} className="h-4 w-4 rounded"/><span className="text-sm">Set as current academic year</span></label></div>}
      </FormModal>

      {/* Edit Term */}
      <FormModal isOpen={!!editingTerm} onClose={()=>setEditingTerm(null)} onSubmit={handleUpdateTerm} title="Edit Term" submitText="Save Changes" loading={editSubmitting}>
        {editingTerm&&<div className="space-y-4"><div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">Updating these dates will immediately move the active term indicator.</div><div><label className="block text-sm font-medium mb-1">Term *</label><select value={editingTerm.term} onChange={e=>setEditingTerm({...editingTerm,term:e.target.value})} className="w-full border rounded-lg px-3 py-2"><option value="Term 1">Term 1 (Jan–Mar)</option><option value="Term 2">Term 2 (May–Jul)</option><option value="Term 3">Term 3 (Sep–Nov)</option></select></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">Start Date *</label><input type="date" value={editingTerm.start_date?.slice(0,10)||''} onChange={e=>setEditingTerm({...editingTerm,start_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div><div><label className="block text-sm font-medium mb-1">End Date *</label><input type="date" value={editingTerm.end_date?.slice(0,10)||''} onChange={e=>setEditingTerm({...editingTerm,end_date:e.target.value})} className="w-full border rounded-lg px-3 py-2"/></div></div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingTerm.is_current||false} onChange={e=>setEditingTerm({...editingTerm,is_current:e.target.checked})} className="h-4 w-4 rounded"/><span className="text-sm">Force-mark as current (override date logic)</span></label></div>}
      </FormModal>

      <ConfirmationModal isOpen={!!deleteConfirm} onClose={()=>setDeleteConfirm(null)} onConfirm={handleConfirmAction}
        title={deleteConfirm?.type==='gradeMapping'?'Remove Subject from Grade':deleteConfirm?.type==='assignAllGrades'?'Assign to All Grades':'Delete Item'}
        message={deleteConfirm?.type==='assignAllGrades'?'This will assign the subject to every grade/class. Grades that already have it will be skipped.':deleteConfirm?.type==='gradeMapping'?`Remove "${deleteConfirm?.name}"? The subject and its strands/sub-strands will no longer appear for this grade.`:`Are you sure you want to delete "${deleteConfirm?.name}"? This cannot be undone.`}
        type={deleteConfirm?.type==='assignAllGrades'?'warning':'danger'}/>

      {showCompetencyTable&&selectedClassForCompetencies&&<CompetencyTable classData={selectedClassForCompetencies} competencies={classCompetencies} onClose={()=>{setShowCompetencyTable(false);setSelectedClassForCompetencies(null);setClassCompetencies([]);}}/>}
    </div>
  );
}

export default AcademicManagement;