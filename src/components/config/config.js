import instance from "./interceptor";

export function get(endpoint, params = {}){
  return instance.get(endpoint, params);
}

export function post(endpoint, params = {}, config){
  return instance.post(endpoint, params, config);
}

export function del(endpoint, config){
  return instance.delete(endpoint, config);
}

export function put(endpoint, params = {}, config) {
  return instance.put(endpoint, params, config);
}

export function patch(endpoint, params = {}, config) {
  return instance.patch(endpoint, params, config);
}

export const api = {
  BASE:'/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CATEGORIES: '/categories',
  PRODUCTS: '/products'
}
