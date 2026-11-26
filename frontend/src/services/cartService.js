import { apiRequest } from '../api'

export const getCart = () => apiRequest('/cart')
export const addToCart = (productId, quantity = 1) => apiRequest('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity }) })
export const updateCartItem = (productId, quantity) => apiRequest('/cart', { method: 'PUT', body: JSON.stringify({ productId, quantity }) })
export const removeFromCart = (productId) => apiRequest('/cart/' + productId, { method: 'DELETE' })

export async function syncGuestCart(token) {
  const guestCart = JSON.parse(localStorage.getItem('exclusive-cart') || '[]')
  for (const item of guestCart) {
    await apiRequest('/cart', { method: 'POST', token, body: JSON.stringify({ productId: item.id, quantity: item.quantity }) })
  }
  localStorage.removeItem('exclusive-cart')
}
