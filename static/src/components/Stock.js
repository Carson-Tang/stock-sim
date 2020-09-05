import React from "react";
import {
  Button, ButtonGroup, CircularProgress,
  Container, CssBaseline, Grid,
  IconButton, List, ListItem,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';
import TrendingUp from '@material-ui/icons/TrendingUp';
import TrendingDown from '@material-ui/icons/TrendingDown';
import Add from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

import ApiKey from '../alphavantageApiKey.json'

import Chart from './Chart.js'
import { timeParse } from 'd3-time-format'

const useStyles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(4),
  },
  green: {
    color: '#21ce99',
  },
  red: {
    color: '#f45532',
  },
  greenBtn: {
    backgroundColor: '#21ce99',
    color: '#ffffff',
    margin: theme.spacing(1),
  },
  redBtn: {
    backgroundColor: '#f45532',
    color: '#ffffff',
    margin: theme.spacing(1),
  },
  chartBtn: {
    backgroundColor: '#05386b',
    color: '#ffffff',
  }
});

const parseIntradayDate = timeParse("%Y-%m-%d %H:%M:%S")
const parseDailyDate = timeParse("%Y-%m-%d")

class Stock extends React.Component {
  constructor(props) {
    super(props)
    this.stockTicket = props.match.params.ticket
    this.state = {
      stockInfo: [],
      companyInfo: [],
      intradayData: [],
      dailyData: [],
      selectedChartTime: "Intraday",
    }
  }

