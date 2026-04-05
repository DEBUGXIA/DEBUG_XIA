import React, { useState } from 'react'
import { Search, BadgeAlert } from 'lucide-react'

const History = () => {

  const options = ["All Severity", "Low", "Medium", "High", "Critical"];

  const [selected, setSelected] = useState("All Severity");
  const [open, setOpen] = useState(false);


  const Status = ["All Status", "Resolved", "Unresolved"]
  const [Choose, setChoose] = useState("All Status")
  const [Click, setClick] = useState(false)

  return (
    <div className=' flex flex-col justify-between mt-18 gap-8 w-full mr-20'>

        <div className=' flex flex-col items-center justify-between gap-2'>
            <div className=''>
                <h1 className='bg-gradient-to-r from-blue-600 to-sky-300 bg-clip-text text-transparent tracking-wide font-bold text-5xl'>Error History</h1>
            </div>
            <div>
                <p className='font-medium text-lg text-gray-300 tracking-wide mt-5'>Browse and manage your coding errors with AI insights.</p>
            </div>
        </div>

        <div className=' flex flex-col items-center justify-between gap-3 mr-10 mt-10 ml-30'>

          <div className=' flex flex-row items-center justify-between gap-5 w-full mr-10'>

            <div className=' w-2/3'>
              <search className=' flex flex-row items-start gap-1 w-full  border-1 border-gray-400 rounded-xl bg-gray-900 px-5 py-2 '>
                <div><Search color="#c0bec1" strokeWidth={0.75} /></div>
                <div>
                  <form className=' w-200'>
                  <input name="Sraech" id="Search" placeholder="Search Error . . ." className=' w-200'/>
                </form>
                </div>
              </search>
            </div>

            <div className="flex flex-row items-start justify-between gap-2 w-1/3 mr-15">
  
                <div className=" flex flex-row w-1/2">
                  <button onClick={() => setOpen(!open)} className="bg-gray-900 text-white border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:border-blue-500 transition w-50">
                    {selected}<span className="text-gray-400">▼</span>
                  </button>
                  {open && (
                  <div className="absolute mt-2 w-50 bg-gray-900 rounded-md shadow-lg z-50">
                    {options.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                    setSelected(item);
                    setOpen(false);
                    }}
                    className="px-4 py-2 text-gray-200 hover:bg-gray-900 cursor-pointer">
                    {item}
                  </div>
                   ))}
                  </div>
                   )}
                </div>

                <div className=" flex flex-row w-1/2">
                  <button onClick={() => setClick(!Click)} className="bg-gray-900 text-white border border-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:border-blue-500 transition w-50">
                    {Choose}<span className="text-gray-400">▼</span>
                  </button>
                  {Click && (
                  <div className="absolute mt-2 w-50 bg-gray-900 rounded-md shadow-lg z-50">
                    {Status.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                    setChoose(item);
                    setClick(false);
                    }}
                    className="px-4 py-2 text-gray-200 hover:bg-gray-900 cursor-pointer">
                    {item}
                  </div>
                   ))}
                  </div>
                   )}
                </div>

            </div>


          </div>

          <div className=' flex flex-col items-center justify-between border-0 h-200'>
            <div className=' flex flex-col items-center justify-center'>
              <div className=' flex flex-col items-center justify-between gap-2 mt-20'>
              <div><BadgeAlert color="#878787" strokeWidth={1.5} /></div>
              <div><h1 className=' text-xl text-gray-500 font-medium'>No errors logged yet. Connect the VS Code extension to start tracking.</h1></div>
            </div>
            </div>
          </div>

        </div>

    </div>
  )
}

export default History