import api from "./axios.js"

export const getVideoComments = (videoId, params) => api.get(`/comments/${videoId}`, { params })
export const addComment = (videoId, data) => api.post(`/comments/${videoId}`, data)
export const deleteComment = (commentId) => api.delete(`/comments/c/${commentId}`)