import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
const createTweet = asyncHandler(async (req, res) => {
    const {content} = req.body
    if(!content){
        throw new ApiError(400,"content is required")
    }
    const tweet = await Tweet.create({
        content,
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201,"tweet created successfully",tweet))
})
const getUserTweets = asyncHandler(async (req, res) => {
    const{userId} = req.params

    const tweets= await Tweet.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        { $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
                {$project:{
                    fullName:1,
                    username:1,
                    avatar:1
                }}
            ]
        }},
        { $unwind:"$owner" }
    ])
    return res.status(200).json(new ApiResponse(200,"user tweets fetched successfully",tweets))
})
const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const {content} = req.body
    if(!content?.trim()){
        throw new ApiError(400,"content is required")
    }
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }
    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"you are not allowed to update this tweet")
    }
    tweet.content = content
    await tweet.save()
    return res.status(200).json(new ApiResponse(200,"tweet updated successfully",tweet))
})
const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId}= req.params
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }
    if(tweet.owner.toString()!==req.user._id.toString()){
        throw new ApiError(403,"you are not allowed to delete this tweet")
    }
    await tweet.findByIdAndDelete(tweetId)
    return res.status(200).json(new ApiResponse(200,"tweet deleted successfully",null))
})
export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}