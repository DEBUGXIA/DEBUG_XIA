import React, { useState, useEffect } from 'react'
import { Play, CodeXml, Trash2, Upload } from 'lucide-react'

const Terminal3 = () => {

    const [title, setTitle] = useState('')
        const [details, setDetails] = useState('')
        const [task, setTask] = useState([])
        const [file, setFile] = useState([])
        const [language, setLanguage] = useState('Python')
        const [terminalOutput, setTerminalOutput] = useState([])
        const [loading, setLoading] = useState(false)
        const [analysisOutput, setAnalysisOutput] = useState('')
        const [analysisLoading, setAnalysisLoading] = useState(false)
        const [hasError, setHasError] = useState(false)
        const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false)
        const [executionStats, setExecutionStats] = useState({
          total_executions: 0,
          successful_executions: 0,
          failed_executions: 0,
          average_execution_time: 0,
          success_rate: 0
        })
        // Session-based success rate for current code file
        const [sessionExecutions, setSessionExecutions] = useState(0)
        const [sessionSuccessful, setSessionSuccessful] = useState(0)

        // Load stats from API on mount
        useEffect(() => {
          fetchStats()
          // Restore all saved data from localStorage
          const savedAnalysis = localStorage.getItem('terminal3_analysisOutput')
          const savedTitle = localStorage.getItem('terminal3_title')
          const savedDetails = localStorage.getItem('terminal3_details')
          const savedLanguage = localStorage.getItem('terminal3_language')
          const savedTerminalOutput = localStorage.getItem('terminal3_terminalOutput')
          
          if (savedAnalysis) setAnalysisOutput(savedAnalysis)
          if (savedTitle) setTitle(savedTitle)
          if (savedDetails) setDetails(savedDetails)
          if (savedLanguage) setLanguage(savedLanguage)
          if (savedTerminalOutput) setTerminalOutput(JSON.parse(savedTerminalOutput))
        }, [])

        // Auto-save title to localStorage
        useEffect(() => {
          if (title.length > 0) {
            localStorage.setItem('terminal3_title', title)
          }
        }, [title])

        // Auto-save details to localStorage
        useEffect(() => {
          if (details.length > 0) {
            localStorage.setItem('terminal3_details', details)
          }
        }, [details])

        // Auto-save language to localStorage
        useEffect(() => {
          localStorage.setItem('terminal3_language', language)
        }, [language])

        // Auto-save terminal output to localStorage
        useEffect(() => {
          if (terminalOutput.length > 0) {
            localStorage.setItem('terminal3_terminalOutput', JSON.stringify(terminalOutput))
          }
        }, [terminalOutput])

        const fetchStats = async () => {
          try {
            // Get token from localStorage
            const token = localStorage.getItem('access_token') || localStorage.getItem('token')
            if (!token) return // Not logged in
            
            const response = await fetch('http://localhost:8000/api/execution-stats/', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.success) {
                setExecutionStats(data.stats)
              }
            }
          } catch (err) {
            console.log('Could not fetch stats:', err.message)
          }
        }

        // Update stats and save to database
        const updateStats = async (success, executionTime) => {
          try {
            // Update session stats for current code file
            const newSessionExecutions = sessionExecutions + 1
            const newSessionSuccessful = success ? sessionSuccessful + 1 : sessionSuccessful
            
            setSessionExecutions(newSessionExecutions)
            setSessionSuccessful(newSessionSuccessful)

            const token = localStorage.getItem('access_token') || localStorage.getItem('token')
            if (!token) return // Not logged in
            
            const response = await fetch('http://localhost:8000/api/execution-stats/', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                success: success,
                execution_time: executionTime,
                language: language
              })
            })
            
            if (response.ok) {
              const data = await response.json()
              if (data.success) {
                setExecutionStats(data.stats)
                // Calculate session success rate
                const sessionSuccessRate = newSessionExecutions > 0 
                  ? Math.round((newSessionSuccessful / newSessionExecutions) * 100)
                  : 0
                // Dispatch event with session success rate
                const statsWithSessionRate = {
                  ...data.stats,
                  success_rate: sessionSuccessRate
                }
                window.dispatchEvent(new CustomEvent('statsUpdated', { detail: statsWithSessionRate }))
              }
            }
          } catch (err) {
            console.log('Could not update stats:', err.message)
          }
        }

        const clearStats = () => {
          // Stats are persistent in database, do NOT clear them
          // Just reload from database to ensure they're accurate
          fetchStats()
        }

        // Helper function to save analysis output
        const saveAnalysis = (analysisText) => {
          setAnalysisOutput(analysisText)
          // Save to localStorage to persist across tab switches
          localStorage.setItem('terminal3_analysisOutput', analysisText)
        }

        const getAverageTime = () => {
          if (!executionStats.average_execution_time) return 0
          return executionStats.average_execution_time.toFixed(2)
        }

        const getSuccessRate = () => {
          if (sessionExecutions === 0) return 0
          return Math.round((sessionSuccessful / sessionExecutions) * 100)
        }
        
        const languageExtensions = {
          'Python': '.py',
          'Java': '.java',
          'C': '.c',
          'C++': '.cpp'
        }
        
        const handleFileUpload = (e) => {
          const uploadedFile = e.target.files?.[0]
          if (uploadedFile) {
            // Reset session stats when new file is uploaded
            setSessionExecutions(0)
            setSessionSuccessful(0)
            
            const fileName = uploadedFile.name
            const fileExtension = fileName.split('.').pop().toLowerCase()
            
            const extensionMap = {
              'py': 'Python',
              'java': 'Java',
              'c': 'C',
              'cpp': 'C++',
              'cc': 'C++',
              'cxx': 'C++',
              'h': 'C',
              'hpp': 'C++',
              'txt': 'Python'
            }
            
            const detectedLanguage = extensionMap[fileExtension] || 'Python'
            setLanguage(detectedLanguage)
            
            const reader = new FileReader()
            reader.onload = (event) => {
              const fileContent = event.target?.result
              if (typeof fileContent === 'string') {
                setDetails(fileContent)
                setTitle(fileName.split('.')[0])
              }
            }
            reader.onerror = () => {
              alert('Error reading file. Please try again.')
            }
            reader.readAsText(uploadedFile)
          }
        }
        
          const SubmitHandler = (e) => {
              e.preventDefault()
        
              const CopyTask = [...task];
              CopyTask.push({task, details})
        
              const CopyFile = [...file];
              CopyFile.push({file, title})
            
        
              setTitle('')
              setDetails('')
              setTask(CopyTask)
              setFile(CopyFile)
            }

          const executeCode = async () => {
            if (details.trim() === '') {
              alert('Please enter code to execute')
              return
            }
            
            setLoading(true)
            setTerminalOutput([])
            const startTime = Date.now()
            
            try {
              const response = await fetch('http://localhost:8000/api/execute-code/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  code: details,
                  language: language
                })
              })
              
              const endTime = Date.now()
              const executionTime = (endTime - startTime) / 1000 // Convert to seconds
              
              if (!response.ok) {
                const errorData = await response.json()
                setTerminalOutput([{
                  type: 'error',
                  content: errorData.error || 'Failed to execute code'
                }])
                setHasError(true)
                updateStats(false, executionTime)
                // Dispatch event for real-time dashboard update
                window.dispatchEvent(new CustomEvent('errorOccurred'))
              } else {
                const data = await response.json()
                
                if (data.success) {
                  setTerminalOutput([{
                    type: 'output',
                    content: data.output || '(No output)'
                  }])
                  setHasError(false)
                  updateStats(true, executionTime)
                  // Dispatch event for real-time dashboard update
                  window.dispatchEvent(new CustomEvent('codeExecuted'))
                } else {
                  const outputs = []
                  if (data.output) {
                    outputs.push({
                      type: 'output',
                      content: data.output
                    })
                  }
                  if (data.error) {
                    outputs.push({
                      type: 'error',
                      content: data.error
                    })
                  }
                  setTerminalOutput(outputs.length > 0 ? outputs : [{
                    type: 'error',
                    content: 'Unknown error occurred'
                  }])
                  setHasError(true)
                  updateStats(false, executionTime)
                  // Dispatch event for real-time dashboard update
                  window.dispatchEvent(new CustomEvent('errorOccurred'))
                }
              }
            } catch (err) {
              const endTime = Date.now()
              const executionTime = (endTime - startTime) / 1000
              setTerminalOutput([{
                type: 'error',
                content: 'Error: ' + err.message
              }])
              setHasError(true)
              updateStats(false, executionTime)
              // Dispatch event for real-time dashboard update
              window.dispatchEvent(new CustomEvent('errorOccurred'))
            } finally {
              setLoading(false)
            }
          }

          const analyzeError = async () => {
            if (!hasError || terminalOutput.length === 0) {
              alert('No errors to analyze')
              return
            }

            setAnalysisLoading(true)
            
            try {
              const errorContent = terminalOutput.find(o => o.type === 'error')?.content || ''
              const fileName = file.length > 0 ? file[0].name : 'code.py'
              const token = localStorage.getItem('access_token') || localStorage.getItem('token')
              
              const response = await fetch('http://localhost:8000/api/analyze-execution/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                  code: details,
                  language: language,
                  output: '',
                  error: errorContent,
                  file_name: fileName,
                  analysis_type: 'quality'
                })
              })
              
              if (!response.ok) {
                const errorData = await response.json()
                saveAnalysis('Error: ' + (errorData.error || 'Failed to analyze'))
              } else {
                const data = await response.json()
                if (data.success) {
                  saveAnalysis(data.analysis)
                  window.dispatchEvent(new CustomEvent('analysisCompleted'))
                } else {
                  saveAnalysis('Error: ' + data.analysis)
                }
              }
            } catch (err) {
              saveAnalysis('Error: ' + err.message)
            } finally {
              setAnalysisLoading(false)
            }
          }

          const analyzeResult = async () => {
            if (terminalOutput.length === 0) {
              alert('Please execute code first')
              return
            }

            setAnalysisLoading(true)
            setShowAnalysis(true)
            
            try {
              const output = terminalOutput.find(o => o.type === 'output')?.content || ''
              const error = terminalOutput.find(o => o.type === 'error')?.content || ''
              const fileName = file.length > 0 ? file[0].name : 'code.py'
              const token = localStorage.getItem('access_token') || localStorage.getItem('token')
              
              const response = await fetch('http://localhost:8000/api/analyze-execution/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  ...(token && { 'Authorization': `Bearer ${token}` })
                },
                body: JSON.stringify({
                  code: details,
                  language: language,
                  output: output,
                  error: error,
                  file_name: fileName,
                  analysis_type: 'quality'
                })
              })
              
              if (!response.ok) {
                const errorData = await response.json()
                saveAnalysis('Error: ' + (errorData.error || 'Failed to analyze'))
              } else {
                const data = await response.json()
                if (data.success) {
                  saveAnalysis(data.analysis)
                  window.dispatchEvent(new CustomEvent('analysisCompleted'))
                } else {
                  saveAnalysis('Error: ' + data.analysis)
                }
              }
            } catch (err) {
              saveAnalysis('Error: ' + err.message)
            } finally {
              setAnalysisLoading(false)
            }
          }

  return (
    <div className='m-10 flex flex-row justify-between gap-10 text-gray-300 px-30 py-10'>
      <form className='flex-col w-2/3 gap-5 justify-between bg-gray-950 border-1 border-gray-500 rounded-2xl p-5' onSubmit={(e) =>{SubmitHandler(e)}} action="">

         <div className=' flex flex-row items-center gap-3'>
          <div><CodeXml color="#7e99ed" strokeWidth={1.5}  className=' -mt-5'/></div>
          <div className='font-bold text-2xl tracking-wide py-3 mb-6 text-gray-300'>
          <h1>Code Editor</h1>
         </div>
         </div>

         <div className='flex flex-col gap-5 justify-between border-white rounded-md'>
  
          <div className=' flex flex-row items-center justify-between gap-4'>
            <div className=' w-1/3 '>
              <input type="text" placeholder='File Name' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-700 border-2 rounded-md hover:border-blue-400 transition w-full' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
            </div>
            <div className=' w-1/3 flex items-center font-medium text-lg text-gray-300 tracking-wide gap-2'>
            <label htmlFor="cars">Choose Language :</label>

              <select name="cars" id="cars" value={language} onChange={(e) => setLanguage(e.target.value)} className='bg-gray-950 text-gray-300 w-24'>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
              </select>
            </div>
            <div className='w-1/3 flex items-center justify-end'>
              <input 
                type="file" 
                id="fileInput"
                accept=".py,.java,.c,.cpp,.txt,.js,.ts,.jsx,.tsx"
                onChange={handleFileUpload}
                className='hidden'
              />
              <button 
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className='px-6 py-2 font-semibold text-lg tracking-wide rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-2 border-blue-500 hover:border-blue-400 text-white flex flex-row items-center justify-center gap-2 transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-blue-500/50 hover:scale-105'
              >
                <Upload strokeWidth={2} size={20} />
                <span>Browse</span>
              </button>
            </div>
          </div>
  
          <textarea placeholder='Your Code . . . ' name="" id=""className='bg-gray-950 px-5 py-2 font-semibold text-lg tracking-wide border-gray-700 rounded-md border-1 h-80'value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <div className='flex flex-row items-center justify-between gap-3'>
            <button 
              type="button"
              onClick={executeCode}
              disabled={loading}
              className=' text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-xl flex-1 text-center bg-gradient-to-r from-blue-500 to-sky-300 hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex flex-row items-center justify-center gap-2'
            >
              <div><Play strokeWidth={1.75} /></div>
              <div><h1>{loading ? 'Executing...' : 'Execute Code'}</h1></div>
            </button>
            
            {hasError && (
              <button 
                type="button"
                onClick={analyzeError}
                disabled={analysisLoading}
                className=' text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex flex-row items-center justify-center gap-2 whitespace-nowrap'
              >
                <div>❌</div>
                <div>{analysisLoading ? 'Analyzing...' : 'Error Analysis'}</div>
              </button>
            )}
            
            <button 
              type="button"
              onClick={() => {
                setDetails('')
                setTerminalOutput([])
                setHasError(false)
                setAnalysisOutput('')
                setTitle('')
                // Clear all saved data from localStorage
                localStorage.removeItem('terminal3_analysisOutput')
                localStorage.removeItem('terminal3_title')
                localStorage.removeItem('terminal3_details')
                localStorage.removeItem('terminal3_language')
                localStorage.removeItem('terminal3_terminalOutput')
                // Reset session stats when code is cleared
                setSessionExecutions(0)
                setSessionSuccessful(0)
              }}
              className=' border-0 bg-gray-700 hover:bg-red-600 rounded-md py-2 px-3 transition-all cursor-pointer'
              title="Clear Code"
            >
              <Trash2 color="#a6a6a6" strokeWidth={1.5} />
            </button>
          </div>

          </div>
      </form>

      <div className=' flex flex-wap flex-col justify-start p-2 w-1/3 h-150 gap-2 bg-gray-950 border-1 border-gray-500 rounded-2xl p-5'>
  
        <div className='font-bold text-xl tracking-wide mb-2'>{hasError && analysisOutput ? 'Error Analysis' : 'Terminal Output'}</div>
  
        <div className='border-2 border-gray-500 rounded-md w-full h-[94%] p-3 bg-gray-900 overflow-y-auto'>
          {hasError && analysisOutput ? (
            <div className='text-gray-300 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed'>
              {analysisLoading ? '⏳ Analyzing error...' : analysisOutput}
            </div>
          ) : (
            <div className='font-mono text-sm'>
              {terminalOutput.length > 0 ? (
                terminalOutput.map((item, idx) => (
                  <div key={idx} className={`whitespace-pre-wrap break-words mb-2 ${
                    item.type === 'error' 
                      ? 'text-red-400 bg-red-900/20 p-2 rounded border border-red-700' 
                      : 'text-green-400'
                  }`}>
                    {item.content}
                  </div>
                ))
              ) : (
                <div className='text-gray-500'>
                  {loading ? '⏳ Executing code...' : '📭 No output yet. Click Execute Code to run your code.'}
                </div>
              )}
            </div>
          )}
        </div>
        
        {hasError && analysisOutput && (
          <div className='flex gap-2 mt-2'>
            <button 
              onClick={() => setIsAnalysisExpanded(true)}
              className='px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-semibold transition-all'
            >
              📖 Fullscreen
            </button>
          </div>
        )}
  
        </div>
        
        {isAnalysisExpanded && (
          <div className='fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4'>
            <div className='bg-gray-950 border-2 border-blue-500 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl'>
              <div className='sticky top-0 bg-gray-950 border-b border-blue-500 p-6 flex justify-between items-center'>
                <h2 className='text-3xl font-bold text-blue-400'>📊 Error Analysis</h2>
                <button 
                  onClick={() => setIsAnalysisExpanded(false)}
                  className='text-gray-400 hover:text-white text-3xl font-bold transition-all'
                >
                  ✕
                </button>
              </div>
              <div className='p-8 text-gray-300 whitespace-pre-wrap break-words font-sans text-base leading-relaxed'>
                {analysisOutput}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Terminal3