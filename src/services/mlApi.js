const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const NORMALIZED_API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, "");
const API_ORIGIN = NORMALIZED_API_BASE_URL.endsWith("/api")
  ? NORMALIZED_API_BASE_URL.slice(0, -4)
  : NORMALIZED_API_BASE_URL;
const API_BASE_URL = `${API_ORIGIN}/api`;

const PREDICTION_FIELDS = [
  "risk_score",
  "risk_probability",
  "prediction",
  "predicted_score",
  "score_prediction",
];

const CONFIDENCE_FIELDS = ["confidence", "confidence_score", "probability", "risk_confidence"];

const TIMESTAMP_FIELDS = ["created_at", "updated_at", "timestamp", "prediction_timestamp"];

const RECOMMENDATION_FIELDS = [
  "recommendations",
  "top_recommendations",
  "intervention_recommendations",
  "suggested_actions",
  "action_items",
];

const FACTOR_FIELDS = [
  "factors",
  "top_factors",
  "feature_importance",
  "feature_importances",
  "explanations",
  "contributing_factors",
];

const FEATURE_LABELS = {
  attendance_rate: "Attendance rate",
  mastery_ratio: "Competency mastery",
  be_ratio: "Below expectation ratio",
  ae_ratio: "Approaching expectation ratio",
  me_ratio: "Meeting expectation ratio",
  ee_ratio: "Exceeding expectation ratio",
  discipline_incidents: "Discipline incidents",
  intervention_count: "Intervention history",
  final_internal_value: "Final performance score",
};

const DEFAULT_UNAVAILABLE_INSIGHT = {
  studentId: null,
  prediction: null,
  riskLevel: "unknown",
  confidence: null,
  confidenceBand: "unknown",
  recommendations: [],
  factors: [],
  source: "unavailable",
  lastUpdated: null,
  error: null,
  raw: null,
};

const DEFAULT_UNAVAILABLE_MONITORING = {
  source: "unavailable",
  modelVersion: null,
  latestPredictionRun: null,
  predictionCount: null,
  averageConfidence: null,
  driftStatus: "unknown",
  activeAlertCount: null,
  latestEvaluation: null,
  lastUpdated: null,
  errors: [],
  raw: null,
};

function asNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  return [];
}

function extractData(payload) {
  if (payload === null || payload === undefined) return null;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return payload;
  if (Array.isArray(payload.results)) return payload.results;
  if (payload.data !== undefined && payload.data !== null) {
    if (Array.isArray(payload.data)) return payload.data;
    if (typeof payload.data === "object") {
      if (Array.isArray(payload.data.results)) return payload.data.results;
      return payload.data;
    }
    return payload.data;
  }
  return payload;
}

function sanitizeTimestamp(value) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return String(value);
}

function isAbortError(error) {
  return error?.name === "AbortError";
}

function pickFirstNonNull(obj, fields) {
  if (!obj || typeof obj !== "object") return null;
  for (const field of fields) {
    if (obj[field] !== undefined && obj[field] !== null && obj[field] !== "") {
      return obj[field];
    }
  }
  return null;
}

function normalizeRiskLevel(value) {
  if (typeof value !== "string") return "unknown";
  const v = value.toLowerCase().trim();
  if (v.includes("high") || v === "h") return "high";
  if (v.includes("medium") || v.includes("moderate") || v === "m") return "medium";
  if (v.includes("low") || v === "l") return "low";
  return "unknown";
}

function confidenceBandFromValue(confidence) {
  if (confidence === null || !Number.isFinite(confidence)) return "unknown";
  if (confidence >= 0.75) return "high";
  if (confidence >= 0.5) return "medium";
  if (confidence < 0.5) return "low";
  return "unknown";
}

function riskLevelFromScores({ riskLevel, prediction, predictedScore }) {
  const normalizedRisk = normalizeRiskLevel(riskLevel);
  if (normalizedRisk !== "unknown") return normalizedRisk;

  if (prediction !== null && Number.isFinite(prediction)) {
    if (prediction >= 0.7) return "high";
    if (prediction >= 0.4) return "medium";
    return "low";
  }

  if (predictedScore !== null && Number.isFinite(predictedScore)) {
    if (predictedScore < 50) return "high";
    if (predictedScore < 70) return "medium";
    return "low";
  }

  return "unknown";
}

