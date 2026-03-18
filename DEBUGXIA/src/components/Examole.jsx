import React, { useState } from 'react'

const Examole = () => {
    
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
      <div className='p-10 bg-black h-screen text-white lg:flex justify-between gap-5'>
  
        <form className='flex flex-col lg:w-1/2 gap-5 justify-between border-white rounded-md' onSubmit={(e) =>{SubmitHandler(e)}}>
  
          <div className='flex flex-col gap-5 justify-between border-white rounded-md'>
  
          <input type="text" placeholder='Enter Notes Heading' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-white border-2 rounded-md' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
  
          <textarea placeholder='Enter Details' name="" id=""className='px-5 py-2 font-semibold text-lg tracking-wide border-white rounded-md border-2 'value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <button className='bg-white text-black px-5 py-2 font-semibold text-lg tracking-wide border-white rounded-md w-50 text-center'>Add Notes</button>
          </div>
        </form>
        <div className='flex flex-wap flex-col justify-between p-10 w-1/2 h-150 gap-5'>
  
        <div className='font-bold text-2xl tracking-wide'>Resent Notes</div>
  
        {file.map(function(elem,idx){
            return <div key={idx} className='font-bold text-xl tracking-wide'>{elem.title}</div>
          })}
          
          {task.map(function(elem,idx){
            return <div key={idx} className='rounded-2xl bg-black border-3 border-white w-full h-full p-5'>
              <h3>{elem.details}</h3>
            </div>
          })}
  
        </div>
      </div>
    )
  
  }
  

export default Examole