import api from "./axios.js"

export const createPlaylist = (data) => api.post("/playlists", data)
export const getUserPlaylists = (userId) => api.get(`/playlists/user/${userId}`)
export const getPlaylistById = (playlistId) => api.get(`/playlists/${playlistId}`)
export const addVideoToPlaylist = (videoId, playlistId) => api.patch(`/playlists/add/${videoId}/${playlistId}`)
export const removeVideoFromPlaylist = (videoId, playlistId) => api.patch(`/playlists/remove/${videoId}/${playlistId}`)
export const deletePlaylist = (playlistId) => api.delete(`/playlists/${playlistId}`)