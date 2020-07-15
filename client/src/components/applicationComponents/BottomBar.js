import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Icon, Typography } from '@material-ui/core';
import {Home, Timeline, History} from '@material-ui/icons';
import {connect} from 'react-redux';
import * as actions from '../../actions';

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
        padding: 0,
        right: 0,
        left: 0,
    }
}));

function BottomBar(props) {

    const classes = useStyles();

    return (
        <AppBar id="bottom-bar" position="fixed" className={classes.appBar}>
            <div className='toolbar'>
                {[
                    ['Home', <Home/>, 'home'],
                    ['Analysis', <Timeline/>, 'analysis'],
                    ['History', <History/>, 'history']
                ].map(item=> 
                    <button key={'bottombar'+item[2]} onClick={() => props.appnav_view_change(item[2])} className={item[2] == props.view? 'selected':'' }>
                        <div className='icon'>
                            {item[1]}
                        </div>
                        <div className='text'>
                            <Typography>{item[0]}</Typography>
                        </div>
                    </button>
                )}
            </div>
        </AppBar>
    )
}

const mstp = (state) => {
    return ({
        view: state.appNav.application_view,
    })
}

export default connect(mstp, actions)(BottomBar);
