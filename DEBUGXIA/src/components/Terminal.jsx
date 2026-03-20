import React, { useState } from 'react'
import Icon from './icon/icon'

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
      <div className='p-20  text-white lg:flex justify-between gap-10 '>
  
        <form className=' flex-col lg:w-1/2 gap-5 justify-between border-white rounded-md py-2' onSubmit={(e) =>{SubmitHandler(e)}}>

        <div className='font-bold text-2xl tracking-wide py-3'><Icon/>Your Coding <span className='bg-[url(public/bg.svg)] text-3xl bg-clip-text text-transparent'>Terminal</span></div>
  
          <div className='flex flex-col gap-5 justify-between border-white rounded-md'>
  
          <input type="text" placeholder='Enter File Name' className='px-5 py-2 text-white font-semibold text-lg tracking-wide border-white border-1 rounded-md' value={title} onChange={(e) =>{setTitle(e.target.value)}}/>
  
          <textarea placeholder='Enter Your Code . . . ' name="" id=""className='px-5 py-2 font-semibold text-lg tracking-wide border-white rounded-md border-1 h-60'value={details} onChange={(e) => {setDetails(e.target.value)}}></textarea>
  
          <div className='flex items-center justify-center'>
            <button className=' text-white px-4 py-2 font-semibold text-lg tracking-wide rounded-2xl w-50 text-center bg-[url(public/btn.svg)] bg-cover transition delay-150 duration-300 ease-in-out'>Run Your Code</button>
          </div>
          </div>
        </form>
        <div className=' flex flex-wap flex-col justify-start p-2 w-1/2 h-150 gap-2'>
  
        <div className='font-bold text-2xl tracking-wide'><Icon/>Your Coding <span className='bg-[url(public/bg.svg)] text-3xl bg-clip-text text-transparent'>Teacher</span></div>
  
        {file.map(function(elem,idx){
            return <div key={idx} className='font-bold text-xl tracking-wide'>{elem.title}</div>
          })}
          
          {task.map(function(elem,idx){
            return <div key={idx} className='rounded-2xl bg-black border-3 border-white w-full h-[50%] p-2'>
              <h3>{elem.details}</h3>
            </div>
          })}
  
        </div>
      

      </div>
    )
  
  }
  

export default Terminal