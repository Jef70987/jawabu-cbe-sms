import React, { useState } from 'react';
import {
  Brain, TrendingUp, TrendingDown, AlertTriangle,
  Calendar, Download, Eye, Target, Shield,
  Activity, Clock, Users, GraduationCap
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  AreaChart, Area, ResponsiveContainer, ComposedChart, Bar
} from 'recharts';

const AnalyticsPredictive = () => {
  const [forecastPeriod, setForecastPeriod] = useState('6months');

  const historicalData = [
    { month: 'Jan', enrollment: 2420, performance: 85, budget: 4.2, satisfaction: 86 },
    { month: 'Feb', enrollment: 2430, performance: 86, budget: 4.3, satisfaction: 87 },
    { month: 'Mar', enrollment: 2440, performance: 87, budget: 4.4, satisfaction: 87 },
    { month: 'Apr', enrollment: 2445, performance: 88, budget: 4.5, satisfaction: 88 },
    { month: 'May', enrollment: 2450, performance: 89, budget: 4.6, satisfaction: 89 },
    { month: 'Jun', enrollment: 2455, performance: 90, budget: 4.7, satisfaction: 90 }
  ];

  const forecastData = [
    { month: 'Jul', enrollment: 2470, performance: 91, budget: 4.8, satisfaction: 91, confidence: 92 },
    { month: 'Aug', enrollment: 2485, performance: 92, budget: 4.9, satisfaction: 92, confidence: 88 },
    { month: 'Sep', enrollment: 2500, performance: 93, budget: 5.0, satisfaction: 93, confidence: 85 },
    { month: 'Oct', enrollment: 2520, performance: 94, budget: 5.1, satisfaction: 94, confidence: 82 },
    { month: 'Nov', enrollment: 2540, performance: 95, budget: 5.2, satisfaction: 95, confidence: 78 },
    { month: 'Dec', enrollment: 2560, performance: 96, budget: 5.3, satisfaction: 96, confidence: 75 }
  ];

  const riskPredictions = [
    { area: 'Grade 12 Performance', risk: 'Medium', probability: 65, trend: 'increasing' },
    { area: 'Budget Utilization', risk: 'Low', probability: 35, trend: 'stable' },
    { area: 'Staff Retention', risk: 'Low', probability: 28, trend: 'decreasing' },
    { area: 'Enrollment Capacity', risk: 'High', probability: 82, trend: 'increasing' }
  ];

  const interventionImpact = [
    { intervention: 'Academic Support Program', impact: 85, cost: 'Medium', roi: 'High' },
    { intervention: 'Teacher Training', impact: 78, cost: 'Low', roi: 'High' },
    { intervention: 'Infrastructure Upgrade', impact: 65, cost: 'High', roi: 'Medium' },
    { intervention: 'Student Counseling', impact: 92, cost: 'Medium', roi: 'Very High' }
  ];

  const combinedData = [...historicalData.slice(-3), ...forecastData];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Predictive Analytics</h1>
          <p className="text-gray-600 mt-1">AI-powered predictions and risk assessment</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={forecastPeriod}
            onChange={(e) => setForecastPeriod(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="3months">Next 3 Months</option>
            <option value="6months">Next 6 Months</option>
            <option value="year">Next Year</option>
          </select>
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
            <Download size={18} className="text-gray-600" />
            <span>Export Forecast</span>
          </button>
        </div>
      </div>

      {/* AI Confidence Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Forecast Confidence</p>
              <p className="text-3xl font-bold mt-2">85%</p>
            </div>
            <Brain size={32} className="text-purple-200" />
          </div>
          <p className="text-purple-100 text-sm mt-2">Based on 5 years of data</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Predicted Enrollment</p>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-bold text-blue-600">2,560</span>
            <TrendingUp size={20} className="ml-2 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1">By December 2024</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Budget Projection</p>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-bold text-green-600">$5.3M</span>
            <TrendingUp size={20} className="ml-2 text-green-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1">12.8% growth expected</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <p className="text-sm text-gray-600">Risk Alert Level</p>
          <div className="flex items-baseline mt-2">
            <span className="text-2xl font-bold text-yellow-600">Moderate</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Monitor capacity planning</p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">6-Month Forecast</h2>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="enrollment" yAxisId="left" fill="#3B82F6" fillOpacity={0.1} stroke="#3B82F6" />
            <Line type="monotone" dataKey="performance" yAxisId="left" stroke="#10B981" strokeWidth={2} name="Performance Score" />
            <Bar yAxisId="right" dataKey="budget" fill="#F59E0B" name="Budget ($M)" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Confidence interval: 85% - Predictions updated weekly with new data</p>
        </div>
      </div>

      {/* Risk Predictions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Risk Predictions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Risk Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riskPredictions.map((risk, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{risk.area}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      risk.risk === 'High' ? 'bg-red-100 text-red-800' :
                      risk.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{risk.probability}%</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${risk.probability}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {risk.trend === 'increasing' ? 
                        <TrendingUp size={14} className="text-red-500" /> : 
                        <TrendingDown size={14} className="text-green-500" />
                      }
                      <span className="text-sm text-gray-600 capitalize">{risk.trend}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Intervention Impact Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Intervention Impact Analysis</h2>
          <div className="space-y-4">
            {interventionImpact.map((intervention, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-800">{intervention.intervention}</h3>
                  <span className="text-xs text-green-600">ROI: {intervention.roi}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-500">Impact</p>
                    <p className="font-semibold text-blue-600">{intervention.impact}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Cost</p>
                    <p className="font-medium text-gray-700">{intervention.cost}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Priority</p>
                    <p className="font-medium text-purple-600">
                      {intervention.impact >= 85 ? 'High' : intervention.impact >= 75 ? 'Medium' : 'Low'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Target size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Capacity Planning</p>
                <p className="text-sm text-gray-600">Prepare for 5% enrollment increase by next year</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield size={20} className="text-purple-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Risk Mitigation</p>
                <p className="text-sm text-gray-600">Implement early intervention for at-risk students</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TrendingUp size={20} className="text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Budget Allocation</p>
                <p className="text-sm text-gray-600">Increase budget for technology infrastructure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPredictive;