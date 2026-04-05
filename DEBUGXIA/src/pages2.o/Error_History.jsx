import React, { useState, useEffect } from 'react'
import { Search, BadgeAlert, X } from 'lucide-react'
import { errorAPI } from '../services/api'

const History = () => {
  const options = ["All Severity", "low", "medium", "high", "critical"];
  const Status = ["All Status", "resolved", "unresolved"]

  const [selected, setSelected] = useState("All Severity");
  const [open, setOpen] = useState(false);
  const [Choose, setChoose] = useState("All Status")
  const [Click, setClick] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [filteredErrors, setFilteredErrors] = useState([])

  useEffect(() => {
    fetchErrors()
  }, [])

  const fetchErrors = async () => {
    setLoading(true)
    try {
      const data = await errorAPI.getErrors()
      setErrors(Array.isArray(data) ? data : [])
      applyFilters(Array.isArray(data) ? data : [], selected, Choose, searchTerm)
    } catch (error) {
      console.error('Error fetching errors:', error)
      setErrors([])
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = (errorList, severity, status, search) => {
    let filtered = errorList

    if (severity !== "All Severity") {
      filtered = filtered.filter(e => e.severity === severity)
    }

    if (status !== "All Status") {
      filtered = filtered.filter(e => e.status === status)
    }

    if (search) {
      filtered = filtered.filter(e =>
        e.error_message.toLowerCase().includes(search.toLowerCase()) ||
        e.error_type.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFilteredErrors(filtered)
  }

  const handleSeverityChange = (severity) => {
    setSelected(severity)
    setOpen(false)
    applyFilters(errors, severity, Choose, searchTerm)
  }

  const handleStatusChange = (status) => {
    setChoose(status)
    setClick(false)
    applyFilters(errors, selected, status, searchTerm)
  }

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    applyFilters(errors, selected, Choose, term)
  }

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#3b82f6',
      medium: '#f59e0b',
      high: '#ff6b6b',
      critical: '#dc2626'
    }
    return colors[severity] || '#gray'
  }

  const markResolved = async (errorId) => {
    try {
      await errorAPI.markResolved(errorId)
      fetchErrors()
    } catch (error) {
      console.error('Error marking as resolved:', error)
    }
  }

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
            <div className=' flex flex-row items-start gap-1 w-full border-1 border-gray-400 rounded-xl bg-gray-900 px-5 py-2 '>
              <div><Search color="#c0bec1" strokeWidth={0.75} /></div>
              <div>
                <input
                  name="search"
                  id="Search"
                  placeholder="Search Error . . ."
                  className=' w-200 bg-gray-900 text-white outline-none'
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
            </div>
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
                      onClick={() => handleSeverityChange(item)}
                      className="px-4 py-2 text-gray-200 hover:bg-gray-800 cursor-pointer">
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
                      onClick={() => handleStatusChange(item)}
                      className="px-4 py-2 text-gray-200 hover:bg-gray-800 cursor-pointer">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className=' flex flex-col items-center justify-between border-0 w-full max-h-96 overflow-y-auto'>
          {loading ? (
            <div className=' flex flex-col items-center justify-center w-full py-10'>
              <p className='text-gray-400'>Loading errors...</p>
            </div>
          ) : filteredErrors.length === 0 ? (
            <div className=' flex flex-col items-center justify-center w-full py-10'>
              <div className=' flex flex-col items-center justify-between gap-2'>
                <div><BadgeAlert color="#878787" strokeWidth={1.5} /></div>
                <div><h1 className=' text-xl text-gray-500 font-medium'>No errors logged yet.</h1></div>
              </div>
            </div>
          ) : (
            <div className='w-full space-y-3'>
              {filteredErrors.map((error) => (
                <div key={error.id} className='bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition'>
                  <div className='flex flex-row items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3'>
                        <div
                          className='w-3 h-3 rounded-full'
                          style={{ backgroundColor: getSeverityColor(error.severity) }}
                        />
                        <h3 className='text-white font-semibold'>{error.error_type}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          error.status === 'resolved' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                        }`}>
                          {error.status}
                        </span>
                      </div>
                      <p className='text-gray-300 text-sm mt-2'>{error.error_message}</p>
                      {error.file_path && (
                        <p className='text-gray-400 text-xs mt-1'>
                          {error.file_path}:{error.line_number}
                        </p>
                      )}
                      {error.ai_suggestion && (
                        <div className='bg-blue-900/30 border border-blue-700 rounded p-2 mt-2'>
                          <p className='text-blue-200 text-xs'>
                            <strong>AI Suggestion:</strong> {error.ai_suggestion}
                          </p>
                        </div>
                      )}
                    </div>
                    {error.status === 'unresolved' && (
                      <button
                        onClick={() => markResolved(error.id)}
                        className='ml-4 px-3 py-1 bg-green-900 hover:bg-green-800 text-green-200 text-xs rounded transition'
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                  <p className='text-gray-500 text-xs mt-2'>
                    {new Date(error.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History