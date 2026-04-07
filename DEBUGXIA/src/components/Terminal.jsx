import React, { useState } from 'react'
import { Play, Upload, Trash2 } from 'lucide-react'

const Terminal = () => {

    const [title, setTitle] = useState('')
        const [details, setDetails] = useState('')
        const [task, setTask] = useState([])
        const [file, setFile] = useState([])
        const [language, setLanguage] = useState('Python')
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState('')
        
        // Ollama Mistral setup
        const OLLAMA_API_URL = 'http://localhost:11434/api/generate'
        
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

          const clearHandler = () => {
            setTask([])
            setFile([])
          }

          const analyzeHandler = () => {
            if (details.trim() === '') {
              alert('Please enter code to analyze')
              return
            }
            
            analyzeWithAI()
          }

          const analyzeWithAI = async () => {
            setLoading(true)
            setError('')
            
            try {
              const prompt = `Analyze this ${language} code and provide:\n1. Error analysis\n2. Improvements\n3. Best practices\n\nCode:\n${details}`
              
              const response = await fetch(OLLAMA_API_URL, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  model: 'mistral',
                  prompt: prompt,
                  stream: false
                })
              })
              
              if (!response.ok) {
                throw new Error('Failed to connect to Ollama. Make sure Ollama is running: ollama serve')
              }
              
              const data = await response.json()
              const analysis = data.response
              
              const CopyTask = [...task]
              CopyTask.push({
                task: details, 
                details: analysis
              })
            
              const CopyFile = [...file]
              CopyFile.push({
                file: title, 
                title: title || 'Untitled'
              })
              
              setTask(CopyTask)
              setFile(CopyFile)
              setLoading(false)
            } catch (err) {
              setError('Error: ' + err.message)
              setLoading(false)
            }
          }

          const handleFileUpload = (e) => {
            const uploadedFile = e.target.files?.[0]
            if (uploadedFile) {
              // Get file extension
              const fileName = uploadedFile.name
              const fileExtension = fileName.split('.').pop().toLowerCase()
              
              // Map extension to language
              const extensionMap = {
                'py': 'Python',
                'java': 'Java',
                'c': 'C',
                'cpp': 'C++',
                'cc': 'C++',
                'cxx': 'C++',
                'h': 'C',
                'hpp': 'C++',
                'js': 'Python',
                'ts': 'Python',
                'jsx': 'Python',
                'tsx': 'Python',
                'txt': 'Python'
              }
              
              const detectedLanguage = extensionMap[fileExtension] || 'Python'
              setLanguage(detectedLanguage)
              console.log(`File extension: .${fileExtension} -> Language: ${detectedLanguage}`)
              
              // Read file content
              const reader = new FileReader()
              reader.onload = (event) => {
                const fileContent = event.target?.result
                if (typeof fileContent === 'string') {
                  setDetails(fileContent)
                  setTitle(fileName.split('.')[0])
                  console.log('File uploaded successfully:', fileName)
                }
              }
              reader.onerror = () => {
                alert('Error reading file. Please try again.')
              }
              reader.readAsText(uploadedFile)
            }
          }

  return (
    <div className='m-10 flex flex-row justify-between gap-10 text-gray-300 px-30 py-10'>
      <form className='flex-col w-1/2 gap-5 justify-between py-2' onSubmit={(e) =>{SubmitHandler(e)}} action="">

         <div className='font-bold text-2xl tracking-wide py-3 mb-6'>Your Coding <span className='bg-gradient-to-r from-blue-500 to-sky-300 bg-clip-text text-transparent text-3xl'>Terminal</span></div>

         <div className='flex flex-col gap-5 justify-between border-gray-500 rounded-md'>
  
          <div className=' flex flex-row items-center justify-between gap-4'>
            <div className=' w-1/3'>
              <input type="text" placeholder='File Name' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-300 border-2 rounded-md w-full' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
            </div>
            <div className=' w-1/3 flex items-center font-medium text-lg text-gray-300 tracking-wide gap-2'>
            <label htmlFor="cars">Choose Your Language :</label>

              <select name="cars" id="cars" value={language} onChange={(e) => setLanguage(e.target.value)} className=' text-white w-24'>
                <option value="Python" className=' bg-gray-900'>Python</option>
                <option value="Java" className=' bg-gray-900'>Java</option>
                <option value="C" className=' bg-gray-900'>C</option>
                <option value="C++" className=' bg-gray-900'>C++</option>
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
                className='px-6 py-2 font-semibold text-lg tracking-wide rounded-xl bg-gray-800 hover:bg-gray-700 border-2 border-gray-600 hover:border-blue-500 text-white flex flex-row items-center justify-between gap-2 transition-all duration-300 whitespace-nowrap'
              >
                <Upload strokeWidth={1.75} size={20} />
                <span>Browse File</span>
              </button>
            </div>
          </div>
  
          <textarea placeholder='Your Code . . . ' name="" id=""className='bg-gray-950 px-5 py-2 font-semibold text-lg tracking-wide border-gray-500 rounded-lg border-2 h-60'value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <div className='flex items-center justify-center gap-4'>
            <button 
              type="button"
              onClick={analyzeHandler}
              disabled={loading}
              className='text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-2xl w-50 text-center bg-gradient-to-r from-blue-500 to-sky-300 flex flex-row items-center justify-between gap-2 hover:shadow-lg transition-all duration-300 disabled:opacity-50'
            >
              <div><Play strokeWidth={1.75} /></div>
              <div><h1>{loading ? 'Analyzing...' : 'Analyze Code'}</h1></div>
            </button>
          </div>

          </div>
      </form>

      <div className=' flex flex-wap flex-col justify-start p-2 w-1/2 h-150 gap-2'>
  
        <div className='font-bold text-2xl tracking-wide mb-9 flex flex-row items-center justify-between'>
          <div>Your Coding <span className='bg-gradient-to-r from-blue-500 to-sky-300 bg-clip-text text-transparent text-3xl '>Teacher</span></div>
          <button 
            type="button"
            onClick={clearHandler}
            className='text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-2xl w-40 text-center bg-gray-700 hover:bg-red-600 border-2 border-gray-600 hover:border-red-500 flex flex-row items-center justify-between gap-2 transition-all duration-300'
          >
            <div><Trash2 strokeWidth={1.75} /></div>
            <div><h1>Clear</h1></div>
          </button>
        </div>
  
        <div className='rounded-2xl  border-2 border-gray-500 w-full h-[54%] p-2 bg-gray-950'>
          {error && (
            <div className='p-4 rounded-xl bg-red-900 border border-red-700 text-red-200 mb-4'>
              <p className='text-sm'>{error}</p>
            </div>
          )}
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

export default Terminal