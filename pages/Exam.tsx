import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { QuestionPaper, ExamResult } from '../types';
import { CheckCircle, Timer, ChevronRight } from 'lucide-react';

const Exam: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaper = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'questionPapers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as QuestionPaper;
          setPaper({ id: docSnap.id, ...data });
          
          const saved = localStorage.getItem(`exam_${id}`);
          if (saved) {
            setAnswers(JSON.parse(saved));
          } else {
            setAnswers(new Array(data.questions.length).fill(-1));
          }
        } else {
          alert("Exam session expired or not found.");
          navigate('/');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaper();
  }, [id, navigate]);

  const handleOptionChange = (qIndex: number, oIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = oIndex;
    setAnswers(newAnswers);
    localStorage.setItem(`exam_${id}`, JSON.stringify(newAnswers));
  };

  const handleSubmit = () => {
    const unanswered = answers.filter(a => a === -1).length;
    if (unanswered > 0) {
      if (!window.confirm(`You have ${unanswered} unanswered questions. Proceed to finish?`)) return;
    }

    setSubmitting(true);
    let score = 0;
    paper!.questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) score++;
    });

    const result: ExamResult = {
      paperId: paper!.id,
      paperTitle: paper!.subjectName || paper!.title || "Unnamed Assessment",
      score,
      totalQuestions: paper!.questions.length,
      userAnswers: answers,
      questions: paper!.questions,
      timestamp: new Date().toISOString()
    };

    localStorage.removeItem(`exam_${id}`);
    sessionStorage.setItem('lastResult', JSON.stringify(result));
    navigate('/result');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!paper) return null;

  const answeredCount = answers.filter(a => a !== -1).length;

  return (
    <div className="container mx-auto pt-24 px-4 pb-32 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        {/* Compact Sticky Header */}
        <div className="glass p-3 rounded-2xl shadow-lg mb-8 flex flex-row justify-between items-center border-white sticky top-20 z-40 gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Timer className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-black text-gray-900 truncate tracking-tight">
              {paper.subjectName || paper.title}
            </h1>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
             <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center gap-2">
                <span className="text-[10px] font-black text-indigo-700 uppercase">MCQ:</span>
                <span className="text-sm font-black text-indigo-900">{answeredCount}/{paper.questions.length}</span>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {paper.questions.map((q, qIdx) => (
            <div key={qIdx} className="glass p-6 rounded-[2rem] shadow-md border-white bg-white/40">
              <div className="flex items-start gap-4 mb-5">
                <div className="flex-shrink-0 w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center font-black text-sm shadow-sm">
                  {qIdx + 1}
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-tight mt-1">{q.question}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((option, oIdx) => (
                  <label 
                    key={oIdx}
                    className={`flex items-center p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      answers[qIdx] === oIdx 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                        : 'bg-white border-transparent hover:bg-indigo-50 hover:border-indigo-100 text-gray-700 font-bold'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name={`q-${qIdx}`} 
                      className="hidden" 
                      checked={answers[qIdx] === oIdx}
                      onChange={() => handleOptionChange(qIdx, oIdx)}
                    />
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center mr-3 flex-shrink-0 text-[11px] font-black transition-all ${
                      answers[qIdx] === oIdx ? 'bg-white border-white text-indigo-600' : 'border-indigo-100 text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </div>
                    <span className="text-sm leading-tight">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="mt-12 mb-8 flex justify-center">
          <button 
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-3 active:scale-95 text-lg group"
          >
            {submitting ? (
              <div className="w-6 h-6 border-3 border-indigo-200 border-t-white rounded-full animate-spin"></div>
            ) : (
              <><CheckCircle className="w-5 h-5" /> Submit Assessment <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exam;