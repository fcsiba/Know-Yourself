import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, Container, AppBar, Toolbar, IconButton, SwipeableDrawer, List, ListItemText, ListItem, Divider,ListItemIcon } from '@material-ui/core';
import {Menu, Person, Twitter, Settings, ExitToApp, Search} from '@material-ui/icons';
import logo from '../../media/Logo.svg';
import {connect} from 'react-redux';
import * as actions from '../../actions'; 

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'space-between',
    },
    listHolder: {
        minWidth: '250px'
    }
}));
  
const list_returner = (search_enabled) => {
    let list = [
        ['My Profile',<Person/>,'profile'],
        ['Connected Twitter',<Twitter/>,'twitter'],
        ['Setting',<Settings/>,'setting'],
    ];
    if (search_enabled){
        list.push( ['Search',<Search/>,'search'],)
    }
    return list;
}

function Header(props) {
    const classes = useStyles();
    return (
        <>
            <AppBar className="topbar" position="static" >
                <Toolbar className={classes.root}>
                    <img src={logo} alt="" style={{height: '50px'}} className={classes.logo}/>

                    <IconButton edge="start"  color="inherit" aria-label="menu" className={classes.button} onClick={() => props.appnav_sidemenu_open(true)}>
                        <Menu />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <SwipeableDrawer
                anchor='right'
                open={props.sidemenu_open}
                onClose={() => props.appnav_sidemenu_open(false)}
                onOpen={() => props.appnav_sidemenu_open(true)}
            >
                <div
                    className={classes.listHolder}
                    role="presentation"
                >
                <List>
                    {list_returner(props.search_enabled).map((item, index) => 
                        <ListItem button key={item[0]} onClick={() => props.appnav_view_change(item[2])}>
                            <ListItemIcon>{item[1]}</ListItemIcon>
                            <ListItemText primary={item[0]} />
                        </ListItem>
                    )}
                </List>
                <Divider />
                <List>
                    <ListItem button onClick={props.entry_logout}>
                        <ListItemIcon><ExitToApp/></ListItemIcon>
                        <ListItemText primary="Log Out" />
                    </ListItem>
                </List>
                </div>
            </SwipeableDrawer>
        </>
    )
}

const mstp = (state) => {
    return ({
        sidemenu_open: state.appNav.sidemenu_open,
        search_enabled: state.app.profile?(state.app.profile.twitter_save==true || state.app.profile.facebook_save==true ) : false
    });
}

export default connect(mstp, actions)(Header);
