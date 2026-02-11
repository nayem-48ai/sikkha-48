import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExamResult } from '../types';
import { Trophy, XCircle, ArrowLeft, Lightbulb, PieChart, CheckCircle2, History } from 'lucide-react';

const Result: React.FC = () => {
  const [result, setResult] = useState<ExamResult | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when the result page is loaded
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    const saved = sessionStorage.getItem('lastResult');
    if (saved) {
      setResult(JSON.parse(saved));
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!result) return null;

  const percentage = Math.round((result.score / result.totalQuestions) * 100);
  const isPass = percentage >= 60;
  const wrongCount = result.totalQuestions - result.score;

  return (
    <div className="container mx-auto pt-24 px-4 pb-20 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        {/* Compact Hero Score Section */}
        <div className={`glass p-8 rounded-[3rem] shadow-xl text-center border-white mb-10 bg-white/40 border-b-8 ${isPass ? 'border-b-green-500' : 'border-b-red-500'}`}>
          <div className={`w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-4xl shadow-xl ${isPass ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isPass ? <Trophy /> : <XCircle />}
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-1 tracking-tight leading-tight">
            {isPass ? 'Excellent Work!' : 'Almost There!'}
          </h1>
          <p className="text-indigo-600 font-black mb-6 text-lg uppercase tracking-widest">{result.paperTitle}</p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-4">
            <div className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-[10px] bg-white shadow-xl ${isPass ? 'border-green-100 text-green-600' : 'border-red-100 text-red-600'}`}>
              <span className="text-4xl font-black tracking-tighter">{percentage}%</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Score</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
              <div className="glass p-4 rounded-2xl border-white flex flex-col items-center bg-white/60">
                <p className="text-2xl font-black text-green-600">{result.score}</p>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Correct</p>
              </div>
              <div className="glass p-4 rounded-2xl border-white flex flex-col items-center bg-white/60">
                <p className="text-2xl font-black text-red-500">{wrongCount}</p>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Wrong</p>
              </div>
              <div className="glass p-4 rounded-2xl border-white flex flex-col items-center bg-white/60">
                <p className="text-2xl font-black text-gray-900">{result.totalQuestions}</p>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Total</p>
              </div>
              <div className="glass p-4 rounded-2xl border-white flex flex-col items-center bg-white/60">
                <p className={`text-sm font-black ${isPass ? 'text-green-600' : 'text-red-600'}`}>
                  {isPass ? 'PASSED' : 'RETAKE'}
                </p>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Result</p>
              </div>
            </div>
          </div>

          <Link 
            to="/" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-8 py-3.5 rounded-2xl transition-all shadow-lg active:scale-95 inline-flex items-center gap-3 text-base mt-4"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <PieChart className="w-6 h-6 text-indigo-600" /> Review Questions
          </h2>
          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <History className="w-3.5 h-3.5" /> {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <div className="space-y-6">
          {result.questions.map((q, idx) => {
            const isCorrect = result.userAnswers[idx] === q.answer;
            const userChoice = result.userAnswers[idx];
            
            return (
              <div key={idx} className={`glass p-6 rounded-[2rem] shadow-md border-l-8 bg-white/40 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-black text-gray-400 text-[10px] uppercase tracking-widest bg-white/60 px-3 py-1.5 rounded-lg">Question {idx + 1}</span>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest ${isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </div>
                </div>
                
                <p className="text-gray-900 font-black text-lg mb-6 leading-tight">{q.question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {q.options.map((opt, oIdx) => {
                    let classes = "p-3.5 rounded-xl border flex items-center gap-3 transition-all ";
                    if (oIdx === q.answer) {
                      classes += "bg-green-50 border-green-200 text-green-800 font-bold";
                    } else if (oIdx === userChoice && !isCorrect) {
                      classes += "bg-red-50 border-red-200 text-red-800 font-bold";
                    } else {
                      classes += "bg-white border-gray-100 text-gray-400 opacity-60";
                    }
                    
                    return (
                      <div key={oIdx} className={classes}>
                        <span className="w-7 h-7 rounded-lg border flex items-center justify-center flex-shrink-0 text-[11px] font-black bg-white/50">{String.fromCharCode(65 + oIdx)}</span>
                        <span className="text-xs leading-tight">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="bg-slate-900 text-indigo-50 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                    <div className="absolute top-3 right-4 opacity-10">
                      <Lightbulb className="w-8 h-8" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-400">Answer Logic</p>
                    <p className="text-sm font-medium italic leading-relaxed">"{q.explanation}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Result;