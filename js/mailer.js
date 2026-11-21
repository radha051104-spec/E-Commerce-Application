var Mailer = (function () {
  var CFG = { service: 'service_xxxxxxx', template: 'template_xxxxxxx', key: 'YOUR_PUBLIC_KEY' };

  // order = { orderId, total, payment, items: [{ title, qty, price }] }
  function sendOrder(order) {
    var text = order.items.map(function (i) {
      return '- ' + i.title + ' x ' + i.qty + ' = ' + (i.qty * i.price);
    }).join('\n');

    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: CFG.service,
        template_id: CFG.template,
        user_id: CFG.key,
        template_params: {
          to_email: SESSION.email,
          to_name: SESSION.name,
          order_id: order.orderId,
          items_text: text,
          payment: order.payment,
          total: order.total
        }
      })
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }
  return { sendOrder: sendOrder };
})();