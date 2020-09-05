import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container, Grid, Typography
} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

export default function About() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.container}>
        <Grid container spacing={3} justify="center">
          <Grid item>
            <Typography variant="h4">
              Stock Simulator
            </Typography>
          </Grid>
          
        </Grid>
      </Container>
    </React.Fragment>
  )
}