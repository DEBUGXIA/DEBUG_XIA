import React, { useState, useEffect } from 'react'
import { Terminal, Play, CircleCheckBig, CodeXml, SquareChevronRight } from 'lucide-react'
import Terminal3 from '../components/Terminal3'

const Terminal2 = () => {

  const [stats, setStats] = useState({
    total_executions: 0,
    successful_executions: 0,
    average_execution_time: 0,
    success_rate: 0  // Session-based success rate, not from database
  })

  useEffect(() => {
    // Load stats from API if logged in
    fetchStats()

    // Listen for stats updates from Terminal3
    const handleStatsUpdate = (event) => {
      if (event.detail) {
        setStats(event.detail)
      }
    }

    window.addEventListener('statsUpdated', handleStatsUpdate)
    return () => window.removeEventListener('statsUpdated', handleStatsUpdate)
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token')
      if (!token) {
        // Try localStorage fallback if not logged in
        const saved = localStorage.getItem('debugxia_stats')
        if (saved) {
          const parsed = JSON.parse(saved)
          setStats(parsed)
        }
        return
      }
      
      const response = await fetch('http://localhost:8000/api/execution-stats/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.stats) {
          // Load persistent stats from database, but reset session success_rate to 0
          setStats({
            total_executions: data.stats.total_executions,
            successful_executions: data.stats.successful_executions,
            average_execution_time: data.stats.average_execution_time,
            success_rate: 0  // Session-based, starts at 0
          })
        }
      }
    } catch (err) {
      console.log('Could not fetch stats:', err.message)
    }
  }

  const getAverageTime = () => {
    if (!stats.average_execution_time) return '0s'
    return stats.average_execution_time.toFixed(2) + 's'
  }

  const getSuccessRate = () => {
    if (stats.success_rate === undefined || stats.success_rate === null) return '0%'
    return Math.round(stats.success_rate) + '%'
  }

  const Analyzer=[
    {Logo: <Play color="#5fa8ec" strokeWidth={1.25} />, Title: "Executions Today", Num: stats.total_executions?.toString() || '0'},
    {Logo: <CircleCheckBig color="#5fa8ec" strokeWidth={1.25} />, Title: "Success Rate", Num: getSuccessRate()},
    {Logo: <CodeXml color="#5fa8ec" strokeWidth={1.25} />, Title: "Avg Time", Num: getAverageTime()},
  ]

  return (
    <div className=' flex flex-col justify-between ml-20 mt-18 gap-8 '>

      
      <div className=' flex flex-col items-start justify-between gap-3 ml-5'>

        <div className=' flex flex-row items-center justify-between gap-3'>
          <div><Terminal size={35} color="#5fa8ec" strokeWidth={1.75} /></div>
          <div>
          <h1 className='bg-gradient-to-r from-blue-600 to-sky-300 bg-clip-text text-transparent tracking-wide font-bold text-4xl'>Terminal & Code Execution</h1>
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
          <div className=' flex flex-row items-center justify-between gap-5 bg-gray-950 w-35 h-25 py-1.5 px-4 border-1 border-gray-400 rounded-xl hover:border-blue-400 transition'>

          <div key={idx} className=' flex flex-col items-start justify-between gap-2'>
          <div className=' flex flex-row items-center justify-between gap-3'>
            <div>{item.Logo}</div>
            <div><h1 className=' font-medium text-sm text-gray-300 tracking-wide '>{item.Title}</h1></div>
          </div>
          <div><h1 className='font-medium text-2xl text-gray-300 tracking-wide'>{item.Num}</h1></div>
        </div>

        </div>
        ))}
        
      </div>

      <div className='-ml-40 -mt-15'>
        <Terminal3/>
      </div>

    </div>
  )
}

export default Terminal2