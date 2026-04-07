import React, { useState, useEffect } from 'react'
import { Zap, CodeXml, Trash2, Upload } from 'lucide-react'

const Terminal4 = () => {

    const [title, setTitle] = useState('')
    const [details, setDetails] = useState('')
    const [language, setLanguage] = useState('Python')
    const [task, setTask] = useState([])
    const [file, setFile] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState(null)
    const [optimizationStats, setOptimizationStats] = useState({
      total_suggestions: 0,
      avg_improvement: 0,
      critical_issues: 0,
      performance_gain: 2.5
    })

    // Load saved optimization results from localStorage on mount
    useEffect(() => {
      const savedTask = localStorage.getItem('optimizer_task')
      const savedFile = localStorage.getItem('optimizer_file')
      const savedLevel = localStorage.getItem('optimizer_level')
      const savedStats = localStorage.getItem('optimizer_stats')
      
      if (savedTask) {
        setTask(JSON.parse(savedTask))
      }
      if (savedFile) {
        setFile(JSON.parse(savedFile))
      }
      if (savedLevel) {
        setSelectedLevel(savedLevel)
      }
      if (savedStats) {
        setOptimizationStats(JSON.parse(savedStats))
      }
    }, [])
    
    // Save optimization results to localStorage whenever they change
    useEffect(() => {
      if (task.length > 0) {
        localStorage.setItem('optimizer_task', JSON.stringify(task))
      }
    }, [task])
    
    useEffect(() => {
      if (file.length > 0) {
        localStorage.setItem('optimizer_file', JSON.stringify(file))
      }
    }, [file])
    
    useEffect(() => {
      if (selectedLevel) {
        localStorage.setItem('optimizer_level', selectedLevel)
      }
    }, [selectedLevel])
    
    useEffect(() => {
      localStorage.setItem('optimizer_stats', JSON.stringify(optimizationStats))
    }, [optimizationStats])

    const handleFileUpload = (e) => {
      const uploadedFile = e.target.files?.[0]
      if (uploadedFile) {
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
          'txt': 'Python',
          'js': 'JavaScript',
          'ts': 'TypeScript'
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
        reader.readAsText(uploadedFile)
      }
    }

    const generateOptimization = async (efficiencyLevel = null) => {
      if (details.trim() === '') {
        alert('Please enter code to optimize')
        return
      }

      setLoading(true)
      if (!efficiencyLevel) {
        setTask([])
        setFile([])
      }

      try {
        const token = localStorage.getItem('access_token') || localStorage.getItem('token')
        
        // Add context based on efficiency level
        let codeContext = details
        let levelPrefix = ''
        if (efficiencyLevel) {
          levelPrefix = `Optimize for ${efficiencyLevel} efficiency level: `
          if (efficiencyLevel === 'Basic') {
            levelPrefix += 'Focus on simple, readable improvements.'
          } else if (efficiencyLevel === 'Standard') {
            levelPrefix += 'Balance between performance and maintainability.'
          } else if (efficiencyLevel === 'Industrial') {
            levelPrefix += 'Maximum performance and advanced optimizations.'
          }
        }
        
        const response = await fetch('http://localhost:8000/api/analyze-execution/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify({
            code: codeContext,
            language: language,
            output: levelPrefix,
            error: '',
            file_name: title || 'code',
            analysis_type: 'optimization'
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            const suggestion = data.analysis || 'No optimization suggestions available'
            
            // Parse suggestions to count improvements
            const lines = suggestion.split('\n').filter(line => line.trim().length > 0)
            const totalSuggestions = lines.length
            const criticalIssues = lines.filter(line => 
              line.toLowerCase().includes('error') || 
              line.toLowerCase().includes('critical') ||
              line.toLowerCase().includes('severe')
            ).length
            
            let avgImprovement = Math.min(totalSuggestions * 15, 95)
            let performanceGain = (2.5 + (totalSuggestions * 0.5)).toFixed(2)
            
            // Adjust stats based on efficiency level
            if (efficiencyLevel === 'Basic') {
              avgImprovement = Math.max(avgImprovement - 20, 10)
              performanceGain = (parseFloat(performanceGain) * 0.6).toFixed(2)
            } else if (efficiencyLevel === 'Standard') {
              // Keep normal values
            } else if (efficiencyLevel === 'Industrial') {
              avgImprovement = Math.min(avgImprovement + 25, 99)
              performanceGain = (parseFloat(performanceGain) * 1.5).toFixed(2)
            }

            // Update local stats
            const newStats = {
              total_suggestions: totalSuggestions,
              avg_improvement: avgImprovement,
              critical_issues: criticalIssues,
              performance_gain: parseFloat(performanceGain)
            }
            setOptimizationStats(newStats)

            // Dispatch event to update Optimizer page
            window.dispatchEvent(new CustomEvent('optimizationUpdated', { detail: newStats }))
            
            // Dispatch event to update Analysis History page in real-time
            window.dispatchEvent(new CustomEvent('analysisCompleted'))

            // Add to suggestions display only on first generation
            if (!efficiencyLevel) {
              const CopyFile = [...file]
              CopyFile.push({ title })
              setFile(CopyFile)

              const CopyTask = [...task]
              CopyTask.push({ details: suggestion })
              setTask(CopyTask)
            } else {
              // Update existing suggestion with new level
              setTask([{ details: suggestion }])
            }
            
            setSelectedLevel(efficiencyLevel)
          }
        } else {
          const error = await response.json()
          alert('Error: ' + (error.error || 'Failed to generate optimization'))
        }
      } catch (err) {
        alert('Error: ' + err.message)
      } finally {
        setLoading(false)
      }
    }

    const clearOptimization = () => {
      setDetails('')
      setTask([])
      setFile([])
      setSelectedLevel(null)
      setOptimizationStats({
        total_suggestions: 0,
        avg_improvement: 0,
        critical_issues: 0,
        performance_gain: 2.5
      })
      // Clear saved optimization from localStorage
      localStorage.removeItem('optimizer_task')
      localStorage.removeItem('optimizer_file')
      localStorage.removeItem('optimizer_level')
      localStorage.removeItem('optimizer_stats')
      window.dispatchEvent(new CustomEvent('optimizationUpdated', { detail: {
        total_suggestions: 0,
        avg_improvement: 0,
        critical_issues: 0,
        performance_gain: 2.5
      }}))
    }

  return (
    <div className='m-10 flex flex-row justify-between gap-10 text-gray-300 px-30 py-10'>
      <div className='flex-col w-1/3 gap-5 justify-between bg-gray-950 border-1 border-gray-500 rounded-2xl p-5'>

         <div className=' flex flex-row items-center gap-3'>
          <div><CodeXml color="#7e99ed" strokeWidth={1.75}  className=' -mt-5'/></div>
          <div className='font-bold text-2xl tracking-wide py-3 mb-6 text-gray-300'>
          <h1>Paste Code to Optimiz</h1>
         </div>
         </div>

         <div className='flex flex-col gap-5 justify-between border-white rounded-md'>
  
          <div className=' flex flex-row items-center justify-between gap-4'>
            <div className=' w-1/3 '>
              <input type="text" placeholder='File Name' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-700 border-2 rounded-md hover:border-blue-400 transition w-full' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
            </div>
            <div className=' w-1/3 flex items-center font-medium text-lg text-gray-500 tracking-wide gap-2'>
              <label htmlFor="language">Language:</label>
              <select 
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className='bg-gray-950 text-gray-300 w-24'
              >
                <option value="Python">Python</option>
                <option value="C">C</option>
                <option value="C++">C++</option>
              </select>
            </div>
            <div className='w-1/3 flex items-center justify-end'>
              <input 
                type="file" 
                id="fileInput"
                accept=".py,.java,.c,.cpp,.txt,.js,.ts"
                onChange={handleFileUpload}
                className='hidden'
              />
              <button 
                type="button"
                onClick={() => document.getElementById('fileInput').click()}
                className='px-3 py-1.5 font-semibold text-md tracking-wide rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 border-2 border-blue-500 text-white flex flex-row items-center justify-center gap-2 transition-all duration-300'
              >
                <Upload strokeWidth={2} size={20} />
                <span>Browse</span>
              </button>
            </div>
          </div>
  
          <textarea placeholder='Paste Your Code . . . ' className='bg-gray-950 px-5 py-2 font-semibold text-lg tracking-wide border-gray-700 rounded-md border-1 h-80' value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <div className='flex flex-row items-center justify-between '>
            <button 
              type="button"
              onClick={generateOptimization}
              disabled={loading}
              className=' text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-xl w-180 text-center bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 flex flex-row items-center justify-center gap-3 disabled:opacity-50 transition-all duration-300'
            >
              <div><Zap color="#ffffff" strokeWidth={1.75} /></div>
              <div><h1>{loading ? 'Generating...' : 'Generated Optimize Suggestion'}</h1></div>
            </button>
            <button 
              type="button"
              onClick={clearOptimization}
              className=' border-0 bg-gray-700 hover:bg-red-600 rounded-md py-2 px-3 transition-all cursor-pointer'
              title="Clear"
            >
              <Trash2 color="#a6a6a6" strokeWidth={1.5} />
            </button>
          </div>

          </div>
      </div>

      <div className=' flex flex-wap flex-col justify-start p-2 w-2/3 h-150 gap-2 bg-gray-950 border-1 border-gray-500 rounded-2xl p-5'>
  
        <div className='font-bold text-xl tracking-wide mb-2'>Optimize Suggestion</div>

        {task.length > 0 && (
          <div className='flex flex-row gap-2 mb-4'>
            <button
              onClick={() => generateOptimization('Basic')}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedLevel === 'Basic'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-gray-600 hover:border-blue-500'
              } disabled:opacity-50`}
            >
              Basic
            </button>
            <button
              onClick={() => generateOptimization('Standard')}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedLevel === 'Standard'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-gray-600 hover:border-blue-500'
              } disabled:opacity-50`}
            >
              Standard
            </button>
            <button
              onClick={() => generateOptimization('Industrial')}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                selectedLevel === 'Industrial'
                  ? 'bg-blue-600 text-white border-2 border-blue-500'
                  : 'bg-gray-800 text-gray-300 border-2 border-gray-600 hover:border-blue-500'
              } disabled:opacity-50`}
            >
              Industrial
            </button>
          </div>
        )}
  
        <div className='border-2 border-gray-800 rounded-md w-full h-[94%] p-2 bg-gray-950 overflow-y-auto'>
          <div className=''>
          {file.map(function(elem,idx){
            return <div key={idx} className='font-bold text-xl tracking-wide'>{elem.title}</div>
          })}
        </div>
          
          <div className='max-h-[400px] overflow-y-auto space-y-4 h-[90%] '>
               {task.map(function(elem, idx) {
                  return (
                <div 
                 key={idx} 
                 className='p-4 rounded-xl break-words whitespace-pre-wrap'>
                  <h3>{elem.details}</h3>
                </div>
                 )
               })}
           </div>

        </div>
  
        </div>
        
    </div>
  )
}

export default Terminal4