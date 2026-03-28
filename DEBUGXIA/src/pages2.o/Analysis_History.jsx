import React from 'react'
import { Zap } from 'lucide-react'
import {ChartNoAxesCombined} from 'lucide-react'
import { FileText } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { CodeXml } from 'lucide-react'


const Analysis_History = () => {

  const Analysis = [
    { Title: "Total Analyses", Num: "12", Logo: <Zap color="#b335ed" strokeWidth={1.25} /> },
    { Title: "Avg Quality", Num: "77%", Logo: <ChartNoAxesCombined color="#4fe388" strokeWidth={1.25} /> },
    { Title: "Files Improved", Num: "9", Logo: <FileText color="#6985f7" strokeWidth={1.25} /> },
    { Title: "Time Saved", Num: "450m", Logo: <CalendarDays color="#69f781" strokeWidth={1.25} /> },
  ];

  return (
    <div className='flex flex-col justify-between ml-10 mt-10 gap-8 w-full px-10'>

      <div className='flex flex-col items-start gap-2 mt-3 ml-5'>
        <h1 className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent font-bold text-4xl'>
          Analysis History
        </h1>
        <p className='font-medium text-lg text-gray-300'>
          Track all your code analyses and improvements.
        </p>
      </div>

      <div className='flex flex-row items-center justify-between gap-15 mr-20  px-5 bg-green '>

        {Analysis.map((item, idx) => (
          <div
            key={idx}
            className='flex flex-row items-center gap-8 bg-gray-900 border border-gray-400 rounded-xl px-4 p-4 
            hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg 
            transition-all duration-300 w-1/4'
          >
            <div>{item.Logo}</div>

            <div className='flex flex-col'>
              <h3 className='text-gray-300 text-sm tracking-wide'>{item.Title}</h3>
              <h1 className='text-white text-2xl font-semibold tracking-wide'>{item.Num}</h1>
            </div>
          </div>
        ))}

      </div>

      <div className='flex flex-col items-start gap-8 bg-gray-900 border border-gray-400 rounded-xl px-4 p-4 
            hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg 
            transition-all duration-300 h-1/4 mr-20'>

        <div className=' flex flex-col items-center justify-between gap-5'>
          <h1 className=' font-bold text-xl tracking-wide'>Recent Analyses</h1>
        </div>

        <div className='flex flex-col items-start gap-3 bg-gray-900 border border-gray-400 rounded-xl px-4 p-4 
            hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg 
            transition-all duration-300 w-full '>

          <div className=' flex flex-row items-center justify-between gap-3'>
            <div><CodeXml color="#607ceb" strokeWidth={1} /></div>
            <div><h3 className=' font-bold text-lg tracking-wide text-gray-300'>App.tsx</h3></div>
            <div><p className='font-normal text-sm tracking-wide text-gray-400 bg-gray-600 border-0 rounded-lg px-2.5 py-0.5'>TypeScript</p></div>
          </div>

          <div className=' flex flex-row items-start justify-between gap-1'>
            <div><CalendarDays color="#8a8a8a" strokeWidth={0.75} /></div>
            <div><p className=' font-normal text-sm tracking-wide text-gray-600'>2 hours ago</p></div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-2 w-full'>
            <div className=' flex flex-col items-center justify-between gap-0.5 bg-red-900 border-0 rounded-xl w-1/3'>
              <div><h1 className=' font-medium text-lg text-red-300'>Error</h1></div>
              <div><h1 className=' font-bold text-xl text-red-300'>72%</h1></div>
            </div>

            <div className=' flex flex-col items-center justify-between gap-1 bg-red-900 border-0 rounded-xl w-1/3'>
              <div><h1 className=' font-medium text-lg text-red-300'>Error</h1></div>
              <div><h1 className=' font-bold text-xl text-red-300'>72%</h1></div>
            </div>

            <div className=' flex flex-col items-center justify-between gap-1 bg-green-900 border-0 rounded-xl w-1/3'>
              <div><h1 className=' font-medium text-lg text-green-300'>Error</h1></div>
              <div><h1 className=' font-bold text-xl text-green-300'>72%</h1></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Analysis_History