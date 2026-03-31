import React, { useState } from 'react'
import { Play } from 'lucide-react'

const Terminal = () => {

    const [title, setTitle] = useState('')
        const [details, setDetails] = useState('')
        const [task, setTask] = useState([])
        const [file, setFile] = useState([])
        
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

  return (
    <div className='m-10 flex flex-row justify-between gap-10 text-gray-300 px-30 py-10'>
      <form className='flex-col w-1/2 gap-5 justify-between py-2' onSubmit={(e) =>{SubmitHandler(e)}} action="">

         <div className='font-bold text-2xl tracking-wide py-3 mb-6'>Your Coding <span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-3xl'>Terminal</span></div>

         <div className='flex flex-col gap-5 justify-between border-gray-500 rounded-md'>
  
          <div className=' flex flex-row items-center justify-between'>
            <div className=' w-1/2'>
              <input type="text" placeholder='File Name' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-500 border-1 rounded-md' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
            </div>
            <div className=' mr-5 w-1/2 flex items-center font-medium text-lg text-gray-500 tracking-wide'>
            <label for="cars">Choose Your Language :</label>

              <select name="cars" id="cars"  className='bg-gray-900 text-white w-20'>
                <option value="volvo">Python</option>
                <option value="saab">Java</option>
                <option value="mercedes">C</option>
                <option value="audi">C++</option>
              </select>
              </div>
          </div>
  
          <textarea placeholder='Your Code . . . ' name="" id=""className='bg-gray-900 px-5 py-2 font-semibold text-lg tracking-wide border-gray-500 rounded-md border-1 h-60'value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <div className='flex items-center justify-center '>
            <button className=' text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-2xl w-50 text-center bg-gradient-to-r from-blue-500 to-cyan-400 flex flex-row items-center justify-between'>
              <div><Play strokeWidth={1.75} /></div>
              <div><h1>Analyze Code</h1></div>
            </button>
          </div>

          </div>
      </form>

      <div className=' flex flex-wap flex-col justify-start p-2 w-1/2 h-150 gap-2'>
  
        <div className='font-bold text-2xl tracking-wide mb-9'>Your Coding <span className='bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent text-3xl'>Teacher</span></div>
  
        <div className='rounded-2xl  border-1 border_gray-500 w-full h-[54%] p-2 bg-gray-900'>
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