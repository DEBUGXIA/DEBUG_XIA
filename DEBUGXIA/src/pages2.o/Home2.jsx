import React from 'react'
import Terminal from '../components/Terminal'

const Home2 = () => {
  return (
    <div className=' flex flex-col justify-between ml-20 mt-15 gap-5 '>
      <div className=' flex flex-col items-center justify-between gap-3 mt-3'>
        <div>
          <h1 className=' bg-gradient-to-r from-blue-500 to-fuchsia-400 text-shadow-lg bg-clip-text text-transparent tracking-wide font-bold text-5xl'>Code Analyzer</h1>
        </div>
        <div>
          <p className='font-medium text-lg text-gray-200 text-shadow-sm tracking-wide mt-5'>
            Upload your code and let AI optimize it. See detailed error analysis<br></br><span className='ml-25 text-center'>and improvementsuggestions in real-time.</span>
          </p>
        </div>
      </div>
      <div className='-ml-35'>
        <Terminal/>
      </div>
    </div>
  )
}

export default Home2