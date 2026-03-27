import React from 'react'
import {Bug} from 'lucide-react'
import {CircleCheckBig} from 'lucide-react'
import {Zap} from 'lucide-react'
import {Radar} from 'lucide-react'
import {ChartNoAxesCombined} from 'lucide-react'

const Dasboard2 = () => {

    const stats = [
        { title: "Total Errors", value: 24, Logo: <Bug color="#f04c4c" strokeWidth={1.25} />},
        { title: "Resolved", value: 18, Logo: <CircleCheckBig color="#4cf05f" strokeWidth={1.25} /> },
        { title: "Critical", value: 2, Logo: <Zap color="#b335ed" strokeWidth={1.25} /> },
        { title: "Quality", value: "75%", Logo: <Radar color="#638afd" strokeWidth={1.25} /> },
        { title: "Improvement", value: "75%", Logo: <ChartNoAxesCombined color="#4cf05f" strokeWidth={1.25} /> },
    ];

    

    const errors = [
        { name: "TypeError", count: 8 },
        { name: "ReferenceError", count: 6 },
        { name: "SyntaxError", count: 5 },
        { name: "NullPointerException", count: 5 },
    ];

    const mastered = [
        "Error Handling",
        "Null Reference Errors",
        "Async/Await",
        "React Hooks",
        "Type Safety",
    ];

    const learning = [
        "Memory Management",
        "Performance Optimization",
        "Design Patterns",
        "Testing",
    ];

    

  return (

    <div className=' bg-amber flex flex-col items-center justify-between gap-10'>

    <div className='flex flex-col items-center justify-between mt-10 px-20  w-full gap-2 bg-green'>
      <div className=' flex flex-row items-center justify-between w-300  gap-2 -ml-10 '>
        <div className='w-240 flex flex-col items-center justify-between gap-2 bg-amber'>


        <div className=" min-h-screen text-white p-6">
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-6">
                {stats.map((item, i) => (
                    <div className=' flex flex-row items-center justify-between gap-2 bg-gray-800 border border-gray-400 rounded-xl p-4 
                        hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg 
                        transition-all duration-300'>
                        <div>{item.Logo}</div>
                        <div className=' flex flex-col items-center justify-between gap-1'>
                        <div
                        key={i}>
                        <p className="text-sm text-gray-400 tracking-wide">{item.title}</p>
                        <h2 className="text-2xl font-bold mt-2 tracking-wide">{item.value}</h2>
                    </div>
                    </div>
                    </div>
                ))}
            </div>

            
            <div className="grid md:grid-cols-3 gap-6">
                
                <div
                    className="bg-gray-800 border border-gray-400 rounded-xl p-6 
                hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 
                transition-all duration-300 flex flex-col items-center"
                >
                    <p className="text-gray-400 mb-4">Code Quality Score</p>

                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-700"></div>

                        <div
                            className="absolute inset-0 rounded-full border-8 border-blue-500 border-t-transparent rotate-[270deg]"
                            style={{ clipPath: "inset(0 0 25% 0)" }}
                        ></div>

                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                            75%
                        </div>
                    </div>

                    <p className="text-green-400 mt-4 text-sm">↑ Keep going strong!</p>
                </div>

                
                <div
                    className="bg-gray-800 border border-gray-400 rounded-xl p-6 
                hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 
                transition-all duration-300"
                >
                    <p className="text-gray-400 mb-4">Common Error Types</p>

                    {errors.map((err, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span>{err.name}</span>
                                <span>x{err.count}</span>
                            </div>

                            <div className="w-full bg-gray-700 h-2 rounded">
                                <div
                                    className="h-2 rounded bg-gradient-to-r from-blue-400 to-blue-600"
                                    style={{ width: `${err.count * 10}%` }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>

               
                <div className="bg-gray-800 border border-gray-400 rounded-xl p-6 hover:border-blue-500 transition-all duration-300 h-56 flex flex-col justify-between">
                   
                    <p className="text-gray-400 text-sm">Severity Breakdown</p>

                    
                    <div className="grid grid-cols-4 text-center">
                        {[
                            { val: 8, label: "Low" },
                            { val: 10, label: "Medium" },
                            { val: 4, label: "High" },
                            { val: 2, label: "Critical" },
                        ].map((item, i) => (
                            <div key={i}>
                                <p className="text-lg font-semibold text-gray-300">{item.val}</p>
                                <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
               
                <div
                    className="bg-gray-800 border border-gray-400 rounded-xl p-6 
                hover:border-blue-500 transition-all duration-300"
                >
                    <p className="text-gray-400 mb-4">Topics Mastered</p>

                    {mastered.map((item, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center mb-3 bg-gray-900 p-3 rounded-lg border border-gray-700"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                <span>{item}</span>
                            </div>

                            <span className="text-xs bg-green-900 text-green-400 px-2 py-1 rounded">
                                Mastered
                            </span>
                        </div>
                    ))}
                </div>

                
                <div
                    className="bg-gray-800 border border-gray-400 rounded-xl p-6 
                hover:border-blue-500 transition-all duration-300"
                >
                    <p className="text-gray-400 mb-4">Recommended Focus Areas</p>

                    {learning.map((item, i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center mb-3 bg-gray-900 p-3 rounded-lg border border-gray-700"
                        >
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                                <span>{item}</span>
                            </div>

                            <span className="text-xs bg-purple-900 text-purple-400 px-2 py-1 rounded">
                                To Learn
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        
      </div>
    </div>
    
    </div>

    

    </div>
  )
}

export default Dasboard2