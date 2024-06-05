import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body
    console.log("email", email)

    // this is simple if for validation 
    // .
    // .
    // .
    //    if(fullname===""){
    //     throw new ApiError(400, "Fullname is required")
    //    }
    //    if(email===""){
    //     throw new ApiError(400, "email is required")
    //    }
    //    if(usrename===""){
    //     throw new ApiError(400, "usrename is required")
    //    }
    //    if(password===""){
    //     throw new ApiError(400, "password is required")
    //    }

    if (
        [fullname, email, username, password].some((fields) => {
            fields?.trim() === ""
        })
    ) {
        throw new ApiError(400, "All fields are required")
    }
    const exitedUser = User.findOne({ $or: [{ username }, { email }] })

    if (exitedUser) {
        throw new ApiError(409, "User with usrename or email is already present")

    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is Required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar is Required")
    }


    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })


    const userCreated = await User.findById(user._id).select(
    "-password -refreshToken "
    )

    if (!userCreated)
        {
            throw new ApiError (500, "somthing went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(200, userCreated, "User created successfully" )
    )

});


export { registerUser };
