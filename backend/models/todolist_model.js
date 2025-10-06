const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ToDoListSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    task:{
        type:String,
        required:true
    },
    description:{
        type:String,
        default:""
    },
    completed:{
        type:String,
        default:"Not Completed"
    }
},{timestamps:true});

module.exports=mongoose.model("ToDoList",ToDoListSchema);