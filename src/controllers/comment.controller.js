import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

//get videoId from req.params
//get page and limit from req.query for pagination
//along with each comment also show who wrote it and avvatr
//filter only comment that belongs to this vvideo
//return the comments in the response
const getVideoComments = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query
    const aggregate = Comment.aggregate([
        {
            //filter only comment that belongs to this video
            //videoid comes as a url so convert it into the objectid first
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",//go to user collection
                localField:"owner",//comment's owner field
                foreignField:"_id",//match with user._id
                as:"owner",//store result as owner
                pipeline:[
                    { $project:{
                        fullName:1,
                        avatar:1,
                        username:1
                    }}
                ]
            }
        },
        { $unwind:"$owner"}//as look up return owner as an array[] unwind converts lookup and removes array and return object directly
    ])
    const options={
        page: parseInt(page),//which page to return
        limit: parseInt(limit)//number of comments per page
    }

    const comments = await Comment.aggregatePaginate(aggregate, options)
    return res.status(200).json(new ApiResponse(200,"comments fetched successfully", comments))
})
//get videoId from req.params
//get content from req.body
//validate videoId and content
//get logged in user from req.user
//create a new comment document in the database with the videoId, content, and return it in the response
const addComment = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    const {content} = req.body
    if(!content?.trim()){
        throw new ApiError(400,"Comment content is missing")
    }
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })
    return res.status(201).json(new ApiResponse(201,"comment added successfully", comment))
})
//get commentId from req.params
//get content from req.body
//validate commentId and content
//get logged in user from req.user
//find the comment by commentId and update its content if the logged in user is the owner of the comment, return the updated comment in the response
const updateComment = asyncHandler(async (req, res) => {
    const{commentId}=req.params
    const{content}=req.body
    if(!content?.trim()){
        throw new ApiError(400,"comment content is required")

    }
        const comment=await Comment.findById(commentId)
        if(!comment){
            throw new ApiError(404,"comment not found")
        }
        if(comment.owner.toString() !== req.user._id.toString()){
            throw new ApiError(403,"you are not authorized to update this comment")

        }
        comment.content=content
        await comment.save()
        return res.status(200).json(new ApiResponse(200,"comment updated successfully",comment))

    
})

//get commentId from req.params
//validate commentId
//get logged in user from req.user
//find the comment by commentId and delete it if the logged in user is the owner of the comment, return a success message in the response
const deleteComment = asyncHandler(async (req, res) => {
    const{commentId}=req.params
    const comment =await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,"comment not found")
    }
    if(comment.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403,"you are not authorized to delete this comment")
    }
    await Comment.findByIdAndDelete(commentId)
    return res.status(200).json(new ApiResponse(200,"comment deleted successfully",null))
        
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }