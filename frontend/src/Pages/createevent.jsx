import React from 'react'
import AdminHeader from '../components/AdminHeader'
import Header from '../components/header'
import CreateEvent from '../components/CreateEvent'

function createevent() {
  return (
    <div>
      <Header /> 
    <div className='flex w-full justify-start items-center'>
    <AdminHeader />
      <div className='flex w-[85%] justify-center items-center h-[80vh] '>
        <CreateEvent />
      </div>
      </div>


    </div>
  )
}

export default createevent