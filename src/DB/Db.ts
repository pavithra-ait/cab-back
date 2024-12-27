import mongoose from "mongoose";

function connectdb() {
    mongoose.connect('mongodb://127.0.0.1:27017/cabbooking')
        .then(() => {
            console.log("Mongodb connected");

        })
        .catch(()=>{
            console.log("Mongodb connection error");
        })
}

export default connectdb;