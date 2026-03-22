import React from 'react'
import { CodeXml } from 'lucide-react'
import { TriangleAlert } from 'lucide-react'
import { Cpu } from 'lucide-react'
import { CircleCheck } from 'lucide-react'
import { Minus } from 'lucide-react'

const How_It_Works = () => {
  return (
    <div className=' flex flex-col items-center justify-between gap-20'>

        <div className='flex flex-col items-center justify-between gap-10 mt-30'>
          <h1 className='font-bold text-5xl tracking-normal'>From error to <span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent'>solution</span> in seconds</h1>
        </div>

        <div>

          <div className=' flex flex-row items-center justify-between w-200'>
            <div className=' bg-gray-900 py-5 px-5 border-2 border-gray-500 rounded-2xl'><CodeXml color="#609ee2" strokeWidth={1.5} /></div>
            <div className=' bg-gray-900 py-5 px-5 border-2 border-gray-500 rounded-2xl'><TriangleAlert color="#609ee2" strokeWidth={1.5} /></div>
            <div className=' bg-gray-900 py-5 px-5 border-2 border-gray-500 rounded-2xl'><Cpu color="#609ee2" strokeWidth={1.5} /></div>
            <div className=' bg-gray-900 py-5 px-5 border-2 border-gray-500 rounded-2xl'><CircleCheck color="#609ee2" strokeWidth={1.5} /></div>
          </div>

          <div className=' ml-10 mr-10 mt-4 '>
            <img src="/public/Line.svg" alt="" className='w-180' />
          </div>

        </div>

        <div className=' -mt-17 flex flex-row items-center justify-between bg-amber- w-230 '>

            <div className=' flex flex-col items-center justify-between'>
              <h1 className=' text-lg tracking-wide font-medium'>Write Code</h1>
              <p className='font-medium text-base text-gray-500'>Developer writes code in VS<br></br><span className=' ml-10'>Code as usual.</span></p>
            </div>
            <div className=' flex flex-col items-center justify-between'>
              <h1 className=' text-lg tracking-wide font-medium'>Error Detected</h1>
              <p className='font-medium text-base text-gray-500'>Extension detects errors in real-<br></br><span className=' ml-25'>time.</span></p>
            </div>
            <div className=' flex flex-col items-center justify-between'>
              <h1 className=' text-lg tracking-wide font-medium'>AI Analyzes</h1>
              <p className='font-medium text-base text-gray-500'>AI processes the issue and<br></br><span className=' ml-12'>finds solutions.</span></p>
            </div>
            <div className=' flex flex-col items-center justify-between'>
              <h1 className=' text-lg tracking-wide font-medium'>Solution Appears</h1>
              <p className='font-medium text-base text-gray-500'>Extension detects errors in real-<br></br><span className=' ml-16'>finds solutions.</span></p>
            </div>
          </div>          
    </div>
  )
}

export default How_It_Works