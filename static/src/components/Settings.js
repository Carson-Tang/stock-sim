import React, { useState, useEffect } from 'react';
import {
  Button, Container, CssBaseline, Grid,
  TextField, Link
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import history from "./../history";
import { useAuth } from '../context/auth';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Settings() {
  const classes = useStyles();

  const existingTokens = JSON.parse(localStorage.getItem("tokens"))
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const { profileData } = useAuth()

  const [newFirstName, setNewFirstName] = useState('')
  const [newLastName, setNewLastName] = useState('')


  return (
    <Container component="main" maxWidth="xs" className={classes.container}>
      <CssBaseline />
      <div className={classes.paper}>
        <form className={classes.form} noValidate>
          { 
            profileData && 
            <>
              <h1>Account Settings</h1>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus
                disabled
                value={profileData.username}
                onChange={(event) => console.log(event.target.value)}
              />
              <Grid container>
                <Grid item xs={5}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    id="firstname"
                    label="First Name"
                    name="firstname"
                    autoFocus
                    defaultValue={profileData.firstname}
                    onChange={(event) => console.log(event.target.value)}
                  />
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={5}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    id="lastname"
                    label="Last Name"
                    name="lastname"
                    autoFocus
                    defaultValue={profileData.lastname}
                    onChange={(event) => console.log(event.target.value)}
                  />
                </Grid>
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={(event) => console.log(event.target.value)}
              />
              </Grid>
              <Grid container justify="flex-end">
                <Link href="#" variant="body2">
                  Change Password?
                </Link>
              </Grid>
              <Grid container justify="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={() => console.log(1)}
                >
                  Save
                </Button>
              </Grid>
            </>
          }
        </form>
      </div>
    </Container>
  );
}