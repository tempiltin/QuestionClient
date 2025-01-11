import React, { useState, useEffect } from 'react';
import { Timer, CheckCircle2, XCircle } from 'lucide-react';
import { questions as mobileQuestions } from './data/questions';
import { Question } from './types/question';

function App() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isFinished, setIsFinished] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);

  const subjects = [
    "Suniy intelekt",
    "Mobil ilovalar",
    "SQLda dasturlash",
    "Kompyuter ko'rishi",
    "Bioinformatika",
    "Web dasturlash"
  ];

  // Function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate random questions when subject is selected
  const generateQuestions = (subject: string) => {
    let questions: Question[] = [];
    
    // For now, we only have mobile questions
    if (subject === "Mobil ilovalar") {
      // Shuffle all questions and take first 50
      questions = shuffleArray(mobileQuestions).slice(0, 50);
    }
    
    setGeneratedQuestions(questions);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setIsFinished(false);
    setTimeLeft(30 * 60);
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    generateQuestions(subject);
  };

  useEffect(() => {
    if (timeLeft > 0 && !isFinished && selectedSubject) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished && selectedSubject) {
      handleFinish();
    }
  }, [timeLeft, isFinished, selectedSubject]);

  const handleAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < generatedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinish = () => {
    let finalScore = 0;
    generatedQuestions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        finalScore++;
      }
    });
    setScore(finalScore);
    setIsFinished(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setSelectedSubject(null);
    setGeneratedQuestions([]);
    setCurrentQuestion(0);
    setUserAnswers([]);
    setScore(0);
    setIsFinished(false);
    setTimeLeft(30 * 60);
  };

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <h1 className="text-2xl font-bold text-center mb-8">Fan yo'nalishini tanlang</h1>
              <div className="grid grid-cols-2 gap-4">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => handleSubjectSelect(subject)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const isPassed = score >= 30; // O'tish bali 30 ta to'g'ri javob

    return (
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h1 className="text-2xl font-bold text-center mb-8">Test Natijasi</h1>
                  <div className="flex items-center justify-center gap-2 text-xl">
                    {isPassed ? (
                      <CheckCircle2 className="text-green-500" />
                    ) : (
                      <XCircle className="text-red-500" />
                    )}
                    <p>
                      Sizning ballingiz: {score} / {generatedQuestions.length}
                    </p>
                  </div>
                  <p className="text-center mt-4">
                    Foiz: {((score / generatedQuestions.length) * 100).toFixed(1)}%
                  </p>
                  <p className="text-center mt-4 text-lg font-semibold">
                    {isPassed ? (
                      <span className="text-green-600">Siz yakuniy testdan muvaffaqiyatli o'tdingiz!</span>
                    ) : (
                      <span className="text-red-600">Siz testdan o'ta olmadingiz. Kamida 30 ta to'g'ri javob bo'lishi kerak.</span>
                    )}
                  </p>
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={handleReset}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Qaytadan boshlash
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="flex items-center justify-between pb-4">
                <h2 className="text-xl font-bold">{selectedSubject}</h2>
                <button
                  onClick={handleFinish}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Testni yakunlash
                </button>
              </div>

              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">
                    Savol {currentQuestion + 1} / {generatedQuestions.length}
                  </span>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Timer size={20} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    {generatedQuestions[currentQuestion].question}
                  </h2>
                  <div className="space-y-4">
                    {generatedQuestions[currentQuestion].options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          type="radio"
                          id={`option${index}`}
                          name="answer"
                          value={option}
                          checked={userAnswers[currentQuestion] === option}
                          onChange={(e) => handleAnswer(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label
                          htmlFor={`option${index}`}
                          className="ml-3 block text-gray-700"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
                  >
                    Oldingi
                  </button>
                  {currentQuestion === generatedQuestions.length - 1 ? (
                    <button
                      onClick={handleFinish}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Tugatish
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Keyingi
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;