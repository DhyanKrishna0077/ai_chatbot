import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
  Menu, MenuItem, Button
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import "./Products.css";



const Products = () => {
  let { enqueueSnackbar } = useSnackbar();
  let history = useHistory();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (subject) => {
    console.log(`Selected Subject: ${subject}`);
    history.push(`/${subject}`)
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  let token = localStorage.getItem('token')

  return (
    <div>
      <Header>
        
      </Header>

      
          <Grid item className="hero">
            
            <Grid item xs={6}>
          <div style={{ textAlign: 'left', padding: '20px', color:"white"}}>
            <h1 className="hero-heading">Welcome to Interview Challenge</h1>
            <p>Select your Experience</p>
          </div>
        </Grid>

        {/* Right side */}
        <Grid item xs={6}>
          {token && <div style={{ textAlign: 'center', padding: '20px' }}>
            <Button
              variant="contained"
              onClick={handleButtonClick}
            >
              Select Experience
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem name="freshers" onClick={() => handleMenuItemClick("freshers")}>Entry Level</MenuItem>
              <MenuItem name="SDE1" onClick={() => handleMenuItemClick("SDE1")}>SDE1</MenuItem>
              <MenuItem name="SDE2" onClick={() => handleMenuItemClick("SDE2")}>SDE2</MenuItem>
              <MenuItem name="SDE3" onClick={() => handleMenuItemClick("SDE3")}>SDE3</MenuItem>
            </Menu>
          </div>}
        </Grid> 
        
          </Grid>
          
      <Footer />
    </div>
  );
};

export default Products;
