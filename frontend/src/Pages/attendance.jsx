import React from 'react'
import AdminHeader from '../components/admin/AdminHeader'
import Header from '../components/header'
import AttendanceTable from '../components/admin/AttendanceTable'

function Attendance() {
  return (
    <div className='w-full h-[100vh]'>
        <Header />
        <AdminHeader/>
        <AttendanceTable/>
    </div>
  )
}

export default Attendance