import request from '../utils/request'

export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<any, any>('/api/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
