import React, { useEffect, useState } from "react";
import { Button, Grid, Typography, Paper, ButtonGroup } from "@mui/material";
import Header from "./Header";
import "./Freshers.css";
import Footer from "./Footer";
import { useSnackbar } from "notistack";
import axios from "axios";
import QuestionCarousel from "./Questions";

function Freshers() {
  let { enqueueSnackbar } = useSnackbar();
  const [chosen, setChosen] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [subjectChoosen, setSubjectChoosen] = useState("");
  const [showRightGrid, setShowRightGrid] = useState(false);
  const [question, setQuestion] = useState([]);
  const [rawResponse, setRawResponse] = useState(""); // fallback if parsing fails
  const [level, setLevel] = useState("low");

  const subjects = ["HTML", "CSS", "JAVA", "REACT", "NODE", "SPRINGBOOT"];

  const fetchData = async () => {
    if (!subjectChoosen) return;
    try {
      const response = await axios.post("http://localhost:8081/chat", {
        searchData: `Give 5 ${subjectChoosen} ${level} level questions. 
        Must return JSON only with keys: question, options (4 strings), answer, explanation.`
      });

      console.log("Questions API response:", response.data);

      if (Array.isArray(response.data.questions) && response.data.questions.length > 0) {
        setQuestion(response.data.questions);
        setRawResponse("");
      } else {
        setQuestion([]);
        setRawResponse(response.data.raw || "Invalid response format.");
      }

    } catch (e) {
      console.error("Error fetching questions:", e);
      // Display detailed backend error message if available
      enqueueSnackbar(e.response?.data?.error || "Failed to fetch questions", { variant: "error" });
    }
  };

  useEffect(() => {
    if (chosen && subjectChoosen) {
      fetchData();
    }
    // eslint-disable-next-line
  }, [subjectChoosen, level, chosen]);

  const toggleRightGrid = () => {
    setShowRightGrid(!showRightGrid);
  };

  const handleLevel = (e) => {
    if (e.target.name === "continue") {
      fetchData();
    }
    if (level === "low") {
      if (e.target.name === "increase") setLevel("medium");
      if (e.target.name === "decrease") enqueueSnackbar("It's easy questions already", { variant: "warning" });
    } else if (level === "medium") {
      if (e.target.name === "increase") setLevel("high");
      if (e.target.name === "decrease") setLevel("low");
    } else if (level === "high") {
      if (e.target.name === "increase") enqueueSnackbar("It's hard questions already", { variant: "warning" });
      if (e.target.name === "decrease") setLevel("medium");
    }
  };

  const handleClick = (e) => {
    setChosen(true);
    setSubjectChoosen(e.target.value);
  };

  return (
    <>
      <Header />
      <div className="root">
        <h1 className="head-title">Freshers</h1>
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
              {/* Left Grid */}
              <Grid item xs={8} className="position-relative">
                {question.length > 0 ? (
                  question.map((questions, ind) => (
                    <QuestionCarousel
                      questions={questions}
                      index={ind}
                      answer={correctAnswer}
                      setAnswer={setCorrectAnswer}
                      key={ind}
                    />
                  ))
                ) : rawResponse ? (
                  <Typography>{rawResponse}</Typography>
                ) : (
                  <Typography>No questions available.</Typography>
                )}
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                  className="position-absolute bottom-0 right-0"
                >
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
              {/* Right Grid */}
              <Grid item xs={4} className="right-grid">
                <Paper className="paperr">
                  <h2>Selected Subject: {subjectChoosen}</h2>
                  {showRightGrid &&
                    subjects.map((subject) => (
                      <Button
                        key={subject}
                        variant="contained"
                        color="primary"
                        className="subjectButton"
                        value={subject}
                        onClick={handleClick}
                      >
                        {subject}
                      </Button>
                    ))}
                </Paper>
                <Button
                  variant="contained"
                  color="secondary"
                  className="toggleButton"
                  onClick={toggleRightGrid}
                >
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