function normalizePriority(value) {
  if (typeof value === "number") {
    if (value <= 2) return "high";
    if (value === 3) return "medium";
    return "low";
  }

  const raw = String(value || "").toLowerCase().trim();
  if (!raw) return "medium";
  if (raw.includes("urgent") || raw.includes("critical") || raw.includes("high")) return "high";
  if (raw.includes("medium") || raw.includes("moderate")) return "medium";
  if (raw.includes("low")) return "low";
  return "medium";
}

function normalizeRecommendationType(value) {
  const raw = String(value || "").toLowerCase().trim();
  if (!raw) return "general";
  if (raw.includes("career") || raw.includes("pathway")) return "career";
  if (raw.includes("attendance")) return "attendance";
  if (raw.includes("behavior") || raw.includes("discipline")) return "behavior";
  if (raw.includes("academic") || raw.includes("study") || raw.includes("remediation") || raw.includes("enrichment")) {
    return "academic";
  }
  return "general";
}

function normalizeRecommendationSource(value) {
  const raw = String(value || "").toLowerCase().trim();
  if (!raw) return "fallback";
  if (raw.includes("rule")) return "rule_based";
  if (raw.includes("ml") || raw.includes("model") || raw.includes("hybrid")) return "ml";
  return "fallback";
}

function normalizeFactorSource(value) {
  const raw = String(value || "").toLowerCase().trim();
  if (!raw) return "model";
  if (raw.includes("rule")) return "rule_based";
  if (raw.includes("fallback")) return "fallback";
  return "model";
}

function humanizeFeatureName(feature) {
  if (!feature) return "Unknown factor";
  const normalized = String(feature).trim();
  if (FEATURE_LABELS[normalized]) return FEATURE_LABELS[normalized];
  return normalized
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function normalizeFactorDirection(value, impact) {
  const raw = String(value || "").toLowerCase().trim();
  if (raw === "positive" || raw === "negative" || raw === "neutral") return raw;
  if (impact > 0) return "positive";
  if (impact < 0) return "negative";
  return "neutral";
}

function buildAuthHeaders(token) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const sourceToken = token || localStorage.getItem("token");
  if (sourceToken) {
    const tokenValue = sourceToken.startsWith("Bearer ") ? sourceToken : `Bearer ${sourceToken}`;
    headers.Authorization = tokenValue;
  }

  return headers;
}

