import React from 'react'
import { Terminal, Play, CircleCheckBig, CodeXml, SquareChevronRight } from 'lucide-react'
import Terminal3 from '../components/Terminal3'

const Terminal2 = () => {

  const Analyzer=[
    {Logo: <Play color="#5fa8ec" strokeWidth={1.25} />, Title: "Executions Today", Num: "12"},
    {Logo: <CircleCheckBig color="#5fa8ec" strokeWidth={1.25} />, Title: "Success Rate", Num: "92%"},
    {Logo: <CodeXml color="#5fa8ec" strokeWidth={1.25} />, Title: "Avg Time", Num: "0.86s"},
  ]
  return (
    <div className=' flex flex-col justify-between ml-20 mt-15 gap-8 '>

      
      <div className=' flex flex-col items-start justify-between gap-3 mt-3 ml-5'>

        <div className=' flex flex-row items-center justify-between gap-3'>
          <div><Terminal size={35} color="#5fa8ec" strokeWidth={1.75} /></div>
          <div>
          <h1 className='text-white text-shadow-lg tracking-wide font-bold text-4xl'>Terminal & Code Execution</h1>
        </div>
        </div>

        <div>
          <p className='font-medium text-lg text-gray-300 text-shadow-lg tracking-wide'>
            Execute your code and view terminal output in real-time
          </p>
        </div>

      </div>

      <div className=' flex flex-row items-center gap-10 mt-5'>

        {Analyzer.map((item, idx) =>(
          <div className=' flex flex-row items-center justify-between gap-5 bg-gray-900 w-35 h-25 py-1.5 px-4 border-1 border-gray-400 rounded-xl hover:border-blue-400 transition'>

          <div key={idx} className=' flex flex-col items-start justify-between gap-2'>
          <div className=' flex flex-row items-center justify-between gap-3'>
            <div>{item.Logo}</div>
            <div><h1 className=' font-medium text-sm text-gray-400 tracking-wide '>{item.Title}</h1></div>
          </div>
          <div><h1 className='font-medium text-2xl text-gray-400 tracking-wide'>{item.Num}</h1></div>
        </div>

        </div>
        ))}
        
      </div>

      <div className='-ml-40 -mt-15'>
        <Terminal3/>
      </div>

      <div className=' bg-gray-900 border-1 border-gray-500 rounded-xl p-5 mr-35 -mt-18 h-40 flex flex-col gap-3'>
        <div className=' flex flex-row  gap-3'>
          <div><SquareChevronRight color="#a6a6a6" strokeWidth={1.25} /></div>
          <div><h1>Terminal</h1></div>
        </div>
        <div>
          <textarea name="" id="" className=' w-[100%] h-20 rounded-md '></textarea>
        </div>
      </div>

    </div>
  )
}

export default Terminal2