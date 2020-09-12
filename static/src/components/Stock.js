import React, { useState, useEffect, useContext } from "react";
import {
  Button, ButtonGroup,
  Container, CssBaseline, Grid,
  IconButton, List, ListItem,
  Typography,
} from '@material-ui/core'
import Loading from './Loading.js'
import { makeStyles } from '@material-ui/core/styles';
import TrendingUp from '@material-ui/icons/TrendingUp';
import TrendingDown from '@material-ui/icons/TrendingDown';
import Add from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import ApiKey from '../alphavantageApiKey.json'

import Chart from './Chart.js'
import { timeParse } from 'd3-time-format'
import { useAuth } from '../context/auth';


const useStyles = makeStyles((theme) => ({
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
}));

const parseIntradayDate = timeParse("%Y-%m-%d %H:%M:%S")
const parseDailyDate = timeParse("%Y-%m-%d")

const Stock = (props) => {
  const classes = useStyles();

  const existingTokens = JSON.parse(localStorage.getItem("tokens"))
  const [authTokens, setAuthTokens] = useState(existingTokens);
  const { profileData } = useAuth()

  const stockTicket = props.match.params.ticket

  useEffect(() => {
    async function getStockInfo() {
      await fetch(`http://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockTicket}&apikey=${ApiKey.key}`)
        .then(res => res.json())
        .then(data => setStockInfo(data))
    }
    async function getCompanyInfo() {
      await fetch(`http://www.alphavantage.co/query?function=OVERVIEW&symbol=${stockTicket}&apikey=${ApiKey.key}`)
        .then(res => res.json())
        .then(data => setCompanyInfo(data))
    }
    async function getIntradayData() {
      await fetch(`http://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${stockTicket}&interval=5min&apikey=${ApiKey.key}`)
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
          setIntradayData(res)
        }
      )
    }

    async function getDailyData() {
      await fetch(`http://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${stockTicket}&outputsize=full&apikey=${ApiKey.key}`)
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
          setDailyData(res)
        }
      )
    }

    //getProfile()
    getStockInfo()
    getCompanyInfo()
    getIntradayData()
    getDailyData()
  }, [])

  const [stockInfo, setStockInfo] = useState([])
  const [companyInfo, setCompanyInfo] = useState([])
  const [intradayData, setIntradayData] = useState([])
  const [dailyData, setDailyData] = useState([])
  const [selectedChartTime, setSelectedChartTime] = useState("Intraday")
  const [isInWatchlist, setIsInWatchlist] = useState(false)

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

  useEffect(() => {
    if (!profileData)
      return
    profileData.watchlistshares.forEach((stock) => {
      if (stock.ticket == stockTicket){
        setIsInWatchlist(true)
      }
    })
  }, [profileData])

  async function handleAddToWatchlist(stockname, ticket) {
    console.log(stockname, ticket)
    try {
      await fetch(
        `http://localhost:8080/addToWatchlist`,
        {
          method: "POST",
          headers: {
            'Authorization': authTokens,
          },
          body: JSON.stringify({
            "stockname": stockname,
            "ticket": ticket,
          })
        }
      )
      .then(response => response.json())
      .then(function(data) {
        setIsInWatchlist(true)
        console.log(data)
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRemoveFromWatchlist(stockname, ticket) {
    console.log(stockname, ticket)
    try {
      await fetch(
        `http://localhost:8080/removeFromWatchlist`,
        {
          method: "POST",
          headers: {
            'Authorization': authTokens,
          },
          body: JSON.stringify({
            "stockname": stockname,
            "ticket": ticket,
          })
        }
      )
      .then(response => response.json())
      .then(function(data) {
        setIsInWatchlist(false)
        console.log(data)
      });
    } catch (error) {
      console.error(error);
    }
  }

  function renderStockData(data) {
    return <>
      <Grid item xs={12}>
        <Button onClick={() => console.log(profileData)}> test </Button>
        <Typography display="inline" component="h3" variant="h3" >
          {companyInfo.Name}{' '}({data["01. symbol"]})
        </Typography>
        <Typography display="inline" component="h3" variant="h6" >
          {' '}{companyInfo.Exchange}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography component="h3" variant="caption" >
          <IconButton size="small"
            onClick={() => isInWatchlist ?
            handleRemoveFromWatchlist(companyInfo.Name, data["01. symbol"]) :
            handleAddToWatchlist(companyInfo.Name, data["01. symbol"])}
          >
            {
              isInWatchlist ? <> Remove from watchlist <CloseIcon /></>
                    : <> Add to watchlist <Add /> </>
            }
          </IconButton>
          <Button variant="outlined" color="primary" className={classes.greenBtn}>Buy</Button>
          <Button variant="outlined" color="primary" className={classes.redBtn}>Sell</Button>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography display="inline" component="h3" variant="h2" >
          ${parseFloat(data["05. price"]).toFixed(2)}
        </Typography>
        <Typography display="inline" component="h3" variant="h5" >
          {' '} USD
        </Typography>
        <Typography display="inline" component="h3" variant="h4" >
          {' '}{coloredDollar(parseFloat(data["09. change"]), parseFloat(data["10. change percent"].slice(0, -1)))}
        </Typography>
      </Grid>
      <Grid container item xs={12} justify="flex-end">
        <ButtonGroup aria-label="outlined primary button group">
          <Button onClick={() => setSelectedChartTime("Intraday")} 
            className={selectedChartTime === "Intraday" ? classes.chartBtn : null}>
              Intraday
          </Button>
          <Button onClick={() => setSelectedChartTime("Daily")}
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
          <Chart data={dailyData} /> : <Loading />
        }
      </Grid>
      <Grid item xs={2}>
        <List dense={true}>
          {/* <ListItemText 
            primary={`Open: ${parseFloat(data["02. open"]).toFixed(2)}`}
          /> */}
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              Open
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              High
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              Low
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              Volume
            </Typography>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={2}>
        <List dense={true}>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(data["02. open"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(data["03. high"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(data["04. low"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { largeNumberFormat(parseInt(data["06. volume"])) }
            </Typography>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={2}>
        <List dense={true}>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              Market Cap
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              P/E Ratio
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              Prev Close
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              Div Yield
            </Typography>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={2}>
        <List dense={true}>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { largeNumberFormat(parseFloat(companyInfo["MarketCapitalization"])) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(companyInfo["PERatio"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(data["08. previous close"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
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
            <Typography component="h3" variant="subtitle1" >
              50-Day Avg
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              200-Day Avg
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              52-Wk High
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              52-Wk Low
            </Typography>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={2}>
        <List dense={true}>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(companyInfo["50DayMovingAverage"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(companyInfo["200DayMovingAverage"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(companyInfo["52WeekHigh"]).toFixed(2) }
            </Typography>
          </ListItem>
          <ListItem>
            <Typography component="h3" variant="subtitle1" >
              { parseFloat(companyInfo["52WeekLow"]).toFixed(2) }
            </Typography>
          </ListItem>
        </List>
      </Grid>
    </>
  }

  return (<>
    <React.Fragment>
      <CssBaseline />
      <Container fixed className={classes.container}>
        <div className={classes.root}>
          <Grid container spacing={1}>
            {
              stockInfo && stockInfo["Global Quote"] && companyInfo && !companyInfo.Note && intradayData ?
              renderStockData(stockInfo["Global Quote"]) :
              <>
                <Loading />
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
  </>)
}
export default Stock;