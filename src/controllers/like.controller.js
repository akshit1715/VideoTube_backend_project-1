import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const existingLike =await Like.findOne({
        video:videoId,
        likedBy:req.user._id

    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200,"video unliked successfully",null))
    }
    await Like.create({
        video:videoId,
        likedBy:req.user._id
    })
    return res.status(200).json(new ApiResponse(200,"video liked successfully",null))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    
const existingLike = await Like.findOne({
    comment:commentId,
    likedBy:req.user._id
})
if(existingLike){
    await Like.findByIdAndDelete(existingLike._id)
    return res.status(200).json(new ApiResponse(200,"comment unliked successfully",null))
}
await Like.create({
    comment:commentId,
    likedBy:req.user._id
})
return res.status(200).json(new ApiResponse(200,"comment liked successfully",null))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const existingLike = await Like.findOne({
        tweet:tweetId,
        likedBy:req.user._id
    })
    if(existingLike){
        await Like.findByIdAndDelete(existingLike._id)
        return res.status(200).json(new ApiResponse(200,"tweet unliked successfully",null))
    }
    await Like.create({
        tweet:tweetId,
        likedBy:req.user._id
    })
    return res.status(200).json(new ApiResponse(200,"tweet liked successfully",null))
})

const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(req.user._id),
                video:{$exists:true}
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
                pipeline:[
                    {$project:{
                        title:1,
                        thumbnail:1,
                        duration:1,
                    views:1
                    }}
                ]
            }
        },
        {$unwind:"$video"}
    ])
    return res.status(200).json(new ApiResponse(200,"liked videos fetched successfully", likedVideos))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}