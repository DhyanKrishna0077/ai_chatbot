import React from 'react';
import { useState } from 'react';


const QuestionCarousel = ({ questions, index, answer, setAnswer }) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  
  
  const handleClick = (event) => {
    setSelectedOption(event.target.name);
    console.log(event.target.name,"value")
    event.target.name === selectedOption && setAnswer(answer+1)
  };
  
  return (
    <>
  <div className='question-div'>
    <h2>Question {index + 1}</h2>
    <p>{questions.question}</p>
    
    {questions.options.map((ele, ind) => (
      <div key={ind}>
        <input type="checkbox" id={`checkbox-${ind}`} name={`${String.fromCharCode(97 + ind)}`} onChange={(e)=>handleClick(e)} />
        <label htmlFor={`checkbox-${ind}`}>{ele}</label><br />
      </div>
    ))}
    
    {selectedOption && (
      <>
        <h4>Correct Answer: {questions.answer}</h4>
        <p>{questions.explanation}</p>
      </>
    )}
    
  </div>
</>
  );
};

export default QuestionCarousel;
