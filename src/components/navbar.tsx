import React from 'react';
import Router from 'next/router'
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/Button';
import ReplayIcon from '@material-ui/icons/Replay';
import SettingsIcon from '@material-ui/icons/Settings';
import HistoryIcon from '@material-ui/icons/History';
import TodayIcon from '@material-ui/icons/Today';
import Link from '@material-ui/core/Link';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { get } from '../biz/api'

const style = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    marginRight: 10,
  },
  grow: {
    flexGrow: 1,
  },
  appbar: {
    marginBottom: 15,
  }
}));

export default function NavBar() {
  const classes = style()
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuClick = (url:string) => {
    Router.push(url)
  }

  const getTracTickets = async () => {
    await get("/api/trac-get-tickets")
    Router.reload()
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            <Link color="inherit" href="/">TracTicketManager</Link>
          </Typography>
          <Tooltip title="過去チケット">
            <IconButton aria-label="old" color="inherit" href='/tickets'>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="今日のチケット">
            <IconButton aria-label="today" color="inherit" href='/tickets/today'>
              <TodayIcon />
            </IconButton>
          </Tooltip>
          <div className={classes.grow} />
          <Tooltip title="Tracからチケット再取得">
            <IconButton aria-label="reload" color="inherit" onClick={getTracTickets}>
              <ReplayIcon />
            </IconButton>
          </Tooltip>
          <IconButton aria-label="settings" color="inherit" onClick={handleClick}>
            <SettingsIcon />
          </IconButton>
          <Menu
            id="menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={'a'} href='/projects'>プロジェクト設定</MenuItem>
            <MenuItem component={'a'} href='/settings/user-dictionary'>ユーザー辞書設定</MenuItem>
            <MenuItem component={'a'} href='/settings/category-setting'>カテゴリ自動付与設定</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </div>
  );
}