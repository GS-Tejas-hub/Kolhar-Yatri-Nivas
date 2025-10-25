import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Layout'
import Home from './Pages/Home'
import Lodges from './Pages/Lodges'
import LodgeDetail from './Pages/LodgeDetail'
import About from './Pages/About'
import Contact from './Pages/Contact'
import Checkout from './Pages/Checkout'
import BookingConfirmation from './Pages/BookingConfirmation'
import AdminDashboard from './Pages/AdminDashboard'
import ManageLodges from './Pages/ManageLodges'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Lodges" element={<Lodges />} />
        <Route path="/LodgeDetail" element={<LodgeDetail />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Checkout" element={<Checkout />} />
        <Route path="/BookingConfirmation" element={<BookingConfirmation />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ManageLodges" element={<ManageLodges />} />
      </Routes>
    </Layout>
  )
}


