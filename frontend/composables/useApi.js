export const useApi = () => {
  const config = useRuntimeConfig()
  
  const apiBase = config.public.apiBase || 'http://localhost:3001'
  
  const get = async (endpoint) => {
    try {
      return await $fetch(`${apiBase}${endpoint}`)
    } catch (error) {
      console.error(`Error en GET ${endpoint}:`, error)
      throw error
    }
  }
  
  const post = async (endpoint, data) => {
    try {
      return await $fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        body: data
      })
    } catch (error) {
      console.error(`Error en POST ${endpoint}:`, error)
      throw error
    }
  }
  
  const put = async (endpoint, data) => {
    try {
      return await $fetch(`${apiBase}${endpoint}`, {
        method: 'PUT',
        body: data
      })
    } catch (error) {
      console.error(`Error en PUT ${endpoint}:`, error)
      throw error
    }
  }
  
  const del = async (endpoint) => {
    try {
      return await $fetch(`${apiBase}${endpoint}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error(`Error en DELETE ${endpoint}:`, error)
      throw error
    }
  }
  
  return {
    get,
    post,
    put,
    del,
    apiBase
  }
}
