import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
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
import Home from "./pages/Home/Home";
import Footer from "./components/Footer/Footer";
import Favorites from "./components/Favorites/Favorites";
import PostsPage  from "./pages/Posts/PostsPage";
import PostDetails from "./components/Posts/PostDetails";
import AddPost from "./components/Posts/AddPost";
import EditPost from "./components/Posts/EditPost";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostsPage  />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/post/:id" element={<PostDetails />} /> 
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add_user" element={<AddUser />} />
          <Route path="/edit_user/:id" element={<UpdateUser />} />
          <Route path="/account" element={<Account />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
          

        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
