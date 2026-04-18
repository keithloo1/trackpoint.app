/// <reference path="../pb_data/types.d.ts" />
onRecordViewRequest((e) => {
  // Log portal access attempts for security audit trail
  const clientIp = e.requestInfo.headers.get("x-forwarded-for") || e.requestInfo.headers.get("cf-connecting-ip") || e.requestInfo.remoteIP || "unknown";
  const portalId = e.record.id;
  const accessTime = new Date().toISOString();
  
  console.log("Portal Access Log: portalId=" + portalId + ", accessTime=" + accessTime + ", clientIP=" + clientIp);
  
  e.next();
}, "settings");