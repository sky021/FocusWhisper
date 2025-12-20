import { useState } from 'react';
import { Brain, Timer, Loader2 } from 'lucide-react';

function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data from AI
  const [aiData, setAiData] = useState({
    quantified_goal: "",
    time_options: [25, 55, 85],
    whisper: ""
  });

  // Function to call our Gemini Backend
  const quantifyGoal = async () => {
    if (!goal) return;
    setLoading(true);

    try {
      const res = await fetch('/api/quantify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      
      const data = await res.json();
      
      if (data.quantified_goal) {
        setAiData(data);
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      alert("AI is sleepy. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-800 bg-brand-bg select-none">
      
      {/* Step 1: Input */}
      {step === 1 && (
        <div className="w-full max-w-md animate-fade-in flex flex-col items-center text-center">
          <div className="mb-8 p-4 bg-white rounded-full shadow-sm">
            <Brain size={32} className="text-slate-800" />
          </div>
          
          <h1 className="text-2xl font-semibold mb-2 text-slate-800">What is your focus?</h1>
          
          <input 
            type="text" 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Read a book..."
            className="w-full p-4 rounded-2xl bg-white shadow-sm border-none focus:ring-2 focus:ring-slate-800 outline-none text-lg text-center placeholder:text-slate-300 transition-all mb-6"
          />
          
          <button 
            onClick={quantifyGoal}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Brain size={20} />}
            {loading ? "Thinking..." : "Quantify Task"}
          </button>
        </div>
      )}

      {/* Step 2: AI Result */}
      {step === 2 && (
        <div className="w-full max-w-md animate-fade-in">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 ml-1">AI Suggestion</h2>
          
          <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-slate-100">
            <p className="text-xl font-medium leading-relaxed text-slate-800">
              "{aiData.quantified_goal}"
            </p>
            <p className="text-sm text-slate-400 mt-4 italic">Whisper: "{aiData.whisper}"</p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {aiData.time_options.map((time, i) => (
               <button key={i} className="bg-slate-200 p-4 rounded-2xl font-medium text-slate-600 hover:bg-slate-300 transition-colors">
                 {time}m
               </button>
            ))}
          </div>

          <button 
            onClick={() => setStep(3)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200"
          >
            <Timer size={20} />
            Start Session
          </button>

          <button onClick={() => setStep(1)} className="mt-6 text-slate-400 text-sm w-full text-center">
            Go Back
          </button>
        </div>
      )}
      
      {/* Step 3: Timer Placeholder */}
      {step === 3 && (
         <div className="text-center">
            <h1 className="text-4xl font-bold">Focus Mode</h1>
            <p className="text-slate-500 mt-4">Timer running...</p>
            <button onClick={() => setStep(1)} className="mt-8 text-red-500">Stop</button>
         </div>
      )}
    </div>
  );
}

export default App;