import React from 'react'
import Terminal from '../components/Terminal'
import {MessageSquareWarning} from 'lucide-react'
import {Lightbulb} from 'lucide-react'
import { ChartLine } from 'lucide-react'
import { GraduationCap } from 'lucide-react'
import Navbar from '../components/Navbar'



const Features = () => {
  return (

      <div className=' flex flex-col items-center justify-between gap-20 w-[100%]'>

      <div className=' flex flex-col items-center justify-between gap-5 mt-30'>
        <div>
          <h1 className='font-bold text-5xl tracking-normal'>Everything you need to <span className='bg-gradient-to-r from-blue-500 to-fuchsia-400 bg-clip-text text-transparent'>code smarter</span></h1>
        </div>
        <div>
          <p className='font-medium text-lg text-gray-300 tracking-wide'>A complete toolkit that transforms how you debug, learn, and improve as a<br></br><span className='px-65'>developer.</span></p>
        </div>
      </div>

      <div className=' flex flex-col items-center justify-between gap-5 px-6 py-3'>

        <div className=' flex flex-row items-center justify-between gap-6'>

          <div className='rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl px-8 py-7 flex flex-col items-start justify-between gap-5 w-145'>
            <div className=' flex items-center justify-center h-10 w-10 rounded-xl mb-3'><MessageSquareWarning color="#609ee2" /></div>
            <h1 className=' text-2xl font-semibold mb-3'>AI Error Explanation</h1>
            <p className='font-medium text-sm text-gray-300 tracking-wide mb-3'>Explains terminal errors and runtime errors in simple, plain-English <br></br>language. No more deciphering cryptic stack traces.</p>  
          </div>

          <div className=' rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl px-8 py-8 flex flex-col items-start justify-between gap-3 w-145'>
            <div className=' flex items-center justify-center h-10 w-10 rounded-xl mb-3'><Lightbulb color="#609ee2" /></div>
            <h1 className=' text-2xl font-semibold b-3'>Smart Code Suggestions</h1>
            <p className='font-medium text-sm text-gray-300 tracking-wide m-3'>AI analyzes your code patterns and suggests better practices, <br></br>refactors, and architectural improvements.</p>  
          </div>
        </div>

        <div className=' flex flex-row items-center justify-between gap-6'>

          <div className=' rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl px-8 py-8 flex flex-col items-start justify-between gap-3 w-145'>
           <div className=' flex items-center justify-center h-10 w-10 rounded-xl m-3'><ChartLine color="#609ee2" /></div>
            <h1 className=' text-2xl font-semibold m-3'>Developer Analytics</h1>
            <p className='font-medium text-sm text-gray-300 tracking-wide m-3'>Track coding mistakes, improvements, and your overall code <br></br>quality score over time..</p>  
          </div>

          <div className=' rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl px-8 py-8 flex flex-col items-start justify-between gap-3 w-145'>
            
            <div className=' flex items-center justify-center h-10 w-10 rounded-xl m-3'><GraduationCap color="#609ee2" /></div>
            <h1 className=' text-2xl font-semibold m-3'>Learning Dashboard</h1>
            <p className='font-medium text-sm text-gray-300 tracking-wide m-3'>View personal coding insights, improvement history, and topics<br></br>mastered like Async/Await or Memory Management.</p>
          </div>
        </div>

      </div>
      
    </div>
  )
}

export default Features