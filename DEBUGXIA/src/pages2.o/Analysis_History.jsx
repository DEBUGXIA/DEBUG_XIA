import React, { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import {ChartNoAxesCombined} from 'lucide-react'
import { FileText } from 'lucide-react'
import { CalendarDays } from 'lucide-react'
import { CodeXml } from 'lucide-react'
import { BadgeAlert } from 'lucide-react'


const Analysis_History = () => {

  const [analysisData, setAnalysisData] = useState([])
  const [loading, setLoading] = useState(true)
  const [Analysis, setAnalysis] = useState([
    { Title: "Total Analyses", Num: "0", Logo: <Zap color="#b335ed" strokeWidth={1.25} /> },
    { Title: "Avg Quality", Num: "0%", Logo: <ChartNoAxesCombined color="#4fe388" strokeWidth={1.25} /> },
    { Title: "Files Improved", Num: "0", Logo: <FileText color="#6985f7" strokeWidth={1.25} /> },
    { Title: "Time Saved", Num: "0m", Logo: <CalendarDays color="#69f781" strokeWidth={1.25} /> },
  ])

  useEffect(() => {
    fetchAnalysisHistory()
  }, [])

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
      return {
        file: analysis.analysis_type === 'optimization' ? 'Optimization.py' : 'Code.ts',
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

      <div className='flex flex-row items-center justify-between gap-15 mr-20  px-5 bg-green mt-20 '>

        {Analysis.map((item, idx) => (
          <div
            key={idx}
            className='flex flex-row items-center gap-8 bg-gray-950 border border-gray-400 rounded-xl px-4 p-4 
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


      <div className='flex flex-col items-start gap-8 bg-gray-950 border border-gray-400 rounded-xl px-4 p-4 
             hover:shadow-blue-500/20  
            transition-all duration-300  mr-20 px-10 py-5'>

              <div className=' flex flex-col items-center justify-between gap-5'>
                <h1 className=' font-bold text-xl tracking-wide'>Recent Analyses</h1>
              </div>

              {loading ? (
                <div className='text-center text-gray-300 py-8 w-full'>
                  <p>Loading analyses...</p>
                </div>
              ) : Data.length === 0 ? (
                <div className='text-center text-gray-300 py-8 w-full'>
                  <p>No analyses yet. Start by executing code and analyzing it!</p>
                </div>
              ) : (
                <>{Data.map((item,idx)=>(
                  <div key={idx} className='flex flex-col items-start gap-3 bg-gray-950 border border-gray-400 rounded-xl px-4 p-4 
                      hover:border-blue-500 transition-all duration-300 w-320'>

                    <div className=' flex flex-row items-center justify-between gap-3'>
                      <div><CodeXml color="#607ceb" strokeWidth={1} /></div>
                      <div><h3 className=' font-bold text-lg tracking-wide text-gray-300'>{item.file}</h3></div>
                      <div><p className='font-normal text-sm tracking-wide text-gray-400 bg-gray-800 border-0 rounded-lg px-2.5 py-1'>{item.type}</p></div>
                    </div>

                    <div className=' flex flex-row items-start justify-between gap-1'>
                      <div><CalendarDays color="#8a8a8a" strokeWidth={0.75} /></div>
                      <div><p className=' font-normal text-sm tracking-wide text-gray-400'>{item.time}</p></div>
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
                ))}</>
              )}
      </div>

    </div>
  )
}

export default Analysis_History