import React, { useState } from 'react';
import {
  Avatar, Box, Button, Container,
  CssBaseline, Grid, Link,
  TextField, Typography
} from '@material-ui/core'

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import history from "./../history";
import { useAuth } from '../context/auth';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://localhost:3000">
        Stock Simulator
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    }
  },
}));

export default function Register() {
  const classes = useStyles();

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [errorText, setErrorText] = useState('')

  const { setAuthTokens } = useAuth()

  const doLogin = async () => {
    try {
      await fetch(
        `http://localhost:8080/login`,
        {
          method: "POST",
          body: JSON.stringify({
            "username": username,
            "password": password,
          }),
        }
      )
      .then(response => response.json())
      .then(function(data) {
        if(data.error){
          setErrorText(data.error)
        } else {
          console.log(data)
          setAuthTokens(data.token)
          history.push('/')
          window.location.reload()
        }
      });
    } catch (error) {
      setErrorText(error)
      console.error(error);
    }
  };


  const doRegister = async () => {
    try {
      await fetch(
        `http://localhost:8080/register`,
        {
          method: "POST",
          body: JSON.stringify({
            "username": username,
            "firstname": firstName,
            "lastname": lastName,
            "password": password
          }),
        }
      )
      .then(response => response.json())
      .then(function(data) {
        if(data.result === "Registration Successful"){
          doLogin()
        } else {
          setErrorText(data.result)
        }
      });
    } catch (error) {
      setErrorText(error)
      console.error(error)
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {
          errorText && 
          <div className={classes.root}>
            <Alert severity="error">{errorText}</Alert>
          </div>
        }
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(event) => setFirstName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                onChange={(event) => setLastName(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                onChange={(event) => setUsername(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(event) => setPassword(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirm-password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                onChange={(event) => setPasswordAgain(event.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
{/*               <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              /> */}
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={password !== passwordAgain || firstName === '' || lastName === '' || username === ''}
            onClick={() => doRegister()}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}