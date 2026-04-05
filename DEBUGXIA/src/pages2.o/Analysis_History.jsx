import React from 'react'
import { Zap } from 'lucide-react'
import {ChartNoAxesCombined} from 'lucide-react'
import { FileText } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { CodeXml } from 'lucide-react'
import { BadgeAlert } from 'lucide-react'


const Analysis_History = () => {

  const Analysis = [
    { Title: "Total Analyses", Num: "12", Logo: <Zap color="#b335ed" strokeWidth={1.25} /> },
    { Title: "Avg Quality", Num: "77%", Logo: <ChartNoAxesCombined color="#4fe388" strokeWidth={1.25} /> },
    { Title: "Files Improved", Num: "9", Logo: <FileText color="#6985f7" strokeWidth={1.25} /> },
    { Title: "Time Saved", Num: "450m", Logo: <CalendarDays color="#69f781" strokeWidth={1.25} /> },
  ];

  const Data = [
  {
    file: "App.tsx",
    type: "TypeScript",
    time: "2 hours ago",
    error: 35,
    quality: 72,
    success: 58,
    issues: 3
  },
  {
    file: "utils.ts",
    type: "TypeScript",
    time: "5 hours ago",
    error: 15,
    quality: 85,
    success: 72,
    issues: 1
  },
  {
    file: "handler.py",
    type: "Python",
    time: "1 day ago",
    error: 52,
    quality: 61,
    success: 45,
    issues: 5
  },
  {
    file: "Service.js",
    type: "JavaScript",
    time: "2 day ago",
    error: 28,
    quality: 78,
    success: 65,
    issues: 2
  },
  {
    file: "Index.html",
    type: "HTML",
    time: "3 day ago",
    error: 10,
    quality: 90,
    success: 80,
    issues: 0
  }
];

const data = [
  { label: "Week 1", start: 65, end: 72 },
  { label: "Week 2", start: 72, end: 78 },
  { label: "Week 3", start: 78, end: 83 },
  { label: "This Week", start: 83, end: 87 },
];

  return (
    <div className='flex flex-col justify-between ml-10 mt-18 gap-10 w-screen px-10'>

      <div className='flex flex-col items-center gap-2'>
        <h1 className='bg-gradient-to-r from-blue-500 to-fuchsia-400 bg-clip-text text-transparent font-bold text-5xl'>
          Analysis History
        </h1>
        <p className='font-medium text-lg text-gray-300 mt-5'>
          Track all your code analyses and improvements.
        </p>
      </div>

      <div className='flex flex-row items-center justify-between gap-15 mr-20  px-5 bg-green mt-20 '>

        {Analysis.map((item, idx) => (
          <div
            key={idx}
            className='flex flex-row items-center gap-8 bg-gray-900 border border-gray-400 rounded-xl px-4 p-4 
            hover:border-blue-500 hover:shadow-blue-500/20  
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
             hover:shadow-blue-500/20  
            transition-all duration-300  mr-20 px-10 py-5'>

              <div className=' flex flex-col items-center justify-between gap-5'>
                <h1 className=' font-bold text-xl tracking-wide'>Recent Analyses</h1>
              </div>

        {Data.map((item,idx)=>(

          <div key={idx} >

        

        <div className='flex flex-col items-start gap-3 bg-gray-900 border border-gray-400 rounded-xl px-4 p-4 
            hover:border-blue-500 transition-all duration-300 w-320'>

          <div className=' flex flex-row items-center justify-between gap-3'>
            <div><CodeXml color="#607ceb" strokeWidth={1} /></div>
            <div><h3 className=' font-bold text-lg tracking-wide text-gray-300'>{item.file}</h3></div>
            <div><p className='font-normal text-sm tracking-wide text-gray-400 bg-gray-800 border-0 rounded-lg px-2.5 py-1'>{item.type}</p></div>
          </div>

          <div className=' flex flex-row items-start justify-between gap-1'>
            <div><CalendarDays color="#8a8a8a" strokeWidth={0.75} /></div>
            <div><p className=' font-normal text-sm tracking-wide text-gray-600'>{item.time}</p></div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-2 w-full'>
            <div className=' flex flex-col items-center justify-between gap-0.5 bg-red-950 border-0 rounded-xl w-1/3'>
              <div><h1 className=' font-medium text-lg text-red-300'>Error</h1></div>
              <div><h1 className=' font-bold text-xl text-red-300'>{item.error}%</h1></div>
            </div>

            <div className=' flex flex-col items-center justify-between gap-1 bg-blue-950 border-0 rounded-xl w-1/3'>
              <div><h1 className=' font-medium text-lg text-blue-300'>Quality</h1></div>
              <div><h1 className=' font-bold text-xl text-blue-300'>{item.quality}%</h1></div>
            </div>

            <div className=' flex flex-col items-center justify-between gap-1 bg-green-950 border-0 rounded-xl w-1/3'>
              <div><h1 className=' font-medium text-lg text-green-300'>Optimization</h1></div>
              <div><h1 className=' font-bold text-xl text-green-300'>{item.success}%</h1></div>
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1'>
            <div><BadgeAlert color="#c05fec" strokeWidth={0.75} /></div>
            <div><h1 className='font-normal text-sm tracking-wide text-purple-400'>{item.issues} issues found</h1></div>
          </div>

        </div>

      </div>

        ))}
      </div>

      <div className=' w-320 '>
        <div className="bg-gray-900 border border-blue-900 rounded-xl p-6 w-full">
      
     
      <div className=' flex flex-row items-start gap-1'>
        <div><ChartNoAxesCombined color="#4fe388" strokeWidth={1.25} /></div>
        <div>
          <h2 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">Quality Improvement Trend</h2>
        </div>
      </div>

      
      <div className="space-y-6">
        {data.map((item, index) => {
          const width = item.end; 

          return (
            <div key={index}>
              
              
              <div className="flex justify-between text-sm text-gray-300 mb-1">
                <span>{item.label}</span>
                <span>
                  {item.start}% → {item.end}%
                </span>
              </div>

             
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                
               
                <div
                  className="h-full rounded-full w-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"></div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
      </div>




    </div>
  )
}

export default Analysis_History