async function fetchJson(url, { token, signal } = {}) {
  const response = await fetch(url, {
    method: "GET",
    headers: buildAuthHeaders(token),
    signal,
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const apiMessage =
      payload && typeof payload === "object"
        ? payload.error || payload.detail || payload.message || null
        : null;
    const detailSource = apiMessage || (typeof payload === "string" ? payload : "");
    const detail = String(detailSource || "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);
    const safeDetail = detail || "Please try again.";
    throw new Error(`ML insight unavailable (${response.status}): ${safeDetail}`);
  }

  return payload;
}

function withQuery(url, query) {
  const entries = Object.entries(query).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (!entries.length) return url;
  const params = new URLSearchParams();
  for (const [k, v] of entries) {
    params.set(k, String(v));
  }
  return `${url}?${params.toString()}`;
}

function normalizeFactors(payload, source = "model") {
  const container = extractData(payload);
  let factorList = [];

  if (Array.isArray(container)) {
    factorList = container;
  } else if (container && typeof container === "object") {
    for (const key of FACTOR_FIELDS) {
      const found = container[key];
      if (Array.isArray(found)) {
        factorList = found;
        break;
      }
    }
  }

  return asArray(factorList).map((factor) => {
    const feature = factor?.feature || factor?.name || factor?.key || "";
    const impact = asNumber(factor?.impact ?? factor?.weight ?? factor?.score ?? factor?.value);
    const direction = normalizeFactorDirection(factor?.direction ?? factor?.trend, impact);
    const explanation =
      factor?.explanation ||
      factor?.description ||
      factor?.reason ||
      "This factor is associated with the current estimate.";

    return {
      feature,
      label: factor?.label || humanizeFeatureName(feature),
      impact,
      direction,
      explanation: String(explanation),
      source: normalizeFactorSource(factor?.source || source),
    };
  });
}

export function normalizePredictionPayload(payload) {
  const data = extractData(payload);
  const first = Array.isArray(data) ? data[0] || null : data;
  const rootObj = first && typeof first === "object" ? first : {};

  let prediction = asNumber(pickFirstNonNull(rootObj, PREDICTION_FIELDS));
  if (prediction === null && rootObj?.risks?.failure_risk) {
    prediction = asNumber(rootObj.risks.failure_risk.value);
  }

  const confidenceRaw =
    asNumber(pickFirstNonNull(rootObj, CONFIDENCE_FIELDS)) ??
    asNumber(rootObj?.confidence_score) ??
    asNumber(rootObj?.risk_confidence);

  let predictedScore = asNumber(rootObj?.predicted_score);
  if (predictedScore === null && rootObj?.predicted_scores && typeof rootObj.predicted_scores === "object") {
    const values = Object.values(rootObj.predicted_scores)
      .map((item) => asNumber(item?.predicted_score))
      .filter((v) => v !== null);
    if (values.length) {
      predictedScore = values.reduce((sum, v) => sum + v, 0) / values.length;
    }
  }
  if (predictedScore === null) {
    predictedScore = prediction;
  }

  const riskLevel = riskLevelFromScores({
    riskLevel: rootObj?.risk_level || rootObj?.competency_level,
    prediction,
    predictedScore,
  });

  const studentId =
    rootObj?.studentId ??
    rootObj?.student_id ??
    rootObj?.student?.id ??
    rootObj?.student?.student_id ??
    null;

  const lastUpdatedRaw = pickFirstNonNull(rootObj, TIMESTAMP_FIELDS);
  const lastUpdated = sanitizeTimestamp(lastUpdatedRaw);

  return {
    studentId,
    prediction,
    riskLevel,
    confidence: confidenceRaw,
    confidenceBand: confidenceBandFromValue(confidenceRaw),
    lastUpdated,
    raw: payload,
  };
}

export function normalizeRecommendationsPayload(payload) {
  const data = extractData(payload);
  let recommendations = [];

  if (Array.isArray(data)) {
    recommendations = data;
  } else if (data && typeof data === "object") {
    for (const key of RECOMMENDATION_FIELDS) {
      if (Array.isArray(data[key])) {
        recommendations = data[key];
        break;
      }
    }
    if (!recommendations.length && Array.isArray(data.results)) {
      recommendations = data.results;
    }
  }

  return asArray(recommendations).map((item) => {
    const title = item?.title || item?.name || item?.heading || "Recommendation";
    const description = item?.description || item?.content || item?.message || "";
    return {
      id: item?.id ?? item?.recommendation_id ?? null,
      title: String(title),
      description: String(description),
      priority: normalizePriority(item?.priority),
      type: normalizeRecommendationType(item?.type || item?.category),
      source: normalizeRecommendationSource(item?.source),
    };
  });
}

export function normalizeMLInsight(payload) {
  const body = payload && typeof payload === "object" ? payload : {};
  const data = body?.data && typeof body.data === "object" ? body.data : body;

  const recommendations = asArray(data?.recommendations).map((item) => ({
    id: item?.id ?? item?.recommendation_id ?? null,
    title: String(item?.title || "Recommendation"),
    description: String(item?.description || item?.content || ""),
    priority: normalizePriority(item?.priority),
    type: normalizeRecommendationType(item?.type || item?.category),
    source: normalizeRecommendationSource(item?.source),
    createdAt: sanitizeTimestamp(item?.created_at ?? item?.createdAt),
  }));

  const factors = normalizeFactors(data, "model");

  const insight = {
    ...DEFAULT_UNAVAILABLE_INSIGHT,
    studentId: data?.student_id ?? data?.studentId ?? null,
    prediction: asNumber(data?.prediction ?? data?.risk_probability ?? data?.risk_score),
    riskLevel: normalizeRiskLevel(data?.risk_level ?? data?.riskLevel),
    confidence: asNumber(data?.confidence ?? data?.risk_confidence ?? data?.confidence_score),
    confidenceBand:
      String((data?.confidence_band ?? data?.confidenceBand) || "").toLowerCase() ||
      confidenceBandFromValue(asNumber(data?.confidence ?? data?.risk_confidence ?? data?.confidence_score)),
    recommendations,
    factors,
    source: String(data?.source || "unavailable").toLowerCase(),
    lastUpdated: sanitizeTimestamp(data?.last_updated ?? data?.lastUpdated),
    error: body?.error || null,
    raw: payload,
  };

  if (!["high", "medium", "low"].includes(insight.riskLevel)) {
    insight.riskLevel = "unknown";
  }

  if (!["high", "medium", "low", "unknown"].includes(insight.confidenceBand)) {
    insight.confidenceBand = confidenceBandFromValue(insight.confidence);
  }

  if (!["ml_api", "unavailable"].includes(insight.source)) {
    insight.source = "unavailable";
  }

  return insight;
}

export function getMLInsightUnavailable(studentId, error = null) {
  return {
    ...DEFAULT_UNAVAILABLE_INSIGHT,
    studentId: studentId ?? null,
    error,
  };
}

export async function fetchStudentPredictions({ studentId, token, signal } = {}) {
  const url = withQuery(`${API_BASE_URL}/ml/predictions/`, {
    student_id: studentId ?? undefined,
  });
  const payload = await fetchJson(url, { token, signal });
  return normalizePredictionPayload(payload);
}

export async function fetchStudentRecommendations({ studentId, token, signal } = {}) {
  const url = withQuery(`${API_BASE_URL}/ml/recommendations/`, {
    student_id: studentId ?? undefined,
  });
  const payload = await fetchJson(url, { token, signal });
  return normalizeRecommendationsPayload(payload);
}

export async function fetchStudentMLInsight({ studentId, token, signal, timeoutMs = 15000 } = {}) {
  if (!studentId) {
    return getMLInsightUnavailable(studentId);
  }

  const url = withQuery(`${API_BASE_URL}/ml/student-insight/`, {
    student_id: studentId,
  });

  const controller = new AbortController();
  const normalizedTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0 ? timeoutMs : 15000;
  let abortedByCaller = false;
  let abortedByTimeout = false;
  const handleCallerAbort = () => {
    abortedByCaller = true;
    controller.abort();
  };
  const timeoutId = setTimeout(() => {
    abortedByTimeout = true;
    controller.abort();
  }, normalizedTimeoutMs);

  if (signal) {
    if (signal.aborted) {
      handleCallerAbort();
    } else {
      signal.addEventListener("abort", handleCallerAbort, { once: true });
    }
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: buildAuthHeaders(token),
      signal: controller.signal,
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }

    if (response.status === 401 || response.status === 403) {
      return getMLInsightUnavailable(studentId, "You are not permitted to view this ML insight.");
    }

    if (response.status === 429) {
      return getMLInsightUnavailable(
        studentId,
        "ML insight is temporarily rate-limited. Please try again shortly."
      );
    }

    if (!response.ok || payload?.status === "error") {
      const apiError = payload && typeof payload === "object" ? String(payload.error || "").toLowerCase() : "";
      if (apiError.includes("not permitted")) {
        return getMLInsightUnavailable(studentId, "You are not permitted to view this ML insight.");
      }
      if (apiError.includes("rate-limited") || apiError.includes("rate limited")) {
        return getMLInsightUnavailable(
          studentId,
          "ML insight is temporarily rate-limited. Please try again shortly."
        );
      }
      if (apiError.includes("student_id is required") || apiError.includes("invalid student_id")) {
        return getMLInsightUnavailable(studentId, "ML insight is unavailable for this student right now.");
      }
      return getMLInsightUnavailable(studentId, "ML insight is unavailable right now.");
    }

    const normalized = normalizeMLInsight(payload);
    if (normalized.source === "unavailable" && !normalized.error) {
      return getMLInsightUnavailable(studentId, "ML insight is not available yet.");
    }
    return normalized;
  } catch (error) {
    if (isAbortError(error)) {
      if (abortedByTimeout && !abortedByCaller) {
        return getMLInsightUnavailable(
          studentId,
          "ML insight request timed out. Please try again."
        );
      }
      throw error;
    }
    return getMLInsightUnavailable(
      studentId,
      "ML insight is unavailable right now. Please try again."
    );
  } finally {
    clearTimeout(timeoutId);
    if (signal) {
      signal.removeEventListener("abort", handleCallerAbort);
    }
  }
}

export function getMLMonitoringUnavailable() {
  return { ...DEFAULT_UNAVAILABLE_MONITORING };
}

export function normalizeMLMonitoringSummary(payload) {
  const body = payload?.data ?? payload ?? {};
  const data = body?.data ?? body ?? {};

  const driftStatusRaw =
    data?.drift_status ??
    data?.driftStatus ??
    data?.drift_state ??
    data?.monitoring?.drift_status ??
    "unknown";

  const driftStatus = String(driftStatusRaw || "unknown").toLowerCase();

  const sourceRaw = data?.source ?? body?.source ?? "ml_monitoring_api";
  const source = String(sourceRaw || "ml_monitoring_api").toLowerCase();

  return {
    source: source === "unavailable" ? "unavailable" : "ml_monitoring_api",
    modelVersion:
      data?.model_version ??
      data?.modelVersion ??
      data?.latest_model_version ??
      data?.model?.version ??
      null,
    latestPredictionRun:
      data?.latest_prediction_run ??
      data?.latestPredictionRun ??
      data?.last_prediction_run ??
      data?.prediction_timestamp ??
      null,
    predictionCount:
      asNumber(data?.prediction_count) ??
      asNumber(data?.predictionCount) ??
      asNumber(data?.total_predictions) ??
      asNumber(data?.stats?.prediction_count) ??
      null,
    averageConfidence:
      asNumber(data?.average_confidence) ??
      asNumber(data?.averageConfidence) ??
      asNumber(data?.stats?.average_confidence) ??
      null,
    driftStatus: driftStatus || "unknown",
    activeAlertCount:
      asNumber(data?.active_alert_count) ??
      asNumber(data?.activeAlertCount) ??
      asNumber(data?.alert_count) ??
      asNumber(data?.alerts?.active_count) ??
      null,
    latestEvaluation:
      data?.latest_evaluation ??
      data?.latestEvaluation ??
      data?.metrics ??
      data?.evaluation ??
      null,
    lastUpdated:
      sanitizeTimestamp(data?.last_updated) ??
      sanitizeTimestamp(data?.lastUpdated) ??
      sanitizeTimestamp(data?.updated_at) ??
      sanitizeTimestamp(body?.updated_at) ??
      null,
    errors: Array.isArray(data?.errors)
      ? data.errors
      : Array.isArray(body?.errors)
        ? body.errors
        : [],
    raw: payload,
  };
}

export async function fetchMLMonitoringSummary({ token, signal } = {}) {
  const endpoints = [
    `${API_BASE_URL}/ml/monitoring/health/`,
    `${API_BASE_URL}/ml/observability/health/`,
    `${API_BASE_URL}/ml/dashboard/`,
  ];

  let lastError = null;

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: buildAuthHeaders(token),
        signal,
      });

      let payload = null;
      try {
        payload = await response.json();
      } catch {
        payload = null;
      }

      if (response.status === 401 || response.status === 403) {
        return {
          ...getMLMonitoringUnavailable(),
          errors: ["You are not permitted to view ML monitoring data."],
        };
      }

      if (response.status === 429) {
        return {
          ...getMLMonitoringUnavailable(),
          errors: ["ML monitoring is temporarily rate-limited. Try again shortly."],
        };
      }

      if (!response.ok || payload?.status === "error") {
        lastError = payload?.error || `Monitoring endpoint failed: ${endpoint}`;
        continue;
      }

      const normalized = normalizeMLMonitoringSummary(payload);
      if (normalized.source === "unavailable") {
        return {
          ...normalized,
          errors: normalized.errors?.length ? normalized.errors : ["No model health data available yet."],
        };
      }
      return normalized;
    } catch (error) {
      if (isAbortError(error)) throw error;
      lastError = error?.message || `Monitoring endpoint failed: ${endpoint}`;
    }
  }

  return {
    ...getMLMonitoringUnavailable(),
    errors: lastError ? [String(lastError)] : ["ML monitoring is unavailable."],
  };
}
