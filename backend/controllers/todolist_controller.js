const {UserModel, ToDoListModel}=require('../models/index');

exports.getAllToDoLists=async(req,res)=>{
    const tasks = await ToDoListModel.find();
    if (tasks.length === 0) {
        return res.status(404).json({ 
            success: false,
            message: 'No tasks found' 
        });
    }
    res.status(200).json({
        success: true,
        data: tasks
    });
}

exports.getAllToDoListsByUserId=async(req,res)=>{
    const { userId } = req.params;
    const userTasks = await ToDoListModel.find({ userId: userId });
    if (userTasks.length === 0) {
        return res.status(404).json({ 
            success: false,
            message: `No tasks found for user id: ${userId}` 
        });
    }
    res.status(200).json({
        success: true,
        data: userTasks
    });
}

exports.getToDoListById=async(req,res)=>{
    const { userId, taskId } = req.params;
    const task = await ToDoListModel.findOne({ userId: userId, _id: taskId });
    if (task) {
        return res.status(200).json({
            success: true,
            data: task
        });
    }
    res.status(404).json({
        success: false,
        message: `No task found for user id: ${userId} and task id: ${taskId}`
    });
}

exports.createToDoList=async(req,res)=>{
    const { userId } = req.params;
    const { data } = req.body;

    const userTasks = await ToDoListModel.find({ userId: userId });
    if (!userTasks) {
        return res.status(404).json({
            success: false,
            message: `No user found with id: ${userId}`
        });
    }

    if (!data) {
        return res.status(400).json({
            success: false,
            message: 'Task is required'
        });
    }
    const taskExists = userTasks.find((each) => each.task === data.task);
    if (taskExists) {
        return res.status(409).json({
            success: false,
            message: `Task already exists:${data.task} with Task: ${taskExists.task}`
        });
    }
    const newTask = new ToDoListModel({
        userId: userId,
        task: data.task,
        description: data.description || '',
        completed: 'Not Completed',
        timestamp: new Date()
    });
    await newTask.save();
    
    const updatedList = await ToDoListModel.find({ userId: userId });
    res.status(201).json({
        success: true,
        data: updatedList
    });
}

exports.updateToDoList=async(req,res)=>{
    const { userId, taskId } = req.params;
    const { data } = req.body;

    const task = await ToDoListModel.findOne({ userId: userId, _id: taskId });
    if (!task) {
        return res.status(404).json({
            success: false,
            message: `No task found for user id: ${userId} and task id: ${taskId}`
        });
    }
    const taskExists = await ToDoListModel.findOne({ userId: userId, task: data.task });
    if (taskExists && taskExists._id.toString() !== taskId) {
        return res.status(409).json({
            success: false,
            message: `Task already exists: ${data.task} with Task: ${taskExists.task}`
        });
    }
    task.task = data.task || task.task;
    task.description = data.description || task.description;
    
    task.completed = data.completed || task.completed;
    await task.save();
    const updatedList = await ToDoListModel.find({ userId: userId });
    res.status(200).json({
        success: true,
        data: updatedList
    });
}

exports.deleteToDoList=async(req,res)=>{
    const { userId, taskId } = req.params;
    const task = await ToDoListModel.findOne({ userId: userId, _id: taskId });
    if (!task) {
        return res.status(404).json({
            success: false,
            message: `No task found for user id: ${userId} and task id: ${taskId}`
        });
    }
    await ToDoListModel.deleteOne({ userId: userId, _id: taskId });
    const updatedList = await ToDoListModel.find({ userId: userId });
    res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: updatedList
    });
}
