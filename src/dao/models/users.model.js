import mongoose from "mongoose";

const userCollection = "users"

const userSchema = new mongoose.Schema({

    first_name: String,
    last_name: String,
    email: String,
    age: Number,
    rol: {
            type: String,
            enum:['user','admin']
        },
    password: String
})

mongoose.set('strictQuery', false)
const userModel = mongoose.model(userCollection, userSchema)

export default userModel