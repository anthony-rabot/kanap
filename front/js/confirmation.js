/**
 * Get order_id argument in URL and display it to span #orderId
 */

const params = (new URL(document.location)).searchParams
let orderId = params.get('order_id')
document.getElementById('orderId').textContent = orderId
