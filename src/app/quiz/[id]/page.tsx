import QuizPlayer from '@/component/quiz/QuizDetails'
import React from 'react'

const page = ({ params }) => {
  return <QuizPlayer quizId={params.id}/>
}

export default page