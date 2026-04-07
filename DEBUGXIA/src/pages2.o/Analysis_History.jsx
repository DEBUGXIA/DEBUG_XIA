import React, { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import {ChartNoAxesCombined} from 'lucide-react'
import { FileText } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { CodeXml } from 'lucide-react'
import { BadgeAlert } from 'lucide-react'
import { Play, CircleCheckBig } from 'lucide-react'


const Analysis_History = () => {

  const [analysisData, setAnalysisData] = useState([])
  const [executionStats, setExecutionStats] = useState({
    total_executions: 0,
    average_execution_time: 0,
    success_rate: 0
  })
  const [loading, setLoading] = useState(true)
  const [Analysis, setAnalysis] = useState([
    { Title: "Total Analyses", Num: "0", Logo: <Zap color="#b335ed" strokeWidth={1.25} /> },
    { Title: "Avg Quality", Num: "0%", Logo: <ChartNoAxesCombined color="#4fe388" strokeWidth={1.25} /> },
    { Title: "Files Improved", Num: "0", Logo: <FileText color="#6985f7" strokeWidth={1.25} /> },
    { Title: "Time Saved", Num: "0m", Logo: <CalendarDays color="#69f781" strokeWidth={1.25} /> },
  ])

  const [TerminalStats, setTerminalStats] = useState([
    { Title: "Executions Today", Num: "0", Logo: <Play color="#5fa8ec" strokeWidth={1.25} /> },
    { Title: "Success Rate", Num: "0%", Logo: <CircleCheckBig color="#5fa8ec" strokeWidth={1.25} /> },
    { Title: "Avg Time", Num: "0s", Logo: <CodeXml color="#5fa8ec" strokeWidth={1.25} /> },
  ])

  useEffect(() => {
    fetchAllData()
    
    // Listen for stats updates from Terminal
    const handleStatsUpdated = () => {
      console.log('Stats updated, refreshing...')
      fetchAllData()
    }
    
    // Listen for optimization updates from Optimizer
    const handleOptimizationUpdated = () => {
      console.log('Optimization updated, refreshing...')
      fetchAllData()
    }
    
    // Listen for analysis completion
    const handleAnalysisCompleted = () => {
      console.log('Analysis completed, refreshing...')
      fetchAllData()
    }
    
    // Add event listeners
    window.addEventListener('statsUpdated', handleStatsUpdated)
    window.addEventListener('optimizationUpdated', handleOptimizationUpdated)
    window.addEventListener('analysisCompleted', handleAnalysisCompleted)
    
    // Periodic refresh every 5 seconds to catch updates
    const refreshInterval = setInterval(() => {
      fetchAllData()
    }, 5000)
    
    // Cleanup listeners and interval on unmount
    return () => {
      window.removeEventListener('statsUpdated', handleStatsUpdated)
      window.removeEventListener('optimizationUpdated', handleOptimizationUpdated)
      window.removeEventListener('analysisCompleted', handleAnalysisCompleted)
      clearInterval(refreshInterval)
    }
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token')
      if (!token) {
        console.log('Not logged in')
        setLoading(false)
        return
      }

      // Fetch analysis history
      const analysisResponse = await fetch('http://localhost:8000/api/analysis/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (analysisResponse.ok) {
        const analysisResult = await analysisResponse.json()
        const results = analysisResult.results || analysisResult || []
        setAnalysisData(results)
        calculateStats(results)
      }

      // Fetch execution stats
      const execResponse = await fetch('http://localhost:8000/api/execution-stats/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (execResponse.ok) {
        const execData = await execResponse.json()
        if (execData.success && execData.stats) {
          setExecutionStats(execData.stats)
          updateTerminalStats(execData.stats)
        }
      }
    } catch (err) {
      console.log('Could not fetch data:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const updateTerminalStats = (stats) => {
    const newTerminalStats = [
      { Title: "Executions Today", Num: stats.total_executions?.toString() || "0", Logo: <Play color="#5fa8ec" strokeWidth={1.25} /> },
      { Title: "Success Rate", Num: Math.round(stats.success_rate || 0) + "%", Logo: <CircleCheckBig color="#5fa8ec" strokeWidth={1.25} /> },
      { Title: "Avg Time", Num: (stats.average_execution_time || 0).toFixed(2) + "s", Logo: <CodeXml color="#5fa8ec" strokeWidth={1.25} /> },
    ]
    setTerminalStats(newTerminalStats)
  }

  const fetchAnalysisHistory = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token')
      if (!token) {
        console.log('Not logged in')
        setLoading(false)
        return
      }

      const response = await fetch('http://localhost:8000/api/analysis/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const results = data.results || data || []
        
        setAnalysisData(results)
        calculateStats(results)
      }
    } catch (err) {
      console.log('Could not fetch analysis history:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (analyses) => {
    if (!analyses || analyses.length === 0) return

    const totalAnalyses = analyses.length
    const avgQuality = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + (a.score || 0), 0) / analyses.length)
      : 0
    
    // Assuming each analysis improves one file
    const filesImproved = analyses.length
    
    // Time saved calculation (rough estimate: 5 minutes per analysis)
    const timeSaved = analyses.length * 5

    const newAnalysis = [
      { Title: "Total Analyses", Num: totalAnalyses.toString(), Logo: <Zap color="#b335ed" strokeWidth={1.25} /> },
      { Title: "Avg Quality", Num: avgQuality + "%", Logo: <ChartNoAxesCombined color="#4fe388" strokeWidth={1.25} /> },
      { Title: "Files Improved", Num: filesImproved.toString(), Logo: <FileText color="#6985f7" strokeWidth={1.25} /> },
      { Title: "Time Saved", Num: timeSaved + "m", Logo: <CalendarDays color="#69f781" strokeWidth={1.25} /> },
    ]
    
    setAnalysis(newAnalysis)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  const formatData = (analyses) => {
    return analyses.map(analysis => {
      const improvements = analysis.improvements || {}
      const fileName = analysis.file_name || analysis.analysis_type === 'optimization' ? 'Optimization.py' : 'Code.ts'
      const language = analysis.language || 'Unknown'
      return {
        file: fileName,
        language: language,
        type: analysis.analysis_type.charAt(0).toUpperCase() + analysis.analysis_type.slice(1),
        time: formatDate(analysis.created_at),
        error: Math.round((100 - analysis.score) * 0.5),
        quality: Math.round(analysis.score),
        success: Math.round(analysis.score * 0.8),
        issues: Object.keys(improvements).length
      }
    })
  }

  const Data = formatData(analysisData);

  return (
    <div className='flex flex-col justify-between ml-10 mt-18 gap-10 w-screen px-10'>

      <div className='flex flex-col items-center gap-2'>
        <h1 className='bg-gradient-to-r from-blue-600 to-sky-300 bg-clip-text text-transparent font-bold text-5xl'>
          Analysis History
        </h1>
        <p className='font-medium text-lg text-gray-300 mt-5'>
          Track all your code analyses and improvements.
        </p>
      </div>

      {/* Recent Analyses Section - Only show if data exists */}
      {Data.length > 0 && (
        <div className='flex flex-col items-start gap-8 bg-gray-950 border border-gray-400 rounded-xl px-10 py-5 
             hover:shadow-blue-500/20  
            transition-all duration-300  mr-20'>

              <div className=' flex flex-col items-center justify-between gap-5'>
                <h1 className=' font-bold text-xl tracking-wide'>Recent Analyses</h1>
              </div>

              {loading ? (
                <div className='text-center text-gray-300 py-8 w-full'>
                  <p>Loading analyses...</p>
                </div>
              ) : (
                <div className='w-full grid grid-cols-1 gap-6'>
                  {Data.map((item,idx)=>(
                    <div key={idx} className='flex flex-col gap-4 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-700 rounded-xl px-6 py-5 
                        hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300'>

                      {/* File Header Section */}
                      <div className='flex flex-row items-center justify-between gap-4 pb-4 border-b border-gray-700'>
                        <div className='flex flex-row items-center gap-3 flex-1'>
                          <CodeXml color="#607ceb" strokeWidth={1.5} size={24} />
                          <div className='flex flex-col gap-1'>
                            <h3 className='font-bold text-lg text-white tracking-wide'>{item.file}</h3>
                            <p className='text-xs text-gray-400 tracking-wide uppercase'>{item.language} • {item.type}</p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <CalendarDays color="#8a8a8a" strokeWidth={0.75} size={16} />
                          <p className='text-sm text-gray-400'>{item.time}</p>
                        </div>
                      </div>

                      {/* Stats Grid Section */}
                      <div className='grid grid-cols-3 gap-4'>
                        <div className='flex flex-col items-center justify-center gap-2 bg-red-950/30 border border-red-800/50 rounded-lg py-4 px-3 
                            hover:bg-red-950/50 transition-colors'>
                          <h1 className='font-medium text-sm text-red-300 uppercase tracking-wide'>Error Rate</h1>
                          <h1 className='font-bold text-2xl text-red-400'>{item.error}%</h1>
                        </div>

                        <div className='flex flex-col items-center justify-center gap-2 bg-blue-950/30 border border-blue-800/50 rounded-lg py-4 px-3
                            hover:bg-blue-950/50 transition-colors'>
                          <h1 className='font-medium text-sm text-blue-300 uppercase tracking-wide'>Quality</h1>
                          <h1 className='font-bold text-2xl text-blue-400'>{item.quality}%</h1>
                        </div>

                        <div className='flex flex-col items-center justify-center gap-2 bg-green-950/30 border border-green-800/50 rounded-lg py-4 px-3
                            hover:bg-green-950/50 transition-colors'>
                          <h1 className='font-medium text-sm text-green-300 uppercase tracking-wide'>Optimization</h1>
                          <h1 className='font-bold text-2xl text-green-400'>{item.success}%</h1>
                        </div>
                      </div>

                      {/* Issues Section */}
                      {item.issues > 0 && (
                        <div className='flex flex-row items-center gap-3 bg-purple-950/20 border border-purple-800/30 rounded-lg px-4 py-3'>
                          <BadgeAlert color="#c05fec" strokeWidth={1.5} size={20} />
                          <p className='text-sm text-purple-300'><span className='font-semibold'>{item.issues}</span> issues found and documented</p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
        </div>
      )}

      {/* Empty State - Show helpful CTA when no analyses */}
      {!loading && Data.length === 0 && (
        <div className='flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-blue-950/20 to-gray-950 border-2 border-dashed border-blue-500/50 rounded-xl px-10 py-16 mr-20'>
          <CodeXml color="#5fa8ec" size={48} strokeWidth={1} />
          <div className='flex flex-col items-center gap-3'>
            <h2 className='font-bold text-2xl text-white text-center'>No Analyses Yet</h2>
            <p className='text-gray-400 text-center max-w-md'>Start by uploading a code file in the <span className='text-blue-400 font-semibold'>Code Analyzer</span> or <span className='text-blue-400 font-semibold'>Terminal</span> tab and analyze it to see results here.</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default Analysis_History