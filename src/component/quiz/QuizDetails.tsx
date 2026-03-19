'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { useQuizStore } from '@/lib/store/useQuizStore';

import { QuizSkeleton } from './components/QuizSkeleton';
import { TermsScreen } from './components/TermsScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { QuizHeader } from './components/QuizHeader';
import { QuestionSidebar } from './components/QuestionSidebar';
import { QuestionCard } from './components/QuestionCard';
import { QuizFooter } from './components/QuizFooter';
import { ExitModal, SubmitModal } from './components/QuizModals';
import { ToastContainer } from './components/Toastcontainer';
import { useToast } from '@/hooks/usetoast';
import { useAntiCheat } from '@/hooks/useAntiCheat';

export const QuizPlayer = ({ quizId }) => {
  const router = useRouter();
  const store = useQuizStore();
  const { toasts, addToast } = useToast();
  const containerRef = useRef(null);

  const [showTerms, setShowTerms] = useState(true);
  const [startCountdown, setStartCountdown] = useState(10);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Anti-cheat hooks
  useAntiCheat({ containerRef, isSubmitted: store.isSubmitted, addToast });

  // Countdown timer on terms screen
  useEffect(() => {
    if (!showTerms) return;
    const interval = setInterval(() => {
      setStartCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [showTerms]);

  // Start quiz on mount
  useEffect(() => {
    store.startQuiz(quizId, () => addToast('Quiz loaded', 'success'));
    return () => {
      if (store.timerInterval) clearInterval(store.timerInterval);
      if (store.questionTimerInterval) clearInterval(store.questionTimerInterval);
    };
  }, [quizId]);

  // Start per-question timer when question changes (after terms accepted)
  useEffect(() => {
    if (store.questions.length > 0 && !store.isSubmitted && !showTerms) {
      store.startQuestionTimer();
    }
  }, [store.currentQuestionIndex, store.questions.length, showTerms]);

  const handleBeginQuiz = () => {
    setShowTerms(false);
    try { containerRef.current?.requestFullscreen(); } catch { }
  };

  const handleSelectAnswer = (optionId) => {
    if (store.isSubmitted) return;
    store.selectAnswer(store.questions[store.currentQuestionIndex]?.id, optionId);
    addToast('Answer saved', 'success');
  };

  const handleNext = async () => {
    if (store.isLastQuestion) {
      setShowSubmitModal(true);
    } else {
      await store.fetchNextQuestion(
        store.selectedAnswers[store.questions[store.currentQuestionIndex]?.id] ?? null
      );
    }
  };

  const handlePrev = () => {
    if (store.currentQuestionIndex > 0) {
      // Direct mutation — same as original code
      useQuizStore.setState({ currentQuestionIndex: store.currentQuestionIndex - 1 });
    }
  };

  const handleGoTo = (index) => {
    useQuizStore.setState({ currentQuestionIndex: index });
  };

  const handleSubmit = async () => {
    setShowSubmitModal(false);
    await store.submitQuiz((result) => {
      addToast('Submitted!', 'success');
    });
  };

  const handleExit = () => {
    setShowExitModal(false);
    router.push('/');
  };

  // Derived values
  const currentQuestion = store.questions[store.currentQuestionIndex];
  const answeredCount = Object.keys(store.selectedAnswers).length;
  const timerPct = store.currentQuestionTimeLimit > 0
    ? (store.currentQuestionTimer / store.currentQuestionTimeLimit) * 100
    : 100;

  // ── Render states ──────────────────────────────────────────────

  if (store.loading && store.questions.length === 0) return <QuizSkeleton />;

  if (!store.loading && store.error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 min-h-screen bg-gray-50">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-50 border border-red-200 mb-4">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Failed to Load</h2>
          <p className="text-gray-500 text-sm mb-5">{store.error}</p>
          <button
            onClick={() => router.push('/')}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 flex flex-col">

      {/* Terms */}
      {showTerms && (
        <TermsScreen quiz={store.quiz} onStart={handleBeginQuiz} countdown={startCountdown} />
      )}

      {/* Results */}
      {!showTerms && store.isSubmitted && store.result && (
        <ResultsScreen
          result={store.result}
          onHome={() => router.push('/')}
        />
      )}

      {/* Quiz in progress */}
      {!showTerms && !store.isSubmitted && (
        <>
          <QuizHeader
            title={store.quiz?.title}
            currentIndex={store.currentQuestionIndex}
            totalQuestions={store.totalQuestions}
            timeRemaining={store.timeRemaining}
          />

          <div className="flex-1 flex overflow-hidden">
            <QuestionSidebar
              questions={store.questions}
              currentIndex={store.currentQuestionIndex}
              selectedAnswers={store.selectedAnswers}
              onGoTo={handleGoTo}
            />

            <main className="flex-1 overflow-y-auto flex items-start justify-center p-5">
              {currentQuestion ? (
                <div className="w-full max-w-xl">
                  <QuestionCard
                    question={currentQuestion}
                    selectedAnswers={store.selectedAnswers}
                    onSelect={handleSelectAnswer}
                    timerPct={timerPct}
                    timerSeconds={store.currentQuestionTimer}
                    currentIndex={store.currentQuestionIndex}
                  />
                  <QuizFooter
                    currentIndex={store.currentQuestionIndex}
                    totalQuestions={store.totalQuestions}
                    answeredCount={answeredCount}
                    isLastQuestion={store.isLastQuestion}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    onExit={() => setShowExitModal(true)}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-300 mx-auto" />
                  <p className="text-gray-400 text-xs mt-3">Loading...</p>
                </div>
              )}
            </main>
          </div>

          <ExitModal
            isOpen={showExitModal}
            onClose={() => setShowExitModal(false)}
            onConfirm={handleExit}
          />
          <SubmitModal
            isOpen={showSubmitModal}
            onClose={() => setShowSubmitModal(false)}
            onConfirm={handleSubmit}
            answeredCount={answeredCount}
            totalQuestions={store.totalQuestions}
          />
        </>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
};