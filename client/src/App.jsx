import { Route, Routes } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import OurAuthor from "./pages/Our_Author"
import PublicBlog from "./pages/Public_blog"
import Signin from "./authentication/Signin";
import Signup from "./authentication/Signup";

import ProtectedRoute from './component/ProtectedRoutes'
import Profile from "./pages/user/Profile"
import NewPost from "./pages/user/New_Post"
import Post from "./pages/user/Post"
import Comments from './pages/user/Comments'
import Earnings from './pages/user/Earnings'
import Setting from './pages/user/Setting'
import EditProfile from './pages/user/EditProfile'
import Edit_Post from "./pages/user/Edit_Post";
import ReadPost from "./pages/user/ReadPost";
import Public_Read_More from "./pages/Public_Read_More";


export default function App(){
    return(
        <div>
            <Header/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/about" element={<About/>} />
                <Route path="/public_blog" element={<PublicBlog/>} />
                <Route path="/contact" element={<Contact/>} />
                <Route path="/signin" element={<Signin/>} />
                <Route path="/signup" element={<Signup/>} />
                <Route path="/public_read_more/:id" element={<Public_Read_More/>} />

                 <Route path='/profile' element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                
                        <Route path='/new_post' element={
                          <ProtectedRoute>
                            <NewPost />
                          </ProtectedRoute>
                        } />
                
                        <Route path='/post' element={
                          <ProtectedRoute>
                            <Post />
                          </ProtectedRoute>
                        } />
                
                        <Route path='/comments' element={
                          <ProtectedRoute>
                            <Comments />
                          </ProtectedRoute>
                        } />
                
                        <Route path='/earnings' element={
                          <ProtectedRoute>
                            <Earnings />
                          </ProtectedRoute>
                        } />
                
                        <Route path='/setting' element={
                          <ProtectedRoute>
                            <Setting />
                          </ProtectedRoute>
                        } />
                
                        <Route path='/editProfile' element={
                          <ProtectedRoute>
                            <EditProfile/>
                          </ProtectedRoute>
                        } />

                        <Route path='/editPost/:id' element={
                          <ProtectedRoute>
                            <Edit_Post/>
                          </ProtectedRoute>
                        } />

                        <Route path="/readPost/:id" element={
                          <ProtectedRoute>
                            <ReadPost/>
                          </ProtectedRoute>
                        }/>

                
            </Routes>
        </div>
    )
}