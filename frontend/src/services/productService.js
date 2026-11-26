import { apiRequest } from '../api'

export const getProducts = (params = {}) => {
  const query = new URLSearchParams(params).toString()
  return apiRequest('/products' + (query ? '?' + query : ''))
}
