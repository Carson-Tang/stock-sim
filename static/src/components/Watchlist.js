import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Container, Grid,
  Table, TableBody, TableCell,
  TableHead, TableRow, Typography
} from '@material-ui/core'
import history from '../history'

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  container: {
    paddingTop: theme.spacing(6),
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
function createData(id, symbol, last, bid, ask, changeDollar, changePercentage, high, low) {
  return { id, symbol, last, bid, ask, changeDollar, changePercentage, high, low };
}

const rows = [
  createData(0, 'TSLA', 405.39, 405.15, 405.28, 1.70, 0.40, 428.00, 372.00),
  createData(1, 'MSFT', 405.39, 405.15, 405.28, 1.70, 0.40, 428.00, 372.00),
  createData(2, 'AAPL', 405.39, 405.15, 405.28, -1.70, -0.40, 428.00, 372.00),
  createData(3, 'NET', 405.39, 405.15, 405.28, -1.70, -0.40, 428.00, 372.00),
  createData(4, 'SE', 405.39, 405.15, 405.28, 1.70, 0.40, 428.00, 372.00),
];

export default function Portfolio() {
  const classes = useStyles();

  const coloredDollar = (value) => {
    return <span className={value > 0 ? classes.green : classes.red}>
      {
        value > 0 ? 
        `${value.toFixed(2)}` : 
        `-${(-value).toFixed(2)}`
      }
    </span>
  }

  const coloredPercentage = (value) => {
    return <span className={value > 0 ? classes.green : classes.red}>
      {
        value > 0 ?
        `(+${value.toFixed(2)}%)` :
        `(${value.toFixed(2)}%)`
      }
    </span>
  }

  const searchTicket = (ticket) => {
    history.push(`/stock/${ticket}`)
    window.location.reload() 
  }

  const largeNumberFormat = (value) => {
    let v = Math.abs(Number(value))
    return v >= 1.0e+12 ? (v/1.0e+12).toFixed(2) + 'T' :
      v >= 1.0e+9 ? (v/1.0e+9).toFixed(2) + 'B' :
      v >= 1.0e+6 ? (v/1.0e+6).toFixed(2) + 'M' :
      v >= 1.0e+3 ? (v/1.0e+3).toFixed(2) + 'K' :
      (v).toFixed(2)
  }

  return (
    <React.Fragment>
      <Container maxWidth="lg" className={classes.container}>
      <Grid container spacing={3}>  
        <Grid item xs={12}>
          <Typography component="h2" variant="h4" color="primary" gutterBottom>
            Watchlist
          </Typography>
          <Table size="small" className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Symbol</TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center"></TableCell>
                <TableCell align="center">Last</TableCell>
                <TableCell align="center">Change ($)</TableCell>
                <TableCell align="center">Change (%)</TableCell>
                <TableCell align="center">High</TableCell>
                <TableCell align="center">Low</TableCell>
                <TableCell align="center">Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">
                    <Button variant="outlined" size="small" onClick={() => searchTicket(row.symbol)}>
                      {row.symbol}
                    </Button>
                  </TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{ row.last.toFixed(2) }</TableCell>
                  <TableCell align="center">
                    { coloredDollar(row.changeDollar) }
                  </TableCell>
                  <TableCell align="center">
                    { coloredPercentage(row.changePercentage) }
                  </TableCell>
                  <TableCell align="center">{ row.high.toFixed(2) }</TableCell>
                  <TableCell align="center">{ row.low.toFixed(2) }</TableCell>
                  <TableCell align="center">{ largeNumberFormat(row.volume) }</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  )
}