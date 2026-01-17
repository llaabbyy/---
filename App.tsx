
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Timer from './components/Timer';
import { Difficulty, QuizState } from './types';
import { QUESTIONS, DIFFICULTY_SETTINGS } from './constants';
import { Trophy, ArrowRight, ArrowLeft, User, BrainCircuit, Play, CheckCircle, MessageCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    userName: '',
    difficulty: Difficulty.EASY,
    currentQuestionIndex: -1, // -1 means login/difficulty selection
    answers: {},
    timeRemaining: 0,
    isFinished: false,
    startTime: 0,
  });

  const [tempName, setTempName] = useState('');

  const startQuiz = (diff: Difficulty) => {
    if (!tempName.trim()) return;
    const initialTime = DIFFICULTY_SETTINGS[diff].timeMinutes * 60;
    setState({
      userName: tempName,
      difficulty: diff,
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: initialTime,
      isFinished: false,
      startTime: Date.now(),
    });
  };

  const handleNext = () => {
    if (state.currentQuestionIndex < QUESTIONS.length - 1) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else {
      finishQuiz();
    }
  };

  const handlePrev = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentQuestionIndex]: optionIndex }
    }));
  };

  const finishQuiz = useCallback(() => {
    setState(prev => ({ ...prev, isFinished: true }));
  }, []);

  const reset = () => {
    setState({
      userName: '',
      difficulty: Difficulty.EASY,
      currentQuestionIndex: -1,
      answers: {},
      timeRemaining: 0,
      isFinished: false,
      startTime: 0,
    });
    setTempName('');
  };

  const calculateScore = () => {
    let score = 0;
    QUESTIONS.forEach((q, idx) => {
      if (state.answers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  const getResultFeedback = (percent: number) => {
    if (percent === 100) return "ما شاء الله! درجة كاملة، أنت فخر للأمة!";
    if (percent >= 80) return "ممتاز جداً! معلوماتك الدينية قوية ومباركة.";
    if (percent >= 60) return "جيد جداً، واصل القراءة والتعلم في دينك.";
    if (percent >= 40) return "نتيجة مقبولة، ننصحك بمتابعة القناة لزيادة معرفتك.";
    return "لا تحزن، فطلب العلم فريضة. ابدأ من جديد وتعلم أكثر.";
  };

  const WHATSAPP_URL = "https://chat.whatsapp.com/I6nfcKAhzrzFPlt0Blkwf4";

  // Login & Difficulty Selection Screen
  if (state.currentQuestionIndex === -1) {
    return (
      <div className="min-h-screen bg-slate-50 islamic-pattern">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all hover:scale-[1.01] border-t-8 border-emerald-600">
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="bg-emerald-100 p-4 rounded-full text-emerald-700">
                  <User size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2 font-amiri">مرحباً بك في مسابقتنا</h2>
              <p className="text-center text-slate-500 mb-8">أدخل اسمك الكريم لتبدأ الرحلة الإيمانية</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">الاسم الثلاثي</label>
                  <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="اكتب اسمك هنا..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none transition-all text-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {(Object.keys(DIFFICULTY_SETTINGS) as Difficulty[]).map((diff) => (
                    <button
                      key={diff}
                      onClick={() => startQuiz(diff)}
                      disabled={!tempName.trim()}
                      className={`${DIFFICULTY_SETTINGS[diff].color} text-white p-4 rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale flex flex-col items-center gap-2`}
                    >
                      <BrainCircuit size={24} />
                      <span className="font-bold">{DIFFICULTY_SETTINGS[diff].label}</span>
                      <span className="text-xs opacity-80">{DIFFICULTY_SETTINGS[diff].timeMinutes} دقيقة</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a 
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-emerald-50 text-emerald-700 rounded-2xl font-bold hover:bg-emerald-100 transition-all border border-emerald-200 shadow-sm"
                >
                  <MessageCircle size={22} className="text-emerald-600" />
                  <span>انضم لقناة ضياء الإيمان على الواتساب</span>
                </a>
              </div>
            </div>
            <div className="bg-emerald-50 p-6 text-center text-emerald-800 text-sm font-medium border-t border-emerald-100">
              قناة ضياء الإيمان - نحو وعي ديني أعمق
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Finished Screen
  if (state.isFinished) {
    const score = calculateScore();
    const percent = Math.round((score / QUESTIONS.length) * 100);
    const timeTakenSeconds = Math.round((Date.now() - state.startTime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;

    return (
      <div className="min-h-screen bg-emerald-50 islamic-pattern">
        <Header userName={state.userName} />
        <main className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-t-8 border-amber-500 text-center p-12">
            <div className="flex justify-center mb-6">
              <div className="bg-amber-100 p-6 rounded-full text-amber-600 animate-bounce">
                <Trophy size={64} />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-amiri">تم بحمد الله!</h2>
            <p className="text-xl text-slate-600 mb-8">تقبل الله منك سعيك يا <span className="text-emerald-700 font-bold">{state.userName}</span></p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                <div className="text-sm text-slate-500 mb-1">النتيجة النهائية</div>
                <div className="text-4xl font-black text-emerald-600">{score} <span className="text-xl text-slate-400">/ {QUESTIONS.length}</span></div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                <div className="text-sm text-slate-500 mb-1">الوقت المستغرق</div>
                <div className="text-3xl font-black text-slate-700">{minutes}د {seconds}ث</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                <div className="text-sm text-slate-500 mb-1">مستوى الصعوبة</div>
                <div className="text-2xl font-black text-amber-600">{DIFFICULTY_SETTINGS[state.difficulty].label}</div>
              </div>
            </div>

            <div className="bg-amber-50 p-8 rounded-2xl mb-8 border border-amber-200">
              <h3 className="text-2xl font-bold text-amber-900 mb-4">{percent}%</h3>
              <p className="text-lg text-amber-800 italic font-amiri leading-relaxed">"{getResultFeedback(percent)}"</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <button 
                onClick={reset}
                className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Play size={20} className="rotate-180" /> إعادة المسابقة
              </button>
              <a 
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-10 py-4 bg-emerald-100 text-emerald-800 rounded-xl font-bold hover:bg-emerald-200 transition-all flex items-center justify-center gap-2 border border-emerald-200 shadow-sm"
              >
                <MessageCircle size={22} className="text-emerald-600" />
                انضم لقناتنا على واتساب
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentQ = QUESTIONS[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 islamic-pattern pb-20">
      <Header userName={state.userName} difficultyLabel={DIFFICULTY_SETTINGS[state.difficulty].label} />
      
      <div className="bg-emerald-900/5 backdrop-blur-sm sticky top-[76px] z-40 border-b border-emerald-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <span className="text-sm font-bold text-emerald-800 whitespace-nowrap">السؤال {state.currentQuestionIndex + 1} / {QUESTIONS.length}</span>
            <div className="w-full bg-emerald-100 h-2.5 rounded-full overflow-hidden shadow-inner">
              <div 
                className="bg-emerald-600 h-full transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(5,150,105,0.4)]" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="mr-6">
            <Timer 
              initialSeconds={DIFFICULTY_SETTINGS[state.difficulty].timeMinutes * 60} 
              onTimeUp={finishQuiz}
              isActive={!state.isFinished}
            />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden min-h-[500px] flex flex-col transform transition-all">
          <div className="p-8 md:p-12 flex-1">
             <div className="mb-6 inline-block px-4 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-widest border border-emerald-200">
                تصنيف: {currentQ.category}
             </div>
             <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed font-amiri mb-10">
                {currentQ.text}
             </h2>

             <div className="grid grid-cols-1 gap-4">
                {currentQ.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`group relative p-5 text-right rounded-2xl border-2 transition-all duration-200 flex items-center justify-between ${
                      state.answers[state.currentQuestionIndex] === idx
                        ? 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-500/10'
                        : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-colors ${
                         state.answers[state.currentQuestionIndex] === idx 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className={`text-lg font-medium font-amiri ${
                        state.answers[state.currentQuestionIndex] === idx ? 'text-emerald-900' : 'text-slate-700'
                      }`}>
                        {opt}
                      </span>
                    </div>
                    {state.answers[state.currentQuestionIndex] === idx && (
                      <CheckCircle className="text-emerald-500 animate-in zoom-in" size={24} />
                    )}
                  </button>
                ))}
             </div>
          </div>

          <div className="bg-slate-50 p-6 flex items-center justify-between border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={state.currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 font-bold text-slate-600 hover:text-emerald-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            >
              <ArrowRight size={20} /> السابق
            </button>
            
            <button
              onClick={handleNext}
              className={`flex items-center gap-2 px-10 py-3 rounded-xl font-bold shadow-lg transition-all ${
                state.currentQuestionIndex === QUESTIONS.length - 1
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {state.currentQuestionIndex === QUESTIONS.length - 1 ? 'إنهاء المسابقة' : 'التالي'}
              {state.currentQuestionIndex === QUESTIONS.length - 1 ? <Trophy size={20} /> : <ArrowLeft size={20} />}
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
            <div className="flex flex-wrap justify-center gap-2 max-w-lg bg-white/50 p-4 rounded-3xl backdrop-blur-sm shadow-sm border border-white">
                {QUESTIONS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setState(prev => ({ ...prev, currentQuestionIndex: idx }))}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                            state.currentQuestionIndex === idx 
                            ? 'bg-emerald-600 text-white scale-125 z-10 shadow-md ring-2 ring-emerald-300' 
                            : state.answers[idx] !== undefined 
                                ? 'bg-emerald-200 text-emerald-800' 
                                : 'bg-white text-slate-400 hover:bg-slate-200 border border-slate-100'
                        }`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;
