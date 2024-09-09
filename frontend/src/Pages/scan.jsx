import React from 'react'
import Header from '../components/header'
import AdminHeader from '../components/admin/AdminHeader'
import EventScan from '../components/admin/eventScan'
function Scan() {
  return (
    <div className='w-full h-[100vh]'>
        <Header />
        <AdminHeader/>
        <EventScan/>
    </div>
  )
}

export default Scan