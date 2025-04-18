import React from 'react'
import Usermenu from '../components/Usermenu'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (

   <section className='bg-white'>
       <div className='container mx-auto p-3 grid lg:grid-cols-2'>
        
            {/* left part */}
            <div className='py-3 sticky top-30 overflow-y-auto hidden lg:block border-r'>
                  <Usermenu/>
            </div>
        

            {/* right part */}  
            <div className='bg-white min-h-[75vh]'>
                 <Outlet/>
            </div>
        
       </div>
   </section>
  )
}

export default Dashboard