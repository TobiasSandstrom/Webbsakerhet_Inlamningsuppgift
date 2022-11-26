import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './Views/Home'
import UploadPost from './Views/UploadPost'
import Blog from './Views/Blog'
import Profile from './Views/Profile'
import UploadPictures from './Views/UploadPictures'



const App = () => {
  return (
    <>
    <Navbar/>
    <div className='container'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/post' element={<UploadPost />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/upload-pictures' element={<UploadPictures />} />




        </Routes>
      </div>
    </>
  )
}

export default App