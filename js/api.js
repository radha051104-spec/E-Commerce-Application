var API = (function ($) {
  'use strict';
  var ROOT = 'https://firestore.googleapis.com/v1/projects/e-commerce-743a1/databases/(default)/documents';

  function toValue(v) {
    if (v === null || v === undefined) return { nullValue: null };
    if (typeof v === 'boolean') return { booleanValue: v };
    if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
    if (Array.isArray(v)) return { arrayValue: { values: v.map(toValue) } };
    if (typeof v === 'object') return { mapValue: { fields: toFields(v) } };
    return { stringValue: String(v) };
  }
  function toFields(o) { var f = {}; Object.keys(o).forEach(function (k) { f[k] = toValue(o[k]); }); return f; }
  function fromValue(v) {
    if ('stringValue' in v) return v.stringValue;
    if ('integerValue' in v) return Number(v.integerValue);
    if ('doubleValue' in v) return v.doubleValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromValue);
    if ('mapValue' in v) return fromFields(v.mapValue.fields || {});
    if ('timestampValue' in v) return v.timestampValue;
    return null;
  }
  function fromFields(f) { var o = {}; Object.keys(f).forEach(function (k) { o[k] = fromValue(f[k]); }); return o; }
  function fromDoc(d) { var o = fromFields(d.fields || {}); o._id = d.name.split('/').pop(); return o; }

  function req(method, url, body) {
    var s = { url: url, type: method, dataType: 'json' };
    if (body) { s.contentType = 'application/json'; s.data = JSON.stringify(body); }
    return $.ajax(s);
  }

  function getAll(col) {
    var d = $.Deferred(), all = [];
    (function page(token) {
      req('GET', ROOT + '/' + col + '?pageSize=300' + (token ? '&pageToken=' + encodeURIComponent(token) : ''))
        .done(function (r) {
          (r.documents || []).forEach(function (x) { all.push(fromDoc(x)); });
          if (r.nextPageToken) page(r.nextPageToken); else d.resolve(all);
        }).fail(function (x) { d.reject(x); });
    })();
    return d.promise();
  }
  function save(col, id, obj) { return req('PATCH', ROOT + '/' + col + '/' + encodeURIComponent(id), { fields: toFields(obj) }); }
  function update(col, id, obj) {
    var mask = Object.keys(obj).map(function (k) { return 'updateMask.fieldPaths=' + encodeURIComponent(k); }).join('&');
    return req('PATCH', ROOT + '/' + col + '/' + encodeURIComponent(id) + '?' + mask, { fields: toFields(obj) });
  }
  function remove(col, id) { return req('DELETE', ROOT + '/' + col + '/' + encodeURIComponent(id)); }
  function getOne(col, id) { return req('GET', ROOT + '/' + col + '/' + encodeURIComponent(id)).then(fromDoc); }
  function nextId(col, prefix) {
    return getAll(col).then(function (list) {
      var max = 0;
      list.forEach(function (i) { var n = parseInt(String(i._id).replace(prefix, ''), 10); if (!isNaN(n) && n > max) max = n; });
      return prefix + String(max + 1).padStart(3, '0');
    });
  }
  function esc(s) {
    return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* Makes an order document look the same, whatever field names it uses */
  function order(o) {
    var raw = o.items || o.products || o.lines || o.cart || [];
    if (typeof raw === 'string') { try { raw = JSON.parse(raw); } catch (e) { raw = []; } }   // items are saved as a JSON string
    var items = (Array.isArray(raw) ? raw : []).map(function (i) {
      return {
        pid: i.product_id || i.productId || i.pid || i.id || '',
        cat: i.cat_id || i.category_id || i.catId || '',
        title: i.title || i.name || '',
        qty: Number(i.qty || i.quantity || 0),
        price: Number(i.price || 0)
      };
    });
    var d = o.date || o.created_at || o.createdAt || o.timestamp || '';
    d = typeof d === 'number' ? new Date(d).toISOString() : String(d);
    var pay = String(o.payment_type || o.payment || o.paymentMode || o.payment_method || 'cash').toLowerCase();
    var total = Number(o.total || o.amount || o.grand_total || items.reduce(function (s, i) { return s + i.qty * i.price; }, 0));
    return {
      id: o._id,
      customer: o.customer_id || o.customerId || o.cust_id || o.uid || o.customer || '',
      date: d.slice(0, 10),
      payment: (pay === 'credit' || pay.indexOf('store credit') > -1) ? 'credit' : 'cash',
      total: total,
      items: items
    };
  }

  return { getAll: getAll, getOne: getOne, save: save, update: update, remove: remove, nextId: nextId, esc: esc, order: order };
})(jQuery);