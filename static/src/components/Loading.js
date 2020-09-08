import React from 'react';
import {
  CircularProgress, Grid,
} from '@material-ui/core'

export default function Loading() {

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <h2>Loading...&nbsp;<CircularProgress /></h2>
      </Grid>
      <Grid item xs={12}>
        <h5>Refresh if the page is still loading after 1 minute.</h5>
      </Grid>
    </React.Fragment>
  )
}