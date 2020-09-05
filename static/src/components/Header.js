import React, { useState } from 'react';
import { fade, makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, IconButton, Typography,
  InputBase, Badge, MenuItem, Menu,
  SwipeableDrawer, Button, List, Divider,
  ListItem, ListItemIcon, ListItemText,
} from '@material-ui/core';

import Autocomplete from '@material-ui/lab/Autocomplete';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import FolderOpen from '@material-ui/icons/FolderOpen'
import ShowChart from '@material-ui/icons/ShowChart';
import CasinoOutlined from '@material-ui/icons/CasinoOutlined';
import TrackChanges from '@material-ui/icons/TrackChanges'
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import history from '../history'
import { useAuth } from '../context/auth';

import nasdaqSymbols from '../nasdaqSymbols.json'
import nyseSymbols from '../nyseSymbols.json'


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: 250,
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  appBar: {
    backgroundColor: '#05386b'
  },
  goBtn: {
    backgroundColor: '#21ce99',
    color: '#ffffff',
  }
}));

const theme = createMuiTheme({
  palette: {
    primary: { main: '#21ce99' /* '#00e676' */ }
  },
});

const stockTickets = () => {
  let res = []
  nasdaqSymbols.forEach((v) => {
    res.push({
      "Symbol": v.Symbol,
      "Company Name": v["Company Name"],
      "Stock Exchange": "NASDAQ",
    })
  })
  nyseSymbols.forEach((v) => {
    res.push({
      "Symbol": v["ACT Symbol"],
      "Company Name": v["Company Name"],
      "Stock Exchange": "NYSE",
    })
  })
  return res
}

export default function PrimarySearchAppBar() {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const { setAuthTokens } = useAuth()

  function logout() {
    setAuthTokens('')
  }
  
  const changePage = (page) => {
    history.push(`/${page}`)
    window.location.reload()
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={() => changePage('portfolio')}>Profile</MenuItem>
      <MenuItem onClick={() => changePage('settings')}>Settings</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const [drawerVisible, setDrawerVisible] = useState(false);

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerVisible(open);
  };

  const list = (anchor) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        <ListItem button key='Portfolio' onClick={() => changePage('portfolio')}>
          <ListItemIcon><FolderOpen /></ListItemIcon>
          <ListItemText primary='Portfolio' />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key='Watchlist' onClick={() => changePage('watchlist')}>
          <ListItemIcon><TrackChanges /></ListItemIcon>
          <ListItemText primary='Watchlist' />
        </ListItem>
        <ListItem button key='Stocks' onClick={() => changePage('stocks')}>
          <ListItemIcon><ShowChart /></ListItemIcon>
          <ListItemText primary='Stocks' />
        </ListItem>
        <ListItem button key='Options' onClick={() => changePage('options')}>
          <ListItemIcon><CasinoOutlined /></ListItemIcon>
          <ListItemText primary='Options' />
        </ListItem>
        <ListItem button key='About' onClick={() => changePage('about')}>
          <ListItemIcon><InfoOutlinedIcon /></ListItemIcon>
          <ListItemText primary='About' />
        </ListItem>
      </List>
    </div>
  );

  const [ticket, setTicket] = useState('')

  const searchTicket = (ticket) => {
    history.push(`/stock/${ticket}`)
    window.location.reload() 
  }
 
  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.appBar}>
        <Toolbar>
          {['left'].map((anchor) => (
          <React.Fragment key={anchor}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer(anchor, true)}
            >
              <MenuIcon />
            </IconButton>
            <SwipeableDrawer
              anchor={anchor}
              open={drawerVisible}
              onClose={toggleDrawer(anchor, false)}
              onOpen={toggleDrawer(anchor, true)}
            >
              {list(anchor)}
            </SwipeableDrawer>
          </React.Fragment>
          ))}
          <Typography className={classes.title} variant="h6" noWrap>
            Stock Simulator
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <Autocomplete
              freeSolo
              disableClearable
              options={stockTickets().map(stock => `${stock["Symbol"]} - ${stock["Company Name"]}`)}
              renderInput={(params) => (
                <>
                <InputBase
                  placeholder="Search…"
                  classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                  }}
                  ref={params.InputProps.ref}
                  inputProps={params.inputProps}
                  onChange={(e) => setTicket(e.target.value)}
                />
                </>
              )}
              onChange={(e, v) => setTicket(v.split(' ')[0])}
            />
          </div>
          <ThemeProvider theme={theme}>
            <Button variant='contained' color='primary' onClick={() => searchTicket(ticket)}
              className={classes.goBtn}>Go</Button>
          </ThemeProvider>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="show 4 new mails" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton aria-label="show 17 new notifications" color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </div>
  );
}