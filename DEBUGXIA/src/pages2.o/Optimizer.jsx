import React, { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import Terminal4 from '../components/Terminal4'

const Optimizer = () => {

  const [optimizationStats, setOptimizationStats] = useState({
    total_suggestions: 0,
    avg_improvement: 0,
    critical_issues: 0,
    performance_gain: 2.5
  })

  useEffect(() => {
    // Listen for optimization suggestions from Terminal4
    const handleOptimizationUpdate = (event) => {
      if (event.detail) {
        setOptimizationStats(event.detail)
      }
    }

    window.addEventListener('optimizationUpdated', handleOptimizationUpdate)
    return () => window.removeEventListener('optimizationUpdated', handleOptimizationUpdate)
  }, [])

  const Analyzer=[
    { Title: "Total Suggestions", Num: optimizationStats.total_suggestions.toString()},
    { Title: "Avg Improvement", Num: Math.round(optimizationStats.avg_improvement) + "%"},
    { Title: "Critical Issues", Num: optimizationStats.critical_issues.toString()},
    { Title: "Est. Performance Gain", Num: optimizationStats.performance_gain.toFixed(2) + "x"},
  ]
  return (
    <div className=' flex flex-col justify-between ml-20 mt-18 gap-8 '>

      
      <div className=' flex flex-col items-start justify-between gap-3 ml-5'>

        <div className=' flex flex-row items-center justify-between gap-3'>
          <div><Zap size={35} color="#5f7fdd" strokeWidth={1.25} /></div>
          <div>
          <h1 className='bg-gradient-to-r from-blue-500 to-sky-200 bg-clip-text text-transparent tracking-wide font-bold text-4xl'>Code Optimizer</h1>
        </div>
        </div>

        <div>
          <p className='font-medium text-lg text-gray-300 tracking-wide'>
            Intelligent code analysis and optimization recommendations
          </p>
        </div>

      </div>

      <div className=' flex flex-row items-start gap-10'>

        {Analyzer.map((item, idx) =>(
          <div className=' flex flex-row items-start justify-between gap-5 bg-gray-950 w-55 h-25 py-1.5 px-4 border-1 border-gray-400 rounded-xl hover:border-blue-400 transition '>

          <div key={idx} className=' flex flex-col items-start justify-between gap-2'>
          <div className=' flex flex-row items-center justify-between gap-3'>
            <div><h1 className=' font-medium text-sm text-gray-400 tracking-wide '>{item.Title}</h1></div>
          </div>
          <div><h1 className='font-medium text-2xl text-blue-500 tracking-wide'>{item.Num}</h1></div>
        </div>

        </div>
        ))}
        
      </div>

      <div className='-ml-40 -mt-15'>
        <Terminal4/>
      </div>

    </div>
  )
}

export default Optimizer