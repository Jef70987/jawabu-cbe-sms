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
  const prediction = normalizePredictionPayload(payload);
  const recommendations = normalizeRecommendationsPayload(payload);
  const factors = normalizeFactors(payload, "model");

  const container = extractData(payload);
  const looksLikeChatbotPayload =
    container &&
    typeof container === "object" &&
    (container.risks || container.career_pathways || container.overall_competency);

  let source = looksLikeChatbotPayload ? "chatbot_api" : "ml_api";
  if (prediction.prediction === null && !recommendations.length && !factors.length) {
    source = "unavailable";
  }

  if (source === "unavailable") {
    return {
      ...DEFAULT_UNAVAILABLE_INSIGHT,
      raw: payload,
    };
  }

  return {
    studentId: prediction.studentId,
    prediction: prediction.prediction,
    riskLevel: prediction.riskLevel,
    confidence: prediction.confidence,
    confidenceBand: prediction.confidenceBand,
    recommendations,
    factors,
    source,
    lastUpdated: prediction.lastUpdated,
    raw: payload,
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

async function fetchStudentDashboard({ studentId, token, signal } = {}) {
  const url = withQuery(`${API_BASE_URL}/ml/dashboard/`, {
    student_id: studentId ?? undefined,
  });
  return fetchJson(url, { token, signal });
}

export async function fetchStudentMLInsight({ studentId, token, signal } = {}) {
  const [predictionResult, recommendationResult, dashboardResult] = await Promise.allSettled([
    fetchJson(
      withQuery(`${API_BASE_URL}/ml/predictions/`, { student_id: studentId ?? undefined }),
      { token, signal }
    ),
    fetchJson(
      withQuery(`${API_BASE_URL}/ml/recommendations/`, { student_id: studentId ?? undefined }),
      { token, signal }
    ),
    fetchStudentDashboard({ studentId, token, signal }),
  ]);

  const predictionPayload = predictionResult.status === "fulfilled" ? predictionResult.value : null;
  const recommendationPayload = recommendationResult.status === "fulfilled" ? recommendationResult.value : null;
  const dashboardPayload = dashboardResult.status === "fulfilled" ? dashboardResult.value : null;

  const normalizedPrediction = predictionPayload ? normalizePredictionPayload(predictionPayload) : null;
  const normalizedRecommendations = recommendationPayload
    ? normalizeRecommendationsPayload(recommendationPayload)
    : [];
  const factors = dashboardPayload ? normalizeFactors(dashboardPayload, "model") : [];

  const allMissing =
    !normalizedPrediction &&
    normalizedRecommendations.length === 0 &&
    factors.length === 0 &&
    !dashboardPayload;

  const allRejected =
    predictionResult.status === "rejected" &&
    recommendationResult.status === "rejected" &&
    dashboardResult.status === "rejected";

  if (allRejected) {
    const rejectedReasons = [predictionResult, recommendationResult, dashboardResult]
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason);

    const abortReason = rejectedReasons.find((reason) => isAbortError(reason));
    if (abortReason) throw abortReason;

    const firstMessage = rejectedReasons
      .map((reason) => reason?.message || String(reason || ""))
      .find((message) => message && message.trim());

    throw new Error(firstMessage || "ML insight unavailable. Please try again.");
  }

  if (allMissing) {
    return {
      ...DEFAULT_UNAVAILABLE_INSIGHT,
      raw: {
        predictionError:
          predictionResult.status === "rejected" ? predictionResult.reason?.message || String(predictionResult.reason) : null,
        recommendationError:
          recommendationResult.status === "rejected"
            ? recommendationResult.reason?.message || String(recommendationResult.reason)
            : null,
        dashboardError:
          dashboardResult.status === "rejected" ? dashboardResult.reason?.message || String(dashboardResult.reason) : null,
      },
    };
  }

  return {
    studentId: normalizedPrediction?.studentId ?? studentId ?? null,
    prediction: normalizedPrediction?.prediction ?? null,
    riskLevel: normalizedPrediction?.riskLevel || "unknown",
    confidence: normalizedPrediction?.confidence ?? null,
    confidenceBand: normalizedPrediction?.confidenceBand || "unknown",
    recommendations: normalizedRecommendations,
    factors,
    source: "ml_api",
    lastUpdated: normalizedPrediction?.lastUpdated ?? null,
    raw: {
      predictions: predictionPayload,
      recommendations: recommendationPayload,
      dashboard: dashboardPayload,
      errors: {
        predictions:
          predictionResult.status === "rejected" ? predictionResult.reason?.message || String(predictionResult.reason) : null,
        recommendations:
          recommendationResult.status === "rejected"
            ? recommendationResult.reason?.message || String(recommendationResult.reason)
            : null,
        dashboard:
          dashboardResult.status === "rejected" ? dashboardResult.reason?.message || String(dashboardResult.reason) : null,
      },
    },
  };
}
