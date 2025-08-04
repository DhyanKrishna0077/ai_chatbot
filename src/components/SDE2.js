import React, { useEffect, useState } from "react";
import { Button, Grid, Typography, Paper, ButtonGroup } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Header from "./Header";
import "./Freshers.css";
import Footer from "./Footer";
import { useSnackbar } from "notistack";
import axios from "axios";
import QuestionCarousel from "./Questions";

function Freshers() {
  let { enqueueSnackbar } = useSnackbar();
  const levell = 0;
  const [chosen, setChosen] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [subjectChoosen, setSubjectChoosen] = useState("");
  const [showRightGrid, setShowRightGrid] = useState(false);
  const [question, setQuestion] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState([]);
  const [level, setLevel] = useState("low");
  const [prompt, setPrompt] = useState("low");

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const response = await axios.post("http://localhost:8080/chat", { searchData: `Give 5 ${subjectChoosen} ${level} level question must remember to give 5 questions. The keys values of each questionin json must be question, answer,options and explanation. options should be a array of size four and all elements should be string. Must need to give all the requirements`});
      console.log(response.data,"resppnse")
      setQuestion(response.data.questions);
    } catch (e) {
      console.log(e);
    }
  };

  const subjects = ["HTML", "CSS", "JAVA", "REACT", "NODE", "SPRINGBOOT"];

  const toggleRightGrid = () => {
    setShowRightGrid(!showRightGrid);
  };

  const handleLevel = async (e) => {
    if(e.target.name === "continue") {
      fetchData(); // ✅ Correct usage
    }
    if (level == "low") {
      if (e.target.name == "increase") {
        setLevel("medium");
        fetchData();
        console.log(question, "ques");
      }
      if (e.target.name == "decrease") {
        enqueueSnackbar("It's easy questions already", {
          variant: "warning",
        });
      }
    } else if (level == "medium") {
      if (e.target.name == "increase") {
        setLevel("high");
        fetchData();
        console.log(question, "ques");
      }
      if (e.target.name == "decrease") {
        setLevel("low");
        fetchData();
      }
    } else if (level == "high") {
      if (e.target.name == "increase") {
        enqueueSnackbar("It's hard questions already", {
          variant: "warning",
        });
      }
      if (e.target.name == "decrease") {
        setLevel("medium");
        fetchData();
        console.log(question, "ques");
      }
    }
  };

  const handleClick = async (e) => {
    setChosen(true);
    console.log(e.target.value, "value");
    setSubjectChoosen(e.target.value);
    fetchData();
  };

  return (
    <>
      <Header />
      <div className="root">
        <h1 className="head-title">SDE2</h1>
        {!chosen ? (
          <>
            <Typography variant="h4" className="head-heading">
              Choose a Subject:
            </Typography>
            <Grid container spacing={2} justifyContent="center">
              {subjects.map((subject) => (
                <Grid item key={subject}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="subjectButton"
                    value={subject}
                    onClick={handleClick}
                  >
                    {subject}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            <Grid container spacing={2}>
              {/* Left Grid (8:4 ratio) */}
              <Grid item xs={8} className="position-relative">
                {question.length > 0 ? question.map((questions, ind) => (
                  <QuestionCarousel
                    questions={questions}
                    index={ind}
                    answer={correctAnswer}
                    setAnswer={setCorrectAnswer}
                    key={ind}
                  />
                )) : null}
                <ButtonGroup variant="contained" aria-label="outlined primary button group" className="position-absolute bottom-0 right-0">
                  <Button name="increase" onClick={handleLevel}>
                    Level Up
                  </Button>
                  <Button name="decrease" onClick={handleLevel}>
                    Level Down
                  </Button>
                  <Button name="continue" onClick={handleLevel}>
                    Continue
                  </Button>
                </ButtonGroup>
              </Grid>
              {/* Right Grid (8:4 ratio) */}
              <Grid item xs={4} className="right-grid">
                <Paper className="paperr">
                  <h2>Selected Subject: {subjectChoosen}</h2>
                  {showRightGrid &&
                    subjects.map((subject) => (
                      <Button key={subject} variant="contained" color="primary" className="subjectButton" value={subject} onClick={handleClick}>
                        {subject}
                      </Button>
                    ))}
                </Paper>
                <Button variant="contained" color="secondary" className="toggleButton" onClick={toggleRightGrid}>
                  Select Another Subject
                </Button>
              </Grid>
            </Grid>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Freshers;