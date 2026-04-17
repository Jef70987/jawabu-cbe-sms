/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../Authentication/AuthContext';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Loader2,
  AlertCircle,
  Clock,
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart3,
  Target,
  Lightbulb,
  TrendingDown,
  CheckCircle,
  ArrowRight,
  Brain,
  Activity,
  Shield,
  AlertTriangle,
  LineChart,
  PieChart,
  Users,
  Star
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// CBC Competency Levels (8-level scale)
const COMPETENCY_LEVELS = [
  { code: 'EE1', label: 'Exceptional', range: '90-100%', color: 'bg-emerald-600', textColor: 'text-emerald-600' },
  { code: 'EE2', label: 'Very Good', range: '75-89%', color: 'bg-emerald-500', textColor: 'text-emerald-500' },
  { code: 'ME1', label: 'Good', range: '58-74%', color: 'bg-blue-500', textColor: 'text-blue-500' },
  { code: 'ME2', label: 'Fair', range: '41-57%', color: 'bg-blue-400', textColor: 'text-blue-400' },
  { code: 'AE1', label: 'Needs Improvement', range: '31-40%', color: 'bg-amber-500', textColor: 'text-amber-500' },
  { code: 'AE2', label: 'Below Average', range: '21-30%', color: 'bg-amber-400', textColor: 'text-amber-400' },
  { code: 'BE1', label: 'Well Below', range: '11-20%', color: 'bg-red-500', textColor: 'text-red-500' },
  { code: 'BE2', label: 'Minimal', range: '0-10%', color: 'bg-red-600', textColor: 'text-red-600' }
];

// Quick suggestion buttons for chat
const QUICK_SUGGESTIONS = [
  { text: 'My competency summary', icon: TrendingUp, query: 'Show me my competency mastery summary' },
  { text: 'Fee balance', icon: FileText, query: 'What is my current fee balance?' },
  { text: 'Upcoming assessments', icon: Calendar, query: 'When are my upcoming assessments?' },
  { text: 'Career pathway', icon: Target, query: 'Recommend career pathways based on my competencies' },
  { text: 'Areas to improve', icon: Lightbulb, query: 'Which competency areas need improvement?' },
  { text: 'Attendance record', icon: Clock, query: 'Show my attendance record' }
];

// Chat Message Component - memoized to prevent unnecessary re-renders
const ChatMessage = React.memo(({ message, isUser, timestamp }) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center ${isUser ? 'ml-2' : 'mr-2'}`}>
          {isUser ? (
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center rounded-xl">
              <User className="w-4 h-4 text-white" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-green-700 flex items-center justify-center rounded-xl">
              <Bot className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className={`flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-2 rounded-xl ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} border border-gray-200`}>
            <p className="text-sm whitespace-pre-wrap break-words">{message}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1 px-1">{timestamp}</p>
        </div>
      </div>
    </div>
  );
});

// Typing Indicator
const TypingIndicator = React.memo(() => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex max-w-[85%] flex-row">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center mr-2">
          <div className="w-8 h-8 bg-green-700 flex items-center justify-center rounded-xl">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-100 rounded-xl border border-gray-200">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-gray-500 animate-bounce rounded-full" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 animate-bounce rounded-full" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 animate-bounce rounded-full" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Competency Level Badge
const CompetencyBadge = ({ percentage }) => {
  const getLevel = () => {
    if (percentage >= 90) return COMPETENCY_LEVELS[0];
    if (percentage >= 75) return COMPETENCY_LEVELS[1];
    if (percentage >= 58) return COMPETENCY_LEVELS[2];
    if (percentage >= 41) return COMPETENCY_LEVELS[3];
    if (percentage >= 31) return COMPETENCY_LEVELS[4];
    if (percentage >= 21) return COMPETENCY_LEVELS[5];
    if (percentage >= 11) return COMPETENCY_LEVELS[6];
    return COMPETENCY_LEVELS[7];
  };
  
  const levelData = getLevel();
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 ${levelData.color}`}></div>
      <span className="text-xs font-medium text-gray-600">{levelData.code}</span>
      <span className="text-xs text-gray-400">{levelData.label}</span>
    </div>
  );
};

