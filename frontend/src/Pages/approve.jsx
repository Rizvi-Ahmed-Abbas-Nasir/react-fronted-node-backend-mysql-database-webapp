import React from 'react'
import Header from '../components/header'
import AdminHeader from '../components/admin/AdminHeader'
import ApproveCode from '../components/admin/approveCode'
function Approve() {
  return (
    <div className='w-full h-[100vh]'>
        <Header />
        <AdminHeader/>
        <ApproveCode/>
    </div>
  )
}

export default Approve