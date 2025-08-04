import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

import { useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {

  let history = useHistory();
  let username = localStorage.getItem("username");

  let handleLogout = () => {
    history.push("/");

    history.go();

    localStorage.clear();
  }

    return (
      <Box className="header">
        <Box className="header-title">
            
        </Box>
        {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => history.push("/")}
        >
          Back to explore
        </Button>
      ) : !username ? (
        <>
          {console.log("child", children)}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              onClick={() => {
                history.push("/login");
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                history.push("/register");
              }}
            >
              Register
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar alt={username} src="../../public/avatar.png" />
            <p>{username}</p>
            <Button  onClick={handleLogout}>Logout</Button>
          </Stack>
        </>
      )}
      </Box>
    );
};

export default Header;
