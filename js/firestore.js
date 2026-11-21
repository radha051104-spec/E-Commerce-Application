const BASE = `https://firestore.googleapis.com/v1/projects/${CONFIG.projectId}/databases/(default)/documents`;

// JS value -> Firestore typed value
function toFS(v) {
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  return { stringValue: String(v) };
}
// Firestore typed value -> JS value
function fromFS(f) {
  if ("integerValue" in f) return Number(f.integerValue);
  if ("doubleValue" in f) return f.doubleValue;
  if ("booleanValue" in f) return f.booleanValue;
  return f.stringValue ?? "";
}
function docToObj(d) {
  const o = { id: d.name.split("/").pop() };
  for (const k in d.fields || {}) o[k] = fromFS(d.fields[k]);
  return o;
}
function objToDoc(obj) {
  const fields = {};
  for (const k in obj) if (k !== "id") fields[k] = toFS(obj[k]);
  return { fields };
}

const DB = {
  // READ all
  async list(col) {
    const r = await fetch(`${BASE}/${col}?pageSize=300&key=${CONFIG.apiKey}`);
    const j = await r.json();
    return (j.documents || []).map(docToObj);
  },
  // READ one
  async get(col, id) {
    const r = await fetch(`${BASE}/${col}/${id}?key=${CONFIG.apiKey}`);
    return docToObj(await r.json());
  },
  // CREATE (with your own id)
  async create(col, id, obj) {
    const r = await fetch(`${BASE}/${col}?documentId=${id}&key=${CONFIG.apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objToDoc(obj))
    });
    return docToObj(await r.json());
  },
  // UPDATE (only the fields you pass)
  async update(col, id, obj) {
    const mask = Object.keys(obj).filter(k => k !== "id")
      .map(k => `updateMask.fieldPaths=${k}`).join("&");
    const r = await fetch(`${BASE}/${col}/${id}?${mask}&key=${CONFIG.apiKey}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(objToDoc(obj))
    });
    return docToObj(await r.json());
  },
  // DELETE
  async remove(col, id) {
    await fetch(`${BASE}/${col}/${id}?key=${CONFIG.apiKey}`, { method: "DELETE" });
  }
};