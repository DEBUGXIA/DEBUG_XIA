import React from 'react'
import { Bug, CircleCheckBig, Zap, Disc2, ChartLine, CircleAlert, ChartColumn, Layers, BookOpen, CalendarDays, Info } from 'lucide-react'

const Dashboard2 = () => {

  const dashboardData = {
  stats: [
    { title: "Total Errors", value: 24, Logo: <Bug color="#e67f7f" strokeWidth={1.5} /> },
    { title: "Resolved", value: 18, Logo: <CircleCheckBig color="#86e67f" strokeWidth={1.5} /> },
    { title: "Critical", value: 2, Logo: <Zap color="#c756f0" strokeWidth={1.5} /> },
    { title: "Quality", value: 75, unit: "%", Logo: <Disc2 color="#685eed" strokeWidth={1.5} /> },
    { title: "Improvement", value: 75, unit: "%", Logo: <ChartLine color="#5eed68" strokeWidth={1.5} /> },
  ],
  errorTypes: [
    { name: "TypeError", count: 8 },
    { name: "ReferenceError", count: 6 },
    { name: "SyntaxError", count: 5 },
    { name: "NullPointerException", count: 5 },
  ],
  severity: [
    { label: "Low", value: 8 },
    { label: "Medium", value: 10 },
    { label: "High", value: 4 },
    { label: "Critical", value: 2 },
  ],
  mastered: [
    "Error Handling",
    "Null Reference Errors",
    "Async/Await",
    "React Hooks",
    "Type Safety",
  ],
  learning: [
    "Memory Management",
    "Performance Optimization",
    "Design Patterns",
    "Testing",
  ],
  weekly: [
    { day: "Mon", value: 40 },
    { day: "Tue", value: 25 },
    { day: "Wed", value: 55 },
    { day: "Thu", value: 30 },
    { day: "Fri", value: 15 },
    { day: "Sat", value: 5 },
    { day: "Sun", value: 20 },
  ],
  recentErrors: [
    {
      title: "TypeError",
      msg: "Cannot read property 'map' of undefined",
      level: "high",
    },
    {
      title: "ReferenceError",
      msg: "user is not defined",
      level: "critical",
    },
    {
      title: "SyntaxError",
      msg: "Unexpected token }",
      level: "medium",
    },
    {
      title: "TypeError",
      msg: "this.setState is not a function",
      level: "high",
    },
    {
      title: "NullPointerException",
      msg: "Null reference exception in module",
      level: "low",
    },
  ],
};

const Card = ({ children }) => (
  <div className="bg-gray-950 border border-gray-400 rounded-xl p-6 hover:border-blue-500 hover:shadow-blue-500/20 hover:shadow-lg transition-all duration-300">
    {children}
  </div>
);

const Badge = ({ level }) => {
  const map = {
    high: "bg-purple-900 text-purple-400",
    critical: "bg-red-900 text-red-400",
    medium: "bg-blue-900 text-blue-400",
    low: "bg-green-900 text-green-400",
  };
  return <span className={`text-xs px-3 py-1 rounded ${map[level]}`}>{level}</span>;
};

const { stats, errorTypes, severity, mastered, learning, weekly, recentErrors } =
    dashboardData;

  const maxWeekly = Math.max(...weekly.map((d) => d.value));
  const maxError = Math.max(...errorTypes.map((e) => e.count));


  
  return (
    <div className=" min-h-screen text-white p-6 space-y-6 p-10 mt-15">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((s, i) => (
          <Card key={i}>
            <div className=' flex flex-row items-center gap-3'>
              <div>{s.Logo}</div>
              <div className=' flex flex-col items-center'>
                <p className="text-sm text-gray-400">{s.title}</p>
            <h2 className="text-2xl font-bold mt-2">
              {s.value}
              {s.unit || ""}
            </h2>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-400 mb-4">Code Quality Score</p>
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 border-8 border-gray-700 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-blue-500 border-t-transparent rounded-full rotate-[270deg]" style={{ clipPath: "inset(0 0 25% 0)" }}></div>
            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
              {stats[3].value}%
            </div>
          </div>
        </Card>

        <Card>
          <div className=' flex flex-row items-center gap-2'>
            <div><CircleAlert color="#5e89ed" strokeWidth={1.5} className=' -mt-3' /></div>
            <div><p className="text-gray-400 mb-4">Common Error Types</p></div>
          </div>
          {errorTypes.map((e, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between text-sm">
                <span>{e.name}</span>
                <span>x{e.count}</span>
              </div>
              <div className="w-full bg-gray-700 h-2 rounded">
                <div
                  className="h-2 rounded bg-gradient-to-r from-blue-400 to-purple-500"
                  style={{ width: `${(e.count / maxError) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <div className=' flex flex-row items-center gap-2'>
            <div><ChartColumn color="#5e89ed" strokeWidth={1.5} className=' -mt-5' /></div>
          <p className="text-gray-400 mb-6">Severity Breakdown</p>
          </div>
          <div className="grid grid-cols-4 text-center">
            {severity.map((s, i) => (
              <div key={i}>
                <p className="text-lg font-semibold">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className=' flex flex-row items-center gap-3'>
            <div><Layers color="#5e89ed" strokeWidth={1.5} className='-mt-3'/></div>
          <p className="text-gray-400 mb-4">Topics Mastered</p>
          </div>
          {mastered.map((m, i) => (
            <div key={i} className="flex justify-between mb-3 bg-gray-900 p-3 rounded">
              <span>{m}</span>
              <span className="text-xs text-green-400">Mastered</span>
            </div>
          ))}
        </Card>

        <Card>
          <div className=' flex flex-row items-center gap-3'>
            <div><BookOpen color="#c953ea" strokeWidth={1.5} className='-mt-3'/></div>
          <p className="text-gray-400 mb-4">Recommended Focus Areas</p>
          </div>
          {learning.map((l, i) => (
            <div key={i} className="flex justify-between mb-3 bg-gray-900 p-3 rounded">
              <span>{l}</span>
              <span className="text-xs text-purple-400">To Learn</span>
            </div>
          ))}
        </Card>
      </div>

      <Card>
        <div className="flex justify-between mb-6">
          <div className=' flex flex-row items-center gap-3'>
            <div><CalendarDays color="#5378ea" strokeWidth={1.5} /></div>
            <p className="text-gray-400 text-sm">Weekly Activity</p>
          </div>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>
        <div className="flex items-end gap-3 h-32">
          {weekly.map((d, i) => (
            <div key={i} className="flex flex-col items-center w-full">
              <div
                className="w-full rounded bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ height: `${(d.value / maxWeekly) * 100}%` }}
              ></div>
              <span className="text-xs mt-2 text-gray-500">{d.day}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className=' flex flex-row items-center gap-3'> 
          <div><Info color="#ea5353" strokeWidth={1.5}  className='-mt-3'/></div>
          <p className="text-gray-400 mb-4">Recent Errors</p>
        </div>
        {recentErrors.map((e, i) => (
          <div key={i} className="flex justify-between items-center bg-gray-900 p-4 rounded mb-3">
            <div>
              <p className="font-semibold">{e.title}</p>
              <p className="text-sm text-gray-400">{e.msg}</p>
            </div>
            <Badge level={e.level} />
          </div>
        ))}
      </Card>
    </div>

  )
}

export default Dashboard2