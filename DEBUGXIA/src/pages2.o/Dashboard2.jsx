import React, { useState, useEffect } from 'react'
import { Bug, CircleCheckBig, Zap, Disc2, ChartLine, CircleAlert, ChartColumn, Layers, BookOpen, CalendarDays, Info } from 'lucide-react'
import { errorAPI, executionAPI } from '../services/api'

const Dashboard2 = () => {
  const [stats, setStats] = useState([
    { title: "Total Errors", value: 0, Logo: <Bug color="#e67f7f" strokeWidth={1.5} /> },
    { title: "Resolved", value: 0, Logo: <CircleCheckBig color="#86e67f" strokeWidth={1.5} /> },
    { title: "Unresolved", value: 0, Logo: <Zap color="#c756f0" strokeWidth={1.5} /> },
    { title: "Success Rate", value: 0, unit: "%", Logo: <Disc2 color="#685eed" strokeWidth={1.5} /> },
    { title: "Executions", value: 0, Logo: <ChartLine color="#5eed68" strokeWidth={1.5} /> },
  ])
  const [errorTypes, setErrorTypes] = useState([])
  const [severity, setSeverity] = useState([
    { label: "Low", value: 0 },
    { label: "Medium", value: 0 },
    { label: "High", value: 0 },
    { label: "Critical", value: 0 },
  ])
  const [recentErrors, setRecentErrors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    
    // Listen for error events from Terminal/Code Analyzer
    const handleErrorOccurred = () => {
      console.log('Error occurred, refreshing dashboard...')
      fetchDashboardData()
    }
    
    // Listen for code execution completion
    const handleCodeExecuted = () => {
      console.log('Code executed, refreshing dashboard...')
      fetchDashboardData()
    }
    
    // Add event listeners
    window.addEventListener('errorOccurred', handleErrorOccurred)
    window.addEventListener('codeExecuted', handleCodeExecuted)
    
    // Auto-refresh every 3 seconds for real-time updates
    const refreshInterval = setInterval(() => {
      fetchDashboardData()
    }, 3000)
    
    // Cleanup listeners and interval on unmount
    return () => {
      window.removeEventListener('errorOccurred', handleErrorOccurred)
      window.removeEventListener('codeExecuted', handleCodeExecuted)
      clearInterval(refreshInterval)
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch error statistics
      const errorStats = await errorAPI.getStatistics()
      const errors = await errorAPI.getErrors()
      
      // Fetch execution statistics
      const execStats = await executionAPI.getStatistics()

      // Calculate stats
      const newStats = [
        { ...stats[0], value: errorStats.total_errors },
        { ...stats[1], value: errorStats.resolved },
        { ...stats[2], value: errorStats.unresolved },
        { ...stats[3], value: execStats.success_rate ? Math.round(execStats.success_rate) : 0 },
        { ...stats[4], value: execStats.total_executions },
      ]
      setStats(newStats)

      // Process error types
      const errorTypeMap = {}
      errors.forEach(error => {
        errorTypeMap[error.error_type] = (errorTypeMap[error.error_type] || 0) + 1
      })
      const errorTypeArray = Object.entries(errorTypeMap)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 4)
      setErrorTypes(errorTypeArray)

      // Process severity
      const severityMap = {
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      }
      errors.forEach(error => {
        severityMap[error.severity] = (severityMap[error.severity] || 0) + 1
      })
      setSeverity([
        { label: "Low", value: severityMap.low },
        { label: "Medium", value: severityMap.medium },
        { label: "High", value: severityMap.high },
        { label: "Critical", value: severityMap.critical },
      ])

      // Get recent errors
      setRecentErrors(errors.slice(0, 5).map(e => ({
        title: e.error_type,
        msg: e.error_message.substring(0, 50) + '...',
        level: e.severity
      })))
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const Card = ({ children }) => (
    <div className="bg-gray-950 border border-gray-400 rounded-xl p-6 hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300">
      {children}
    </div>
  );

  const Badge = ({ level }) => {
    const map = {
      high: "bg-purple-900 text-purple-400",
      critical: "bg-red-900 text-red-400",
      medium: "bg-blue-900 text-blue-400",
      low: "bg-green-900 text-green-400",
    };
    return <span className={`text-xs px-3 py-1 rounded ${map[level]}`}>{level}</span>;
  };

  const maxError = errorTypes.length > 0 ? Math.max(...errorTypes.map((e) => e.count)) : 1
  const totalErrors = errorTypes.reduce((sum, e) => sum + e.count, 0)

  if (loading) {
    return <div className="min-h-screen text-white flex items-center justify-center">Loading dashboard...</div>
  }

  return (
    <div className=" min-h-screen text-white p-6 space-y-6 p-10 mt-15">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <div className=' flex flex-row items-center gap-3'>
              <div>{s.Logo}</div>
              <div className=' flex flex-col items-center'>
                <p className="text-sm text-gray-400">{s.title}</p>
            <h2 className="text-2xl font-bold mt-2">
              {s.value}
              {s.unit || ""}
            </h2>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-400 mb-4">Total Errors Overview</p>
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 border-8 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-blue-500 border-t-transparent rounded-full rotate-[270deg]" style={{ clipPath: "inset(0 0 25% 0)" }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
              {stats[0].value}
            </div>
          </div>
        </Card>

        <Card>
          <div className=' flex flex-row items-center gap-2'>
            <div><CircleAlert color="#5e89ed" strokeWidth={1.5} className=' -mt-3' /></div>
            <div><p className="text-gray-400 mb-4">Common Error Types</p></div>
          </div>
          {errorTypes.length > 0 ? (
            errorTypes.map((e, i) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between text-sm">
                  <span>{e.name}</span>
                  <span>x{e.count}</span>
                </div>
                <div className="w-full bg-gray-700 h-2 rounded">
                  <div
                    className="h-2 rounded bg-gradient-to-r from-blue-400 to-purple-500"
                    style={{ width: `${(e.count / maxError) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No errors yet</p>
          )}
        </Card>

        <Card>
          <div className=' flex flex-row items-center gap-2'>
            <div><ChartColumn color="#5e89ed" strokeWidth={1.5} className=' -mt-5' /></div>
          <p className="text-gray-400 mb-6">Severity Breakdown</p>
          </div>
          <div className="grid grid-cols-4 text-center">
            {severity.map((s, i) => (
              <div key={i}>
                <p className="text-lg font-semibold">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className=' flex flex-row items-center gap-3'> 
          <div><Info color="#ea5353" strokeWidth={1.5}  className='-mt-3'/></div>
          <p className="text-gray-400 mb-4">Recent Errors</p>
        </div>
        {recentErrors.length > 0 ? (
          recentErrors.map((e, i) => (
            <div key={i} className="flex justify-between items-center bg-gray-900 p-4 rounded mb-3">
              <div>
                <p className="font-semibold">{e.title}</p>
                <p className="text-sm text-gray-400">{e.msg}</p>
              </div>
              <Badge level={e.level} />
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No errors yet</p>
        )}
      </Card>
    </div>

  )
}

export default Dashboard2