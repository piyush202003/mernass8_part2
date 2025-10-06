const {UserModel, ToDoListModel} = require('../models/index');

exports.getAllUsers=async(req,res)=>{
    const users = await UserModel.find();
    if (users.length === 0) {
        return res.status(404).json({ 
            success: false,
            message: 'No users found' 
        });
    }
    res.status(200).json({
        success: true,
        data: users
    }); 
}

exports.getUser=async(req,res)=>{
    const { email,password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password required' 
        });
    }
    
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({ 
            success: false, 
            message: 'This Email is not Available' 
        });
    }
    if (user.password !== password) {
        return res.status(401).json({ 
            success: false, 
            message: 'Wrong Password' 
        });
    }
    const safeUser = { id: user._id, name: user.name, email: user.email };
    return res.status(200).json({ 
        success: true, 
        data: safeUser, 
        message: 'Login successful' 
    });
    
}

exports.getUserById=async(req,res)=>{
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No user found account with id: ${id}`
            });
        }
        const safeUser = { id: user._id, name: user.name, email: user.email, password: user.password };
        return res.status(200).json({
            success: true,
            data: safeUser
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

exports.createUser=async(req,res)=>{
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email and password are required'
        });
    }
    const userExists = await UserModel.findOne({ email: email });
    if (userExists) {
        return res.status(409).json({
            success: false,
            message: `User already exists with email: ${email}`
        });
    }
    const newUser = new UserModel({
        name: fullName,
        email,
        password
    });
    await newUser.save();
    res.status(201).json({
        success: true,
        data: newUser,
        message: 'User created successfully'
    });
}

exports.updateUser=async(req,res)=>{
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No user found with id: ${id}`
            });
        }
        const existEmail = await UserModel.find({ email: email });
        if (existEmail && existEmail._id && existEmail._id.toString() !== id) {
            return res.status(409).json({
                success: false,
                message: `Email already in use: ${email}`
            });
        }
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;
        await user.save();
        const safeUser = { id: user._id, name: user.name, email: user.email, password: user.password };
        return res.status(200).json({
            success: true,
            data: safeUser,
            message: 'User updated successfully'
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}


exports.deleteUser=async(req,res)=>{
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        const userTasks = await ToDoListModel.find({ userId: id });
        if (userTasks && userTasks.length > 0) {
            await ToDoListModel.deleteMany({ userId: id });
        }
        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No user found with id: ${id}`
            });
        }
        await UserModel.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: `User deleted with id: ${id}`
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}