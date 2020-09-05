import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Grid,
  Table, TableBody, TableCell,
  TableHead, TableRow, Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  green: {
    color: '#21ce99',
  },
  red: {
    color: '#f45532',
  }
}));

// some hard coded values for now
function createData(id, stockName, symbol, shares, value, todayReturn, totalReturn, pricePerShare, percentageChange) {
  return { id, stockName, symbol, shares, value, todayReturn, totalReturn, pricePerShare, percentageChange };
}

const rows = [
  createData(0, 'Tesla', 'TSLA', 5, 300.01, 50.00, 312.44, 100.05, 10.00),
  createData(1, 'Microsoft', 'MSFT', 5, 300.02, 50.00, 312.44, 100.04, -10.00),
  createData(2, 'Apple', 'AAPL', 5, 300.03, 50.00, 312.44, 100.03, 20.07),
  createData(3, 'Cloudflare', 'NET', 5, 300.04, 50.00, 312.44, 100.02, -30.05),
  createData(4, 'Sea Ltd', 'SE', 5, 300.05, 50.00, 312.44, 100.01, -90.9),
];

export default function Portfolio() {
  const classes = useStyles();


  const existingTokens = JSON.parse(localStorage.getItem("tokens"))
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const [profileData, setProfileData] = useState()

  useEffect(() => {
    async function getProfile() {
      try {
        await fetch(
          `http://localhost:8080/profile`,
          {
            method: "GET",
            headers: {
              'Authorization': authTokens,
            }
          }
        )
        .then(response => response.json())
        .then(function(data) {
          console.log(data)
          if(data.error)
            return
          setProfileData(data)
        });
      } catch (error) {
        console.error(error);
      }
    }
    getProfile()
  }, [authTokens])

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Statistics
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}