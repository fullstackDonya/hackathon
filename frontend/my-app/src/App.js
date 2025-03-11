import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; 
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Account from "./components/Users/Account";
import Users from "./components/Users/Users";
import AddUser from "./components/Users/AddUser";
import UpdateUser from "./components/Users/UpdateUser";
import Navbar from "./components/Navbar/Navbar"; 
import Logout from "./components/Logout/Logout";

import Footer from "./components/Footer/Footer";

import Posts from "./components/Posts/Posts";
import PostDetails from "./components/Posts/PostDetails";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          <Route path="/posts" element={<Posts />} />
          <Route path="/post/:id" element={<PostDetails />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add_user" element={<AddUser />} />
          <Route path="/edit_user/:id" element={<UpdateUser />} />
          <Route path="/account" element={<Account />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
