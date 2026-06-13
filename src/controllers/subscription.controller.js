import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const existingSubscription = await Subscription.findOne({
        subscriber:req.user._id,
        channel:channelId
    })
    if(existingSubscription){
        await Subscription.findByIdAndDelete(existingSubscription._id)
        return res.status(200).json(new ApiResponse(200,"unsubscribed successfully",null))
    }
    await Subscription.create({
        subscriber:req.user._id,
        channel:channelId
    })
    return res.status(200).json(new ApiResponse(200,"subscribed successfully",null))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscribers = await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
                pipeline:[
                    { $project:{
                        fullName:1,
                        avatar:1,
                        username:1}}
                ]
            }
        },
        { $unwind:"$subscriber"}
        
    ])
    return res.status(200).json(new ApiResponse(200, "subscribers fetched successfully", subscribers))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channels = await Subscription.aggregate([
        {
            $match:{subscriber:new mongoose.Types.ObjectId(subscriberId)}
        },{
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"channel",
                pipeline:[
                    { $project:{
                        fullName:1,
                        avatar:1,
                        username:1}}
                ]
            }
        },
        { $unwind:"$channel"}
    ])
    return res.status(200).json(new ApiResponse(200, channels,"subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}