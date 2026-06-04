import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id

    const totalSubscribers = await Subscription.countDocuments({
        channel:userId
    })
    const videoStats = await Video.aggregate([
        {
            $match:{ owner: new mongoose.Types.ObjectId(userId)}
        },
        {
            $group:{
                _id:null,
                totalViews:{$sum:"$views"},
                totalVideos:{$sum:1}
            }
        }
    ])
    const totalLikes = await Like.countDocuments({
        video:{$in: await Video.find({owner:userId}).distinct("_id")}
    })
    const stats ={
        totalSubscribers,
        totalViews: videoStats[0]?.totalViews || 0,
        totalVideos: videoStats[0]?.totalVideos || 0,
        totalLikes
    }
    return res.status(200).json(new ApiResponse(200,"channel stats fetched successfully",stats))
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const getChannelVideos = asyncHandler(async (req, res) => {
    const videos = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $addFields: {
                likesCount: { $size: "$likes" }
            }
        },
        {
            $project: {
                title: 1,
                thumbnail: 1,
                views: 1,
                isPublished: 1,
                createdAt: 1,
                likesCount: 1
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200, videos, "Channel videos fetched successfully"))
})
})

export {
    getChannelStats, 
    getChannelVideos
    }