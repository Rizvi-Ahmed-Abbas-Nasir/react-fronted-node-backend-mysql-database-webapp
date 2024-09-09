import React from 'react'
import AdminHeader from '../components/admin/AdminHeader'
import Header from '../components/header'
import CreateEvent from '../components/admin/CreateEvent'

function createevent() {
  return (
    <div className=' '>
        <Header /> 
        <AdminHeader />
        <CreateEvent />
    </div>
  )
}

export default createevent