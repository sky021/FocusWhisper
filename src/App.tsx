import { useState } from 'react';
import { Brain, Timer, Loader2, ArrowRight, AlertCircle } from 'lucide-react';

function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // To show AI feedback
  const [suggestions, setSuggestions] = useState<string[]>([]); // AI suggestions

  // Data for the valid task
  const [validTask, setValidTask] = useState({
    final_goal: "",
    whisper: "",
    time_options: [25, 55, 85]
  });

  const checkGoal = async () => {
    if (!goal) return;
    setLoading(true);
    setErrorMsg('');
    setSuggestions([]);

    try {
      const res = await fetch('/api/quantify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      
      const data = await res.json();
      
      if (data.is_valid) {
        // Success! Move to next step
        setValidTask({
          final_goal: data.refined_goal,
          whisper: data.whisper,
          time_options: data.time_options || [25, 55, 85]
        });
        setStep(2);
      } else {
        // Fail! Show feedback loop
        setErrorMsg(data.feedback);
        setSuggestions(data.suggestions);
      }

    } catch (error) {
      console.error(error);
      setErrorMsg("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-slate-800 bg-brand-bg select-none">
      
      {/* Step 1: Input & Validation Loop */}
      {step === 1 && (
        <div className="w-full max-w-md animate-fade-in flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-white rounded-full shadow-sm">
            <Brain size={32} className="text-slate-800" />
          </div>
          
          <h1 className="text-2xl font-semibold mb-2 text-slate-800">What is your focus?</h1>
          <p className="text-slate-500 mb-6 text-sm">Be specific. I won't let you start if it's vague.</p>
          
          <div className="w-full relative">
            <input 
              type="text" 
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Read a book..."
              className={`w-full p-4 rounded-2xl bg-white shadow-sm border-2 outline-none text-lg text-center transition-all ${errorMsg ? 'border-red-400' : 'border-transparent focus:border-slate-800'}`}
            />
          </div>

          {/* Rejection Feedback */}
          {errorMsg && (
            <div className="mt-4 w-full animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-red-500 text-sm font-medium mb-3">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
              
              <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-400 uppercase tracking-wide">Try clicking one of these:</p>
                {suggestions.map((s, i) => (
                  <button 
                    key={i}
                    onClick={() => setGoal(s)} 
                    className="bg-white border border-slate-200 p-3 rounded-xl text-sm text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={checkGoal}
            disabled={loading || !goal}
            className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-slate-200 disabled:opacity-70 disabled:scale-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
            {loading ? "Analyzing..." : errorMsg ? "Check Again" : "Check Goal"}
          </button>
        </div>
      )}

      {/* Step 2: Timer Selection (Only reachable if Valid) */}
      {step === 2 && (
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-green-50 p-6 rounded-3xl mb-6 border border-green-100">
             <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                <Brain size={18} />
                <span>Goal Locked In</span>
             </div>
            <p className="text-xl font-medium leading-relaxed text-slate-800">
              "{validTask.final_goal}"
            </p>
            <p className="text-sm text-slate-400 mt-4 italic">Whisper: "{validTask.whisper}"</p>
          </div>
          
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 ml-1">Select Duration</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {validTask.time_options.map((time, i) => (
               <button key={i} className="bg-white p-4 rounded-2xl font-medium text-slate-700 shadow-sm border border-slate-100 hover:border-slate-800 transition-colors">
                 {time}m
               </button>
            ))}
          </div>

          <button onClick={() => setStep(1)} className="mt-6 text-slate-400 text-sm w-full text-center">
            Modify Goal
          </button>
        </div>
      )}
    </div>
  );
}

export default App;