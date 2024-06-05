import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from "fs";

const registerUser = asyncHandler(async (req, res) => {
    const { fullname, email, username, password } = req.body;

    // Validation
    if ([fullname, email, username, password].some((fields) => fields?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const exitedUser = await User.findOne({ $or: [{ username }, { email }] });

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (exitedUser) {
        if (avatarLocalPath) fs.unlinkSync(avatarLocalPath);
        if (coverImageLocalPath) fs.unlinkSync(coverImageLocalPath);
        throw new ApiError(409, "User with username or email already exists");
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar upload failed");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    });

    const userCreated = await User.findById(user._id).select("-password -refreshToken");

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res.status(201).json(new ApiResponse(201, userCreated, "User created successfully"));
});

export { registerUser };
