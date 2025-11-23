import React, { useState } from 'react';
import { QuizQuestion } from '../lib/types';
import { CheckCircle, XCircle, RefreshCw, Award } from 'lucide-react';

interface Props {
  questions: QuizQuestion[];
  loading: boolean;
  onPass: () => void;
  onRetry: () => void;
}

const QuizView: React.FC<Props> = ({ questions, loading, onPass, onRetry }) => {
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8 flex flex-col items-center justify-center min-h-[50vh]">
         <div className="w-16 h-16 border-4 border-teal-200 border-t-primary rounded-full animate-spin mb-6"></div>
         <h2 className="text-xl font-bold text-slate-700">Dosen sedang menyusun soal ujian...</h2>
         <p className="text-slate-500 mt-2">Menyiapkan soal tingkat Expert 🧩</p>
      </div>
    );
  }

  const handleSelectOption = (qIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[qIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswerIndex) score++;
    });
    return score;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const score = calculateScore();
    // Pass if score > 60%
    if (score / questions.length >= 0.6) {
      setTimeout(() => onPass(), 2500);
    }
  };

  const score = calculateScore();
  const hasPassed = score / questions.length >= 0.6;

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-8 h-8 text-secondary" />
            Ujian Kompetensi
        </h1>
        <p className="text-slate-600 mt-2">Buktikan pemahaman Anda sebelum melanjutkan ke materi berikutnya.</p>
      </div>

      <div className="space-y-8">
        {questions.map((q, qIdx) => {
          const userAnswer = answers[qIdx];
          
          return (
            <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex gap-3">
                <span className="bg-slate-100 text-slate-600 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold flex-shrink-0">
                  {qIdx + 1}
                </span>
                <span dangerouslySetInnerHTML={{ __html: q.question }}></span>
              </h3>

              <div className="space-y-3 pl-11">
                {q.options.map((opt, optIdx) => {
                  let buttonStyle = "border-slate-200 hover:bg-slate-50";
                  let icon = null;
                  
                  if (submitted) {
                    if (optIdx === q.correctAnswerIndex) {
                      buttonStyle = "border-emerald-500 bg-emerald-50 text-emerald-800";
                      icon = <CheckCircle className="w-5 h-5 text-emerald-600" />;
                    } else if (userAnswer === optIdx && userAnswer !== q.correctAnswerIndex) {
                      buttonStyle = "border-rose-500 bg-rose-50 text-rose-800";
                      icon = <XCircle className="w-5 h-5 text-rose-600" />;
                    } else {
                      buttonStyle = "border-slate-100 opacity-50";
                    }
                  } else if (userAnswer === optIdx) {
                     buttonStyle = "border-primary bg-teal-50 text-primary ring-1 ring-primary";
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(qIdx, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${buttonStyle}`}
                    >
                      <div className="flex justify-between items-center">
                        <span dangerouslySetInnerHTML={{__html: opt}}></span>
                        {icon}
                      </div>
                    </button>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-4 ml-11 p-4 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                  <span className="font-bold block mb-1 text-primary">💡 Penjelasan Dosen:</span>
                  <div dangerouslySetInnerHTML={{__html: q.explanation}}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 p-6 bg-white border-t border-slate-200 sticky bottom-0 flex flex-col md:flex-row justify-between items-center shadow-2xl rounded-xl z-20 gap-4">
        {!submitted ? (
          <>
            <div className="text-slate-500 text-sm font-medium">
              Terjawab: <span className="text-primary">{answers.filter(a => a !== -1).length}</span> / {questions.length}
            </div>
            <button
              onClick={handleSubmit}
              disabled={answers.includes(-1)}
              className="w-full md:w-auto bg-primary hover:bg-teal-800 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-teal-100"
            >
              Submit Jawaban
            </button>
          </>
        ) : (
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4">
             <div>
                <h3 className={`text-xl font-bold ${hasPassed ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {hasPassed ? '🏅 Lulus - Kompetensi Terbukti!' : '📚 Belum Lulus - Perlu Belajar Lagi'}
                </h3>
                <p className="text-slate-500 text-sm">Nilai Anda: {Math.round((score / questions.length) * 100)}/100</p>
             </div>
             {hasPassed ? (
               <div className="bg-emerald-100 text-emerald-800 px-6 py-2 rounded-full font-medium flex items-center gap-2 animate-pulse">
                 <CheckCircle className="w-4 h-4" /> Membuka Chapter Berikutnya...
               </div>
             ) : (
               <button onClick={onRetry} className="flex items-center gap-2 text-primary font-bold hover:underline bg-teal-50 px-4 py-2 rounded-lg">
                 <RefreshCw className="w-4 h-4" />
                 Minta Ujian Remedial
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;