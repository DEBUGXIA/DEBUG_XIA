import React from 'react'
import Terminal from '../components/Terminal'

const Home2 = () => {
  return (
    <div className=' flex flex-col justify-between ml-20 mt-10 '>
      <div className=' flex flex-col items-start justify-between gap-3 mt-3 ml-5'>
        <div>
          <h1 className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent tracking-wide font-bold text-4xl'>Code Analyzer</h1>
        </div>
        <div>
          <p className='font-medium text-lg text-gray-400 tracking-wide'>
            Upload your code and let AI optimize it. See detailed error analysis and improvement<br></br><span>suggestions in real-time.</span>
          </p>
        </div>
      </div>
      <div className='-ml-35 -mt-15'>
        <Terminal/>
      </div>
    </div>
  )
}

export default Home2