// Risk Card Component
const RiskCard = ({ title, value, riskLevel, icon: Icon, description }) => {
  const riskColors = {
    low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', label: 'Low Risk' },
    medium: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Medium Risk' },
    high: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', label: 'High Risk' }
  };
  
  const colors = riskColors[riskLevel] || riskColors.low;
  
  return (
    <div className={`p-4 border ${colors.border} ${colors.bg} rounded-xl`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${colors.text}`} />
          <span className="text-xs font-medium text-gray-500">{title}</span>
        </div>
        <span className={`text-xs font-semibold ${colors.text}`}>{colors.label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    </div>
  );
};

// Performance Trend Chart
const PerformanceTrend = ({ data }) => {
  return (
    <div className="space-y-3">
      {data.map((item, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{item.term}</span>
            <span className="font-medium text-gray-800">{item.value}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${item.value >= 75 ? 'bg-green-600' : item.value >= 58 ? 'bg-blue-500' : item.value >= 41 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Competency Mastery Chart
const CompetencyMastery = ({ competencies }) => {
  return (
    <div className="space-y-4">
      {competencies.map((comp, idx) => (
        <div key={idx} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-700 font-medium">{comp.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">{comp.mastery}%</span>
              <CompetencyBadge percentage={comp.mastery} />
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-2 rounded-full ${comp.mastery >= 75 ? 'bg-green-600' : comp.mastery >= 58 ? 'bg-blue-500' : comp.mastery >= 41 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${comp.mastery}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// CBC Level Legend
const CBCLegend = () => {
  return (
    <div className="grid grid-cols-4 gap-2">
      {COMPETENCY_LEVELS.map((level, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <div className={`w-2 h-2 ${level.color}`}></div>
          <span className="text-xs text-gray-500">{level.code}</span>
        </div>
      ))}
    </div>
  );
};

const Chatbot = () => {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const sendMessageRef = useRef(null);

  // CBC Analytics Data
  const [analyticsData] = useState({
    overall_competency: 72,
    competency_level: 'ME1',
    performance_trend: [
      { term: 'Term 1 2024', value: 68 },
      { term: 'Term 2 2024', value: 72 },
      { term: 'Term 3 2024', value: 75 },
      { term: 'Term 1 2025', value: 78 }
    ],
    competencies: [
      { name: 'Communication', mastery: 85 },
      { name: 'Critical Thinking', mastery: 78 },
      { name: 'Creativity', mastery: 82 },
      { name: 'Collaboration', mastery: 70 },
      { name: 'Digital Literacy', mastery: 88 },
      { name: 'Numeracy', mastery: 65 },
      { name: 'Scientific Reasoning', mastery: 68 },
      { name: 'Social Responsibility', mastery: 75 }
    ],
    risks: {
      failure_risk: { level: 'low', value: '15%', description: 'Probability of not meeting competency standards' },
      dropout_risk: { level: 'low', value: '8%', description: 'Likelihood of discontinuing studies' },
      intervention_needed: { level: 'medium', value: '3', description: 'Competency areas requiring attention' }
    },
    career_pathways: [
      { name: 'STEM & Engineering', match: 85, competencies: ['Numeracy', 'Scientific Reasoning', 'Critical Thinking'] },
      { name: 'ICT & Computer Science', match: 92, competencies: ['Digital Literacy', 'Critical Thinking', 'Creativity'] },
      { name: 'Business & Finance', match: 70, competencies: ['Numeracy', 'Communication', 'Collaboration'] }
    ]
  });

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch student profile
  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      fetchStudentProfile();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchStudentProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/student/profile/`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStudentProfile(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens on mobile
  useEffect(() => {
    if (isMobileChatOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isMobileChatOpen]);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Define sendMessage as useCallback to prevent recreation
  const sendMessage = useCallback(async (message) => {
    if (!message.trim() || isSending) return;

    setIsSending(true);

    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: getTimestamp()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const context = studentProfile ? {
        student_name: `${studentProfile.first_name} ${studentProfile.last_name}`,
        student_class: studentProfile.current_class_name,
        admission_no: studentProfile.admission_no,
        student_role: user?.role
      } : {};

      const response = await fetch(`${API_BASE_URL}/api/chatbot/message/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: message,
          context: context,
          conversation_history: messages.slice(-10).map(m => ({
            role: m.isUser ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      let botResponseText = '';

      if (response.ok) {
        const data = await response.json();
        botResponseText = data.response || data.message || 'Thank you for your message. How else can I assist you today?';
      } else {
        botResponseText = getFallbackResponse(message, studentProfile);
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        isUser: false,
        timestamp: getTimestamp()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'I am having trouble connecting to the server. Please check your connection and try again.',
        isUser: false,
        timestamp: getTimestamp()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  }, [studentProfile, user, getAuthHeaders, messages, isSending]);

  const getFallbackResponse = (message, profile) => {
    const lowerMsg = message.toLowerCase();
    const studentName = profile?.first_name || 'Student';

    if (lowerMsg.includes('competency') || lowerMsg.includes('performance')) {
      return `Based on your CBC competency assessment, your overall mastery level is ${analyticsData.overall_competency}% which corresponds to level ME1 (Good). Your strongest competency is Digital Literacy at 88% mastery. Areas for improvement include Numeracy at 65% and Scientific Reasoning at 68%. Would you like specific recommendations for these areas?`;
    }
    else if (lowerMsg.includes('fee') || lowerMsg.includes('balance')) {
      return `Your current fee balance is KES 25,500. The deadline for payment is 30th of this month. Would you like to see a detailed fee statement?`;
    }
    else if (lowerMsg.includes('assessment') || lowerMsg.includes('exam')) {
      return `Your upcoming competency assessments are scheduled for 15th May 2024. These will evaluate project-based learning, practical demonstrations, and portfolio submissions as per CBC requirements.`;
    }
    else if (lowerMsg.includes('career') || lowerMsg.includes('pathway')) {
      return `Based on your competency profile, your best-matched career pathway is ICT & Computer Science with a 92% match. Your strengths in Digital Literacy (88%), Critical Thinking (78%), and Creativity (82%) align well with this field. Would you like more details about this pathway?`;
    }
    else if (lowerMsg.includes('attendance')) {
      return `Your current attendance rate is 92%. You have missed 3 days this term. Regular attendance is important for continuous competency development.`;
    }
    else if (lowerMsg.includes('risk') || lowerMsg.includes('failure')) {
      return `Your academic risk assessment shows a ${analyticsData.risks.failure_risk.value} failure risk (Low) and ${analyticsData.risks.dropout_risk.value} dropout risk (Low). ${analyticsData.risks.intervention_needed.value} competency areas require intervention. Keep up the good work!`;
    }
    else {
      return `Thank you for your question, ${studentName}. I'm here to help with CBC competency tracking, career pathway guidance, assessment schedules, fee inquiries, and risk analysis. What specific information would you like?`;
    }
  };

  const handleSuggestionClick = useCallback((query) => {
    sendMessage(query);
  }, [sendMessage]);

  const handleSend = useCallback(() => {
    if (inputValue.trim() && !isSending) {
      sendMessage(inputValue);
    }
  }, [inputValue, isSending, sendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend, isSending]);

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const studentName = studentProfile?.first_name || user?.first_name || 'Student';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading CBC Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  // Chat Panel Component - defined inside to access state
  const ChatPanel = ({ isMobileView, onClose }) => (
    <div className={`flex flex-col bg-white border border-gray-200 rounded-xl shadow-lg ${isMobileView ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Chat Header */}
      {isMobileView ? (
        <div className="flex items-center justify-between p-4 bg-green-700 border-b border-green-800 rounded-t-xl">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white flex items-center justify-center rounded-xl">
              <Bot className="w-4 h-4 text-green-700" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">CBC Academic Assistant</h3>
              <p className="text-xs text-green-100">AI-Powered | Competency-Based</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-green-700 border-b border-green-800 rounded-t-xl">
          <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
            <Bot className="w-5 h-5 text-green-700" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">CBC Academic Assistant</h3>
            <p className="text-xs text-green-100">AI-Powered | Competency-Based Curriculum Support</p>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-green-100 flex items-center justify-center rounded-xl mb-4">
              <Brain className="w-10 h-10 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Hi, I'm your CBC Academic Assistant
            </h3>
            <p className="text-gray-600 mb-6 text-sm max-w-md">
              I can help you understand your competency mastery, recommend career pathways, 
              analyze performance risks, and provide personalized learning recommendations.
            </p>
            <div className="w-full">
              <p className="text-xs font-medium text-gray-500 mb-3 text-left">QUICK QUESTIONS</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_SUGGESTIONS.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion.query)}
                    className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm rounded-xl"
                  >
                    <suggestion.icon className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-700">{suggestion.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg.text}
                isUser={msg.isUser}
                timestamp={msg.timestamp}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Suggestions Bar */}
      {messages.length > 0 && !isTyping && (
        <div className="px-4 py-2 border-t border-gray-200 bg-white overflow-x-auto">
          <div className="flex gap-2">
            {QUICK_SUGGESTIONS.slice(0, 4).map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(suggestion.query)}
                className="flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors text-xs whitespace-nowrap rounded-lg"
              >
                <suggestion.icon className="w-3 h-3 text-blue-600" />
                <span className="text-gray-700">{suggestion.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Ask about your competencies, career pathways, or risks..."
            className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 resize-none text-sm rounded-xl"
            rows="1"
            style={{ minHeight: '40px', maxHeight: '80px' }}
            disabled={isSending}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isSending}
            className="px-4 py-2 bg-green-700 text-white hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-xl"
          >
            {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          AI Assistant for CBC Competency-Based Curriculum
        </p>
      </div>
    </div>
  );

  // Desktop Layout
  if (!isMobile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex h-screen gap-6 p-6">
          {/* Left Side - CBC Analytics Dashboard */}
          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="bg-green-700 border border-green-800 rounded-xl">
              <div className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl">
                    <GraduationCap className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">CBC Competency Analytics Dashboard</h1>
                    <p className="text-green-100 text-sm">Welcome back, {studentName} | Competency-Based Curriculum</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Competency Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-700" />
                  <h2 className="text-lg font-semibold text-gray-800">Overall Competency Mastery</h2>
                </div>
                <CompetencyBadge percentage={analyticsData.overall_competency} />
              </div>
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-3 bg-green-600 rounded-full"
                      style={{ width: `${analyticsData.overall_competency}%` }}
                    />
                  </div>
                </div>
                <span className="text-3xl font-bold text-gray-800">{analyticsData.overall_competency}%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <CBCLegend />
              </div>
            </div>

            {/* Risk Analysis Row */}
            <div className="grid grid-cols-3 gap-4">
              <RiskCard 
                title="Failure Risk" 
                value={analyticsData.risks.failure_risk.value}
                riskLevel={analyticsData.risks.failure_risk.level}
                icon={AlertTriangle}
                description={analyticsData.risks.failure_risk.description}
              />
              <RiskCard 
                title="Dropout Risk" 
                value={analyticsData.risks.dropout_risk.value}
                riskLevel={analyticsData.risks.dropout_risk.level}
                icon={Shield}
                description={analyticsData.risks.dropout_risk.description}
              />
              <RiskCard 
                title="Interventions Needed" 
                value={analyticsData.risks.intervention_needed.value}
                riskLevel={analyticsData.risks.intervention_needed.level}
                icon={Activity}
                description={analyticsData.risks.intervention_needed.description}
              />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Performance Trend */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <LineChart className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Competency Performance Trend</h3>
                </div>
                <PerformanceTrend data={analyticsData.performance_trend} />
              </div>

              {/* Career Pathway Match */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Target className="w-4 h-4 text-purple-600" />
                  <h3 className="font-semibold text-gray-800">Recommended Career Pathways</h3>
                </div>
                <div className="space-y-4">
                  {analyticsData.career_pathways.map((pathway, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-800">{pathway.name}</span>
                        <span className="text-green-700 font-semibold">{pathway.match}% Match</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full">
                        <div className="h-2 bg-green-600 rounded-full" style={{ width: `${pathway.match}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">Based on: {pathway.competencies.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Competency Mastery Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <PieChart className="w-4 h-4 text-amber-600" />
                <h3 className="font-semibold text-gray-800">Competency Area Mastery</h3>
              </div>
              <CompetencyMastery competencies={analyticsData.competencies} />
            </div>
          </div>

          {/* Right Side - Chat Panel (Always Visible) */}
          <div className="w-[420px] flex-shrink-0">
            <ChatPanel isMobileView={false} onClose={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Chat Button */}
      {!isMobileChatOpen && (
        <button
          onClick={() => setIsMobileChatOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-700 hover:bg-green-800 text-white p-4 shadow-lg transition-colors rounded-xl lg:hidden"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Chat Overlay */}
      {isMobileChatOpen && (
        <div className="fixed inset-0 z-50 bg-gray-50">
          <ChatPanel isMobileView={true} onClose={() => setIsMobileChatOpen(false)} />
        </div>
      )}

      {/* Mobile Analytics Content */}
      <div className="p-4 pb-24 space-y-4">
        {/* Header */}
        <div className="bg-green-700 border border-green-800 rounded-xl">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white flex items-center justify-center rounded-xl">
                <GraduationCap className="w-5 h-5 text-green-700" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">CBC Analytics</h1>
                <p className="text-green-100 text-xs">Welcome, {studentName}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Competency */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-green-700" />
              <h3 className="font-semibold text-gray-800 text-sm">Overall Competency</h3>
            </div>
            <CompetencyBadge percentage={analyticsData.overall_competency} />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-green-600 rounded-full" style={{ width: `${analyticsData.overall_competency}%` }} />
              </div>
            </div>
            <span className="text-xl font-bold text-gray-800">{analyticsData.overall_competency}%</span>
          </div>
        </div>

        {/* Risk Cards - Stacked on Mobile */}
        <div className="space-y-3">
          <RiskCard 
            title="Failure Risk" 
            value={analyticsData.risks.failure_risk.value}
            riskLevel={analyticsData.risks.failure_risk.level}
            icon={AlertTriangle}
            description={analyticsData.risks.failure_risk.description}
          />
          <RiskCard 
            title="Dropout Risk" 
            value={analyticsData.risks.dropout_risk.value}
            riskLevel={analyticsData.risks.dropout_risk.level}
            icon={Shield}
            description={analyticsData.risks.dropout_risk.description}
          />
          <RiskCard 
            title="Interventions Needed" 
            value={analyticsData.risks.intervention_needed.value}
            riskLevel={analyticsData.risks.intervention_needed.level}
            icon={Activity}
            description={analyticsData.risks.intervention_needed.description}
          />
        </div>

        {/* Performance Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <LineChart className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Performance Trend</h3>
          </div>
          <PerformanceTrend data={analyticsData.performance_trend} />
        </div>

        {/* Career Pathways */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Career Pathways</h3>
          </div>
          <div className="space-y-3">
            {analyticsData.career_pathways.map((pathway, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-gray-800">{pathway.name}</span>
                  <span className="text-green-700">{pathway.match}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className="h-1.5 bg-green-600 rounded-full" style={{ width: `${pathway.match}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Competency Areas */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <PieChart className="w-4 h-4 text-amber-600" />
            <h3 className="font-semibold text-gray-800 text-sm">Competency Areas</h3>
          </div>
          <div className="space-y-3">
            {analyticsData.competencies.slice(0, 6).map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-700">{comp.name}</span>
                  <span className="text-gray-600">{comp.mastery}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full">
                  <div className={`h-1.5 rounded-full ${comp.mastery >= 75 ? 'bg-green-600' : comp.mastery >= 58 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${comp.mastery}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Prompt */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-700 flex items-center justify-center rounded-xl">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">CBC Academic Assistant</p>
                <p className="text-xs text-gray-600">Ask about competencies, careers, or risks</p>
              </div>
            </div>
            <button
              onClick={() => setIsMobileChatOpen(true)}
              className="px-4 py-2 bg-green-700 text-white text-sm hover:bg-green-800 flex items-center gap-2 rounded-xl"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;