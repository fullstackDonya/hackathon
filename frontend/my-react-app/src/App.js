import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store"; 
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";

import Users from "./Components/Users/Users";
import AddUser from "./Components/Users/AddUser";
import UpdateUser from "./Components/Users/UpdateUser";
import Navbar from "./Components/Navbar/Navbar"; 
import Logout from "./Components/Logout/Logout";

import Footer from "./Components/Footer/Footer";

import Posts from "./Components/Posts/Posts";
import PostDetails from "./Components/Posts/PostDetails";

function App() {
  
  return (

    <Provider store={store}>
      <div className="App">
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
  
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </Provider>
  );
}
export default App;