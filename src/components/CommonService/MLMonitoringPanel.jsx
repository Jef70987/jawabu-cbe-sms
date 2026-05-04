import React, { useCallback, useEffect, useState } from 'react';
import { Activity, AlertTriangle, BarChart3, Brain, RefreshCw, ShieldCheck } from 'lucide-react';
import { fetchMLMonitoringSummary, getMLMonitoringUnavailable } from '../../services/mlApi';

const formatConfidence = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return 'Unavailable';
  if (value >= 0 && value <= 1) return `${Math.round(value * 100)}%`;
  return `${Math.round(value)}%`;
};

const formatTimestamp = (value) => {
  if (!value) return 'Unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unavailable';
  return parsed.toLocaleString();
};

const formatMetricValue = (value) => {
  if (value === null || value === undefined || value === '') return 'Unavailable';
  if (typeof value === 'number' && Number.isFinite(value)) return String(Math.round(value * 100) / 100);
  return String(value);
};

const extractMetricRows = (latestEvaluation) => {
  if (!latestEvaluation || typeof latestEvaluation !== 'object') return [];
  return Object.entries(latestEvaluation).slice(0, 4).map(([key, value]) => ({
    key: key.replace(/_/g, ' '),
    value: formatMetricValue(value),
  }));
};

function MonitoringCard({ icon, label, value }) {
  const IconComponent = icon;
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="mb-1 flex items-center gap-2">
        <IconComponent className="h-4 w-4 text-green-700" />
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function MLMonitoringPanel({ token, canViewMonitoring = false }) {
  const [summary, setSummary] = useState(getMLMonitoringUnavailable());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMonitoring = useCallback(async ({ signal } = {}) => {
    if (!canViewMonitoring) return;
    setLoading(true);
    setError(null);

    try {
      const result = await fetchMLMonitoringSummary({ token, signal });
      setSummary(result);
      if (Array.isArray(result.errors) && result.errors.length > 0) {
        setError(result.errors[0]);
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setSummary(getMLMonitoringUnavailable());
      setError('ML monitoring is unavailable right now.');
    } finally {
      setLoading(false);
    }
  }, [canViewMonitoring, token]);

  useEffect(() => {
    if (!canViewMonitoring) return undefined;
    const controller = new AbortController();
    loadMonitoring({ signal: controller.signal });
    return () => controller.abort();
  }, [canViewMonitoring, loadMonitoring]);

  if (!canViewMonitoring) return null;

  const metricRows = extractMetricRows(summary.latestEvaluation);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">ML Monitoring</h2>
          <p className="text-sm text-gray-600">Monitoring data is aggregate and intended for authorized staff review.</p>
        </div>
        <button
          type="button"
          onClick={() => loadMonitoring()}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {loading && <p className="mb-3 text-sm text-gray-600">Loading ML monitoring...</p>}
      {error && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      {summary.source === 'unavailable' && !loading ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-600">
          ML monitoring unavailable.
        </div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MonitoringCard icon={Brain} label="Latest model version" value={summary.modelVersion || 'Unavailable'} />
            <MonitoringCard icon={Activity} label="Last prediction run" value={formatTimestamp(summary.latestPredictionRun)} />
            <MonitoringCard
              icon={BarChart3}
              label="Aggregate prediction count"
              value={summary.predictionCount ?? 'Unavailable'}
            />
            <MonitoringCard
              icon={ShieldCheck}
              label="Average model confidence"
              value={formatConfidence(summary.averageConfidence)}
            />
            <MonitoringCard
              icon={Activity}
              label="Drift status"
              value={summary.driftStatus || 'Unknown'}
            />
            <MonitoringCard
              icon={AlertTriangle}
              label="Active monitoring alerts"
              value={summary.activeAlertCount ?? 'No active alerts reported'}
            />
            <MonitoringCard
              icon={BarChart3}
              label="Last updated"
              value={formatTimestamp(summary.lastUpdated)}
            />
            <MonitoringCard
              icon={ShieldCheck}
              label="Source"
              value={summary.source === 'ml_monitoring_api' ? 'ML monitoring API' : 'Unavailable'}
            />
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">Latest evaluation metrics</h3>
            {metricRows.length === 0 ? (
              <p className="text-sm text-gray-500">Latest evaluation metrics unavailable.</p>
            ) : (
              <div className="grid gap-2 md:grid-cols-2">
                {metricRows.map((row) => (
                  <div key={row.key} className="rounded border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700">
                    <span className="font-medium capitalize">{row.key}:</span> {row.value}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
