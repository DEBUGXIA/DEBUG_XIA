import React from "react";
import { Lightbulb, Brain, Zap, ChartNoAxesCombined, SearchCode, GraduationCap, Disc2, Globe, AlarmClock, Mail, Sparkles } from 'lucide-react'

const About = () => {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl shadow-2xl text-white px-6 py-12 mt-5">
      
      {/* Title */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">
          About DEBUGXIA
        </h1>
        <p className="text-gray-300 leading-relaxed">
          DEBUGXIA is an AI-powered intelligent developer assistant designed to transform how programmers understand, debug, and improve their code. 
          It combines real-time code monitoring, AI-driven analysis, and personalized learning insights into one powerful platform. 
          Integrated with VS Code, it explains errors in simple language and provides smart suggestions using RAG-based AI. 
          More than just a debugging tool, DEBUGXIA acts as a continuous learning system that helps developers grow while coding.
        </p>
      </div>

      {/* Features */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className=" flex flex-row items-center justify-center gap-5 max-w-5xl mx-auto mb-12">
          <div><Lightbulb color="#deec79" className="-mt-6"/></div>
          <h2 className="text-2xl font-semibold mb-6 text-center">What Makes DEBUGXIA Different?</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className=" flex flex-row items-center gap-3">
              <div><Brain color="#f297a4" className="-mt-2"/></div>
            <h3 className="font-semibold text-lg mb-2">Human-Like Understanding</h3>
            </div>
            <p className="text-gray-400">
              Converts complex errors into simple, human-readable explanations.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className=" flex flex-row items-center gap-3">
              <div><Zap color="#aaf297"  className="-mt-2"/></div>
              <h3 className="font-semibold text-lg mb-2">Real-Time Debugging</h3>
            </div>
            <p className="text-gray-400">
              Detects and explains errors instantly without breaking workflow.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className=" flex flex-row items-center gap-3">
              <div><ChartNoAxesCombined color="#97e7f2" className="-mt-2"/></div>
              <h3 className="font-semibold text-lg mb-2">Growth Analytics</h3>
            </div>
            <p className="text-gray-400">
              Tracks error patterns, coding habits, and improvement trends.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="flex flex-row items-center gap-3">
              <div><SearchCode color="#98eccc" className="-mt-2"/></div>
              <h3 className="font-semibold text-lg mb-2"> RAG Intelligence</h3>
            </div>
            <p className="text-gray-400">
              Uses advanced AI to deliver accurate, context-aware debugging insights.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg md:col-span-2">
            <div className=" flex flex-row items-center gap-3">
              <div><GraduationCap color="#98b8ec" className="-mt-2"/></div>
              <h3 className="font-semibold text-lg mb-2"> AI Coding Mentor</h3>
            </div>
            <p className="text-gray-400">
              Suggests best practices, optimizes code, and helps avoid repeated mistakes.
            </p>
          </div>

        </div>
      </div>

      {/* Vision */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className=" flex flex-row items-center justify-center gap-3">
          <div><Disc2 color="#ec98cd" strokeWidth={1.5} className="-mt-2"/></div>
          <h2 className="text-2xl font-semibold mb-4 text-center">Vision</h2>
        </div>
        <p className="text-gray-300 text-center">
          To create a future where every developer has access to an intelligent assistant 
          that not only fixes errors but teaches them how to think like a better programmer.
        </p>
      </div>

      {/* Impact */}
      <div className="max-w-5xl mx-auto mb-12">
        <div className=" flex flex-row items-center justify-center gap-3">
          <div><Globe color="#98b4ec" strokeWidth={1.5} className="-mt-5"/></div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Impact</h2>
        </div>

        <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
          <li><div className=" flex flex-row items-center gap-3"><div><AlarmClock color="#98c0ec" strokeWidth={1.5} className="" /></div><div>Reduces debugging time</div></div></li>
          <li><div className=" flex flex-row items-center gap-3"><div><ChartNoAxesCombined color="#98c0ec" strokeWidth={1.5} className="" /></div><div>Improves code quality</div></div></li>
          <li><div className=" flex flex-row items-center gap-3"><div><GraduationCap color="#98c0ec" strokeWidth={1.5} className="" /></div><div>Supports self-learning</div></div></li>
          <li><div className=" flex flex-row items-center gap-3"><div><Mail color="#98c0ec" strokeWidth={1.5} className="" /></div><div>Boosts developer productivity</div></div></li>
        </ul>
      </div>

      {/* Future Scope */}
      <div className="max-w-5xl mx-auto">
        <div className=" flex flex-row items-center justify-center gap-3">
          <div><Sparkles color="#c6ec98" strokeWidth={1.5} className="-mt-5"/></div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Future Scope</h2>
        </div>

        <ul className="grid md:grid-cols-2 gap-4 text-gray-300">
          <li>🌐 Multi-language support</li>
          <li>🎙️ Voice-based debugging</li>
          <li>👥 Team analytics</li>
          <li>🔗 GitHub integration</li>
        </ul>
      </div>

      {/* Footer Line */}
      <div className="text-center mt-12 text-gray-500">
        DEBUGXIA — Turning errors into intelligence.
      </div>

    </div>
  );
};

export default About;