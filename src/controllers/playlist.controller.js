import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body

    if(!name || !description){
        throw new ApiError(400,"name and description are required")
    }
    const playlist = await Playlist.create({
        name,
        description,
        owner:req.user._id,
        videos:[]
    })
    return res.status(201).json(new ApiResponse(201, playlist, "Playlist created successfully"))
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const playlists =await Playlist.find({owner:userId})
    return res.status(200).json(new ApiResponse(200, playlists, "User playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId).populate("videos")
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    console.log("playlistId:", playlistId)
    console.log("videoId:", videoId)
    
     const allPlaylists = await Playlist.find()
    console.log("All playlists in DB:", allPlaylists.map(p => p._id.toString()))

    const playlist = await Playlist.findById(playlistId)
    console.log("Found playlist:", playlist)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(playlist.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403,"you are not authorized to update this playlist")
    }
    if(playlist.videos.includes(videoId)){
        throw new ApiError(400,"video already exists in the playlist")
    }
    playlist.videos.push(videoId)
    await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(playlist.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403,"you are not authorized to update this playlist")
    }
    if(!playlist.videos.includes(videoId)){
        throw new ApiError(400,"video not found in the playlist")
    }
   playlist.videos = playlist.videos.filter(
    (v)=> v.toString() !== videoId
   )
    await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(playlist.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403,"you are not authorized to update this playlist")
    }
    await Playlist.findByIdAndDelete(playlistId)
    return res.status(200).json(new ApiResponse(200, {}, "Playlist deleted successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    if(!name || !description){
        throw new ApiError(400,"name and description are required")
    }
    const playlist = await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }
    if(playlist.owner.toString()!== req.user._id.toString()){
        throw new ApiError(403,"you are not authorized to update this playlist")
    }
    
    playlist.name =name
    playlist.description = description
    await playlist.save()
    return res.status(200).json(new ApiResponse(200, playlist, "Playlist updated successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}