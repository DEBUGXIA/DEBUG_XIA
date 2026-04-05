import React from 'react'
import {NotebookPen} from 'lucide-react'
import {UserRoundPen} from 'lucide-react'
import {Link2} from 'lucide-react'
import { useState, useRef } from "react"

import {Link} from 'react-router-dom'


const Edit_Profile = () => {

  const [image, setImage] = useState("/public/User.jpeg")
  const fileInputRef = useRef(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setImage(preview)
    }
  }

  const handleRemove = () => {
    setImage("/public/Remove.svg")
  }

  return (
    <div className=' flex flex-row items-center gap-8 w-full h-150 px-10'>

      <div className=' flex flex-col items-center justify-between gap-2 w-1/4 -mt-45 '>
          <div>
            <img src={image} alt="" className=' w-70 h-70 border-2 border-gray-500 rounded-full'/>
          </div>
          <div className="flex flex-col items-center gap-4">

      <input  type="file"  accept="image/*"  ref={fileInputRef}  onChange={handleImageChange} className="hidden"/>

      <div className="flex gap-3">
        <button onClick={() => fileInputRef.current.click()} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm hover:bg-gray-700">Upload new</button>

        <button onClick={handleRemove}className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100">Remove</button>
      </div>
    </div>
        </div>

        <div className=' flex flex-col items-start gap-3 w-3/4'>
          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <input type="text" placeholder='Enter UserName' className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><UserRoundPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <input type="text" placeholder='Enter Mail ID' className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><NotebookPen color="#ffffff" strokeWidth={1.25} /></div>
            <div>
              <textarea placeholder='Enter Your Boi . . . ' name="" id=""className='bg-gray-900 px-5 py-2 font-normal text-lg tracking-wide border-gray-500 rounded-xl border-1  w-150 text-gray-400'></textarea>
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5 bg-gray-900 px-4 py-2 font-semibold text-lg tracking-wide border-gray-500 rounded-xl border-1  w-150 -mr-3 ml-6'>
            <label for="cars" className=' text-gray-400 font-normal text-lg tracking-wide'>Pronouns :</label>

              <select name="cars" id="cars"  className='bg-gray-900 text-gray-400 w-35 font-normal text-lg'>
                <option >Don't Specify</option>
                <option >They/Them</option>
                <option >She/Her</option>
                <option >He/Him</option>
                <option >Custom</option>
              </select>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <input type="text" placeholder='Enter Url 1' className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <input type="text" placeholder='Enter Url 2' className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' />
            </div>
          </div>

          <div className=' flex flex-row items-center justify-between gap-1.5'>
            <div><Link2 strokeWidth={1.25} /></div>
            <div>
              <input type="text" placeholder='Enter Url 3' className='px-4 py-1.5 text-gray-400 bg-gray-900 font-normal text-lg tracking-wide border-gray-500 border-1 rounded-xl w-150' />
            </div>
          </div>

          <div className=' bg-green-600 border-2 border-white rounded-xl text-white py-1 px-4 tracking-wide mt-3'>
            <h1 className='font-medium text-lg tracking-wide'><Link to='/Profile'>Save</Link></h1>
          </div>
        </div>

    </div>   
  )
}

export default Edit_Profile