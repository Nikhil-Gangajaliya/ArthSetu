import dotenv from "dotenv";
import connectDB from "../db/connectDB.js";
import { User } from "../models/user.model.js";

dotenv.config();

await connectDB();

async function createUser(userData) {
    try {
        const user = new User(userData);
        await user.save();

        console.log("User created successfully:", user);
    } catch (error) {
        console.error("Error creating user:", error.message);
    }
}

const newUserData = {
    name: "-----------",
    email: "***********",
    password: ".............."
};

createUser(newUserData);