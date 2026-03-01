const { z } = require("zod");

const trimmedString = (max = 2000) => z.string().trim().min(1).max(max);
const optionalTrimmedString = (max = 2000) => z.string().trim().max(max).optional();
const looseObject = z.record(z.string(), z.unknown()).default({});

const schemaByAction = {
  getDashboardSummary: z.object({}).passthrough(),
  listDestinations: z.object({}).passthrough(),
  listArticles: z.object({}).passthrough(),
  getIntegrationHealth: z.object({}).passthrough(),
  runScheduledPublishes: z.object({}).passthrough(),

  listLeads: z.object({
    limit: z.number().int().min(1).max(300).optional(),
    lastId: optionalTrimmedString(128),
    lastCreatedAt: z.union([z.string(), z.number(), z.record(z.string(), z.unknown())]).optional()
  }).passthrough(),

  listReviewQueue: z.object({
    limit: z.number().int().min(1).max(100).optional(),
    lastId: optionalTrimmedString(128)
  }).passthrough(),

  resolveReviewQueueItem: z.object({
    queueId: trimmedString(128),
    resolution: z.enum(["approve", "reject"]),
    rejectionReason: optionalTrimmedString(100)
  }).passthrough(),

  updateLeadStatus: z.object({
    bookingId: trimmedString(128),
    status: z.enum(["new", "contacted", "quoted", "won", "lost"])
  }).passthrough(),

  addLeadNote: z.object({
    bookingId: trimmedString(128),
    note: trimmedString(1500)
  }).passthrough(),

  upsertDestination: z.object({
    id: optionalTrimmedString(120),
    data: looseObject
  }).passthrough(),

  deleteDestination: z.object({
    id: trimmedString(120)
  }).passthrough(),

  upsertArticle: z.object({
    id: optionalTrimmedString(120),
    data: looseObject
  }).passthrough(),

  deleteArticle: z.object({
    id: trimmedString(120)
  }).passthrough(),

  saveSettings: z.object({
    type: trimmedString(80),
    data: looseObject
  }).passthrough(),

  savePageDraft: z.object({
    pageId: trimmedString(80),
    data: looseObject
  }).passthrough(),

  publishPage: z.object({
    pageId: trimmedString(80),
    note: optionalTrimmedString(600),
    changeSummary: optionalTrimmedString(1000)
  }).passthrough(),

  getPageEditor: z.object({
    pageId: trimmedString(80)
  }).passthrough(),

  rollbackPage: z.object({
    pageId: trimmedString(80),
    revisionId: trimmedString(120),
    publishNow: z.boolean().optional()
  }).passthrough(),

  getAuditLogs: z.object({
    limit: z.number().int().min(1).max(50).optional()
  }).passthrough(),

  getConversionDashboard: z.object({
    days: z.number().int().min(1).max(90).optional()
  }).passthrough(),

  schedulePublish: z.object({
    pageId: trimmedString(80),
    scheduledAt: trimmedString(80),
    note: optionalTrimmedString(600),
    changeSummary: optionalTrimmedString(1000)
  }).passthrough(),

  getMediaLibrary: z.object({
    query: optionalTrimmedString(120),
    tag: optionalTrimmedString(60)
  }).passthrough(),

  saveMediaMeta: z.object({
    url: trimmedString(2000),
    tags: z.array(z.string().trim().max(40)).max(20).optional(),
    alt: optionalTrimmedString(240)
  }).passthrough(),

  replaceMediaAsset: z.object({
    oldUrl: trimmedString(2000),
    newUrl: trimmedString(2000)
  }).passthrough(),

  setUserRole: z.object({
    uid: trimmedString(128),
    role: z.enum(["admin", "editor", "viewer"])
  }).passthrough()
};

function validateAdminActionPayload(action, payload) {
  const schema = schemaByAction[action];
  if (!schema) {
    return {
      ok: true,
      payload: payload && typeof payload === "object" ? payload : {}
    };
  }

  const parsed = schema.safeParse(payload && typeof payload === "object" ? payload : {});
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      error: issue?.message || "invalid_payload",
      path: Array.isArray(issue?.path) ? issue.path.join(".") : ""
    };
  }

  return { ok: true, payload: parsed.data };
}

module.exports = {
  validateAdminActionPayload
};
