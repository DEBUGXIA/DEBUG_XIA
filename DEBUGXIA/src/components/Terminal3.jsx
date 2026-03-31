import React, { useState } from 'react'
import { Play, CodeXml, Trash2 } from 'lucide-react'

const Terminal3 = () => {

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
      <form className='flex-col w-2/3 gap-5 justify-between bg-gray-900 border-1 border-gray-500 rounded-2xl p-5' onSubmit={(e) =>{SubmitHandler(e)}} action="">

         <div className=' flex flex-row items-center gap-3'>
          <div><CodeXml color="#7e99ed" strokeWidth={1.5}  className=' -mt-5'/></div>
          <div className='font-bold text-2xl tracking-wide py-3 mb-6 text-gray-300'>
          <h1>Code Editor</h1>
         </div>
         </div>

         <div className='flex flex-col gap-5 justify-between border-white rounded-md'>
  
          <div className=' flex flex-row items-center justify-between'>
            <div className=' w-1/2 '>
              <input type="text" placeholder='File Name' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-gray-700 border-2 rounded-md hover: border-blue-400 transition w-90' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
            </div>
            <div className=' mr-5 w-1/2 flex items-center font-medium text-lg text-gray-500 tracking-wide'>
            <label for="cars">Choose Your Language :</label>

              <select name="cars" id="cars"  className='bg-gray-900 text-gray-300 w-20'>
                <option value="volvo">Python</option>
                <option value="saab">Java</option>
                <option value="mercedes">C</option>
                <option value="audi">C++</option>
              </select>
              </div>
          </div>
  
          <textarea placeholder='Your Code . . . ' name="" id=""className='bg-gray-900 px-5 py-2 font-semibold text-lg tracking-wide border-gray-700 rounded-md border-1 h-80'value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <div className='flex flex-row items-center justify-between '>
            <button className=' text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-xl w-180 text-center bg-gradient-to-r from-blue-500 to-cyan-400 flex flex-row items-center justify-center'>
              <div><Play strokeWidth={1.75} /></div>
              <div><h1>Execute Code</h1></div>
            </button>
            <div className=' border-0 bg-gray-700 rounded-md py-2 px-3'><Trash2 color="#a6a6a6" strokeWidth={1.5} /></div>
          </div>

          </div>
      </form>

      <div className=' flex flex-wap flex-col justify-start p-2 w-1/3 h-150 gap-2 bg-gray-900 border-1 border-gray-500 rounded-2xl p-5'>
  
        <div className='font-bold text-xl tracking-wide mb-2'>Execution History</div>
  
        <div className='border-2 border-gray-800 rounded-md w-full h-[94%] p-2 bg-gray-900'>
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

export default Terminal3