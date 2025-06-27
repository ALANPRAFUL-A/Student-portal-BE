import mongoose from 'mongoose';

const JobBoardModel = new mongoose.Schema({
    role : {
        type : String,
        required : true
    },
    company : {
        type : String,
        required : true
    },
    location : {
        type : String,
        required : true
    },
    contact : {
        type : String,
        required : true
    }
})

export default mongoose.model("JobBoard" , JobBoardModel )