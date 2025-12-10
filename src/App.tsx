import { useState } from 'react';
import { Brain, Mic, Timer, Play } from 'lucide-react';

function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-800 bg-brand-bg select-none">
      
      {/* Step 1: Intent - The "What" */}
      {step === 1 && (
        <div className="w-full max-w-md animate-fade-in flex flex-col items-center text-center">
          <div className="mb-8 p-4 bg-white rounded-full shadow-sm">
            <Brain size={32} className="text-slate-800" />
          </div>
          
          <h1 className="text-2xl font-semibold mb-2 text-slate-800">What is your focus?</h1>
          <p className="text-slate-500 mb-8">I will help you quantify it.</p>
          
          <input 
            type="text" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Read a book..."
            className="w-full p-4 rounded-2xl bg-white shadow-sm border-none focus:ring-2 focus:ring-slate-800 outline-none text-lg text-center placeholder:text-slate-300 transition-all"
          />
          
          <button 
            onClick={() => setStep(2)}
            className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200"
          >
            Quantify Task
          </button>
        </div>
      )}

      {/* Step 2: The Quantified Goal (Static AI Placeholder) */}
      {step === 2 && (
        <div className="w-full max-w-md animate-fade-in">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 ml-1">AI Suggestion</h2>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-slate-100">
            <p className="text-xl font-medium leading-relaxed text-slate-800">
              "Read Chapter 4 of 'Atomic Habits' and write down 3 key takeaways."
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button className="bg-slate-200 p-4 rounded-2xl font-medium text-slate-600 hover:bg-slate-300 transition-colors flex flex-col items-center gap-1">
               <span className="text-xs uppercase opacity-50">Deep Work</span>
               <span>25 min</span>
            </button>
            <button className="bg-slate-200 p-4 rounded-2xl font-medium text-slate-600 hover:bg-slate-300 transition-colors flex flex-col items-center gap-1">
               <span className="text-xs uppercase opacity-50">Long Haul</span>
               <span>55 min</span>
            </button>
          </div>

          <button 
            onClick={() => setStep(3)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200"
          >
            <Timer size={20} />
            Start Session
          </button>

          <button 
            onClick={() => setStep(1)}
            className="mt-6 text-slate-400 text-sm w-full text-center hover:text-slate-600"
          >
            Go Back
          </button>
        </div>
      )}

      {/* Step 3: The Focus Timer (Visual) */}
      {step === 3 && (
        <div className="w-full max-w-md animate-fade-in flex flex-col items-center">
           <div className="w-64 h-64 rounded-full border-8 border-slate-200 flex items-center justify-center mb-10 relative">
              <div className="absolute inset-0 rounded-full border-8 border-slate-800 border-t-transparent animate-spin-slow" style={{animationDuration: '10s'}}></div>
              <span className="text-5xl font-bold tracking-tighter text-slate-800">24:59</span>
           </div>
           
           <p className="text-slate-500 mb-8 italic">"You are doing great..."</p>

           <button 
            onClick={() => setStep(1)}
            className="px-8 py-3 bg-red-50 text-red-500 rounded-full font-medium text-sm active:scale-95"
          >
            End Session
          </button>
        </div>
      )}
    </div>
  );
}

export default App;