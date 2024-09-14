import React from 'react'
import AdminHeader from '../components/admin/AdminHeader'
import Header from '../components/header'
import EditEventForm from '../components/admin/EditEvent'
function EditEventPage() {
  return (
    <div>
        <Header />
        <AdminHeader/>
        <EditEventForm/>
    </div>
  )
}

export default EditEventPage