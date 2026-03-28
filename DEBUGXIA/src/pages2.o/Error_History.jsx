import React from 'react'
import { Search } from 'lucide-react'

const History = () => {
  return (
    <div className=' flex flex-col justify-between ml-20 mt-10 gap-8 w-screen'>

        <div className=' flex flex-col items-start justify-between gap-2 mt-3 ml-5'>
            <div className=''>
                <h1 className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-wide font-bold text-4xl'>Error History</h1>
            </div>
            <div>
                <p className='font-medium text-lg text-gray-300 tracking-wide'>Browse and manage your coding errors with AI insights.</p>
            </div>
        </div>

        <div>

          <div className=' flex flex-row items-start justify-between gap-5 w-full'>

            <div className=' w-2/3'>
              <search className=' flex flex-row items-start gap-1 w-full  border-1 border-gray-400 rounded-xl bg-gray-900 px-5 py-2 '>
                <div><Search color="#c0bec1" strokeWidth={0.75} /></div>
                <div>
                  <form>
                  <input name="fsrch" id="fsrch" placeholder="Search Error . . ."/>
                </form>
                </div>
              </search>
            </div>

            <div className=' flex flex-row items-start justify-between gap-2 w-1/3'>
              
            </div>

          </div>

        </div>

    </div>
  )
}

export default History