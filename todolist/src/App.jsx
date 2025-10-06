import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { HashRouter as Router,Route,Routes } from 'react-router-dom'

import Header from './pages/header.jsx'
import Footer from './pages/footer.jsx'

import Login from './user_pages/Login.jsx'
import Signup from './user_pages/Signup.jsx'
import Account from './user_pages/Account.jsx'
import List from './todolist_pages/list.jsx'
import CreateTask from './todolist_pages/CreateTask.jsx'
import EditTask from './todolist_pages/EditTask.jsx'


function App() {
  return (
    // <h1>It is working</h1>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/list" element={<List />} />
        <Route path="/create-task" element={<CreateTask />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
      </Routes>
    </Router>
  );
}

export default App