  componentDidMount() {
    fetch(`http://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${this.stockTicket}&apikey=${ApiKey.key}`)
      .then(res => res.json())
      .then(data => this.setState({ stockInfo: data }))
    fetch(`http://www.alphavantage.co/query?function=OVERVIEW&symbol=${this.stockTicket}&apikey=${ApiKey.key}`)
      .then(res => res.json())
      .then(data => this.setState({ companyInfo: data }))
    fetch(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${this.stockTicket}&interval=5min&apikey=${ApiKey.key}`)
      .then(res => res.json())
      .then(data => {
        if(data.Note || data["Error Message"])
          return
        let res = []
        Object.keys(data["Time Series (5min)"]).forEach((val) => {
          res.push({
            date: parseIntradayDate(val),
            open: parseFloat(data["Time Series (5min)"][val]["1. open"]),
            high: parseFloat(data["Time Series (5min)"][val]["2. high"]),
            low: parseFloat(data["Time Series (5min)"][val]["3. low"]),
            close: parseFloat(data["Time Series (5min)"][val]["4. close"]),
            volume: parseFloat(data["Time Series (5min)"][val]["5. volume"]),
            split: "",
            dividend: "",
            absoluteChange: "",
            percentChange:"",
            idx: {
              index: 0,
              level: 0,
              date: parseIntradayDate(val),
            }
          })
        })
        res.reverse()
        this.setState({ intradayData: res })
      })
    fetch(`http://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${this.stockTicket}&outputsize=full&apikey=${ApiKey.key}`)
      .then(res => res.json())
      .then(data => {
        if(data.Note || data["Error Message"])
          return
        let res = []
        Object.keys(data["Time Series (Daily)"]).forEach((val) => {
          res.push({
            date: parseDailyDate(val),
            open: parseFloat(data["Time Series (Daily)"][val]["1. open"]),
            high: parseFloat(data["Time Series (Daily)"][val]["2. high"]),
            low: parseFloat(data["Time Series (Daily)"][val]["3. low"]),
            close: parseFloat(data["Time Series (Daily)"][val]["4. close"]),
            volume: parseFloat(data["Time Series (Daily)"][val]["6. volume"]),
            split: parseFloat(data["Time Series (Daily)"][val]["8. split coefficient"]),
            dividend: parseFloat(data["Time Series (Daily)"][val]["7. dividend amount"]),
            absoluteChange: "",
            percentChange:"",
            idx: {
              index: 0,
              level: 0,
              date: parseDailyDate(val),
            }
          })
        })
        res.reverse()
        this.setState({ dailyData: res })
      })
  }

  render() {
    const { stockInfo, companyInfo, intradayData, dailyData, selectedChartTime } = this.state
    const { classes } = this.props

    const coloredDollar = (value, percentageChange) => {
      return <span className={percentageChange > 0 ? classes.green : classes.red}>
        {
          value > 0 ? 
          `$${value.toFixed(2)}` : 
          `-$${(-value).toFixed(2)}`
        }
        {' '}
        {
          percentageChange > 0 ? 
          `(+${percentageChange.toFixed(2)}%)` :
          `(${percentageChange.toFixed(2)}%)`
        }
        {' '}
        {
          percentageChange > 0 ?
          <TrendingUp /> : <TrendingDown /> 
        }
      </span>
    }

    const largeNumberFormat = (value) => {
      let v = Math.abs(Number(value))
      return v >= 1.0e+12 ? (v/1.0e+12).toFixed(2) + 'T' :
        v >= 1.0e+9 ? (v/1.0e+9).toFixed(2) + 'B' :
        v >= 1.0e+6 ? (v/1.0e+6).toFixed(2) + 'M' :
        v >= 1.0e+3 ? (v/1.0e+3).toFixed(2) + 'K' :
        (v).toFixed(2)
    }

    const updateChartTime = (value) => {
      this.setState({ selectedChartTime: value })
    }

    function renderStockData(data) {

      return <>
        <Grid item xs={12}>
          <Typography display="inline" component="h3" variant="h3" gutterBottom>
            {companyInfo.Name}{' '}({data["01. symbol"]})
          </Typography>
          <Typography display="inline" component="h3" variant="h6" gutterBottom>
            {' '}{companyInfo.Exchange}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h3" variant="caption" gutterbottom>
            <IconButton size="small" onClick={() => console.log(data["01. symbol"])}>
              {
                true ? <> Add to watchlist <Add /> </>
                      : <> Remove from watchlist <CheckIcon /></>
              }
            </IconButton>
            <Button variant="outlined" color="primary" className={classes.greenBtn}>Buy</Button>
            <Button variant="outlined" color="primary" className={classes.redBtn}>Sell</Button>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography display="inline" component="h3" variant="h2" gutterBottom>
            ${parseFloat(data["05. price"]).toFixed(2)}
          </Typography>
          <Typography display="inline" component="h3" variant="h5" gutterBottom>
            {' '} USD
          </Typography>
          <Typography display="inline" component="h3" variant="h4" gutterBottom>
            {' '}{coloredDollar(parseFloat(data["09. change"]), parseFloat(data["10. change percent"].slice(0, -1)))}
          </Typography>
        </Grid>
        <Grid container item xs={12} justify="flex-end">
          <ButtonGroup aria-label="outlined primary button group">
            <Button onClick={() => updateChartTime("Intraday")} 
              className={selectedChartTime === "Intraday" ? classes.chartBtn : null}>
                Intraday
            </Button>
            <Button onClick={() => updateChartTime("Daily")}
              className={selectedChartTime !== "Intraday" ? classes.chartBtn : null}>
                Daily
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12}>
          {
            selectedChartTime === "Intraday" && intradayData && intradayData.length === 100 ? 
            <Chart data={intradayData} /> :
            dailyData && dailyData.length ?
            <Chart data={dailyData} /> : <CircularProgress />
          }
        </Grid>
        <Grid item xs={2}>
          <List dense={true}>
            {/* <ListItemText 
              primary={`Open: ${parseFloat(data["02. open"]).toFixed(2)}`}
            /> */}
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                Open
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                High
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                Low
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                Volume
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={2}>
          <List dense={true}>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(data["02. open"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(data["03. high"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(data["04. low"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { largeNumberFormat(parseInt(data["06. volume"])) }
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={2}>
          <List dense={true}>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                Market Cap
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                P/E Ratio
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                Prev Close
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                Div Yield
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={2}>
          <List dense={true}>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { largeNumberFormat(parseFloat(companyInfo["MarketCapitalization"])) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(companyInfo["PERatio"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(data["08. previous close"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                {
                  parseFloat(companyInfo["DividendYield"]) === 0 ? 
                  ' -': ` ${parseFloat(companyInfo["DividendYield"]).toFixed(2)}`
                }
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={2}>
          <List dense={true}>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                50-Day Avg
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                200-Day Avg
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                52-Wk High
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                52-Wk Low
              </Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={2}>
          <List dense={true}>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(companyInfo["50DayMovingAverage"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(companyInfo["200DayMovingAverage"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(companyInfo["52WeekHigh"]).toFixed(2) }
              </Typography>
            </ListItem>
            <ListItem>
              <Typography component="h3" variant="subtitle1" gutterBottom>
                { parseFloat(companyInfo["52WeekLow"]).toFixed(2) }
              </Typography>
            </ListItem>
          </List>
        </Grid>
      </>
    }

    return <>
      <React.Fragment>
        <CssBaseline />
        <Container fixed className={classes.container}>
          <div className={classes.root}>
            <Grid container spacing={1}>
              {
                stockInfo && stockInfo["Global Quote"] && companyInfo && !companyInfo.Note && intradayData ?
                renderStockData(stockInfo["Global Quote"]) :
                <>
                  <Grid item xs={12}>
                    <h2>Loading...&nbsp;<CircularProgress /></h2>
                  </Grid>
                  <Grid item xs={12}>
                    <h5>Refresh if the page is still loading after 1 minute.</h5>
                  </Grid>
                </>
              }
{/*               <Button onClick={() => console.log(stockInfo)}>Stock Info</Button>
              <Button onClick={() => console.log(companyInfo)}>Company Info</Button>
              <Button onClick={() => console.log(intradayData)}>Intraday Data</Button>
              <Button onClick={() => console.log(dailyData)}>Daily Data</Button> */}
            </Grid>
          </div>
        </Container>
      </React.Fragment>
    </>
  }
}

export default withStyles(useStyles)(Stock);