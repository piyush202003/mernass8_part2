const express=require('express');
const cors = require('cors');
const dotenv=require('dotenv');
const mongoose=require('mongoose');



const {UserModel, ToDoListModel}=require('./models/index');
const {
    getAllUsers,getUser,getUserById,createUser,updateUser,deleteUser
}=require('./controllers/user_controller');
const {
    getAllToDoLists,getAllToDoListsByUserId,getToDoListById,createToDoList,updateToDoList,deleteToDoList
}=require('./controllers/todolist_controller');

const app=express();
const PORT=8082;

app.use(express.json());
app.use(cors())
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'https://mernass8part2.netlify.app/',
//   credentials: true
// }));
dotenv.config();
const connectDB=require('./databaseConnection');
connectDB();

app.get('/',(req,res)=>{
    res.send('Hello, World!');
});

// APIs for Users
app.get('/users',getAllUsers)
app.post('/login',getUser);
app.get('/users/:id',getUserById);
app.post('/signup',createUser);
app.put('/users/:id',updateUser);
app.delete('/users/:id',deleteUser);




// APIs for ToDoList
app.get('/todolist',getAllToDoLists);
app.get('/todolist/:userId',getAllToDoListsByUserId);
app.get('/todolist/:userId/:taskId',getToDoListById);
app.post('/todolist/:userId',createToDoList);
app.put('/todolist/:userId/:taskId',updateToDoList);
app.delete('/todolist/:userId/:taskId',deleteToDoList);




app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
    console.log(`Database URL: ${process.env.DB_URL}`);
});