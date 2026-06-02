import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const pipeline = []

    if(userId){
        pipeline.push({
            $match:{
                owner:newmongoose.Types.ObjectId(userId)
            }
        })
    }
    if(query){
        pipeline.push({
            $match:{
                $or:[
                    {title:{$regex:query,$options:"i"}},
                    {description:{$regex:query,$options:"i"}}
                ]

            }
        })
    }
    pipeline.push({
        $sort:{[sortBy]: sortType === "desc"? -1 : 1}
    })
    pipeline.push({

        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:"owner",
            pipeline:[
                {$project:{fullName:1,username:1,avatar:1}}
            ]
        }
    })
    pipeline.push({$unwind:"$owner"})

    const options={
        page: parseInt(page),
        limit: parseInt(limit)
    }
    const videos = await Video.aggregatePaginate(Video.aggregate(pipeline), options)
    return res.status(200).json(new ApiResponse(200,"videos fetched successfully",videos))

})




const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    if(!title || !description){
        throw new ApiError(400,"title and description are required")
    }
    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!videoLocalPath){
        throw new ApiError(400,"video file is required")
    }
    if(!thumbnailLocalPath){
        throw new ApiError(400,"thumbnail is required")
    }
    const videoFile = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoFile){
        throw new ApiError(400,"video upload failed")
    }
    if(!thumbnail){
        throw new ApiError(400,"thumbnail upload failed")
    }
    const video = await Video.create({
        title,
        description,
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201,"video published successfully",video))

})



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            fullName:1,
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        { $unwind:"$owner"}
    
    ])
    if(!video?.length){
        throw new ApiError(404,"video not found")
    }
    await Video.findByIdAndUpdate(videoId,{$inc:{views:1}})
    return res.status(200).json(new ApiResponse(200,"video fetched successfully",video[0]))
    
})



const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description} = req.body
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"you can only update your own video")
    }
    let thumbnailURL = video.thumbnail
    if(req.file?.path){
        const thumbnail = await uploadOnCloudinary(req.file.path)
        if(!thumbnail){
            throw new ApiError(400,"thumbnail upload failed")
        }
        thumbnailURL = thumbnail.url
    }
    video.title = title || video.title
    video.description = description || video.description
    video.thumbnail = thumbnailURL

    await video.save()
    return res.status(200).json(new ApiResponse(200,"video updated successfully",video))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"you can only delete your own video")
    }
    await Video.findByIdAndDelete(videoId)
    return res.status(200).json(new ApiResponse(200,null,"video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(video.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"you can only toggle publish status of your own video")
    }
    video.isPublished = !video.isPublished
    await video.save()
    return res.status(200).json(new ApiResponse(200, video, `Video ${video.isPublished ? "published" : "unpublished"} successfully`))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}