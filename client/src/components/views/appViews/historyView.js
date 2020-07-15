import React, {useState, useEffect} from 'react'

import { Container, TextField, Button, Typography, Paper } from '@material-ui/core';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {Facebook, Twitter, Language, Sentiment} from '@material-ui/icons';

import happy from '../../../media/emotions/happy.svg';
import sad from '../../../media/emotions/sad.svg';
import angry from '../../../media/emotions/angry.svg';
import hate from '../../../media/emotions/hate.svg';
import neutral from '../../../media/emotions/neutral.svg';

import ViewTitle from '../../applicationComponents/ViewTitle';

const HistoryCard = (props) => {
    let heading = ['Complete',<Language/>];
    if (props.type == 'facebook') heading = ['Facebook',<Facebook/>]; 
    if (props.type == 'twitter') heading = ['Twitter',<Twitter/>]; 
    let icon = happy;
    switch (props.dominant_emotion){
        case 'sad':
            icon = sad;
            break;
        case 'hate':
            icon = hate;
            break;
        case 'neutral':
            icon = neutral;
            break;
        case 'angry':
            icon = angry;
            break;
    }
    return (
        <a className='history_wrapper' onClick={() => props.clickHandler(props.id)}>
        <Paper variant="elevation" elevation={4} className='history_card'>
            <div className="history_info">
                <div className='history_type'>
                {heading[1]}&nbsp;
                <Typography>{heading[0]} Analysis</Typography>
                </div>
                <Typography className="history_time">Performed on {props.time}</Typography>
                <Typography>Dominant Emotion: <b>{props.dominant_emotion}</b></Typography>
            </div>
            <div className='history_icon'>
                <img src={icon}/>
            </div>
        </Paper>
        </a>
    )
}

const dominant_emotion_deriver = (data) => {
    let dominant = '';
    let max_num = 0;
    Object.keys(data).map(x => {
        if (data[x] > max_num){
            max_num = data[x];
            dominant = x;
        }
    })
    return dominant;
}

const time_formatter = (time) => {
    let new_time = new Date(time);
    let hours = new_time.getHours();
    let minutes = "0" + new_time.getMinutes();
    let seconds = "0" + new_time.getSeconds();
    let formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    let d = new_time.getDate();
    let m = new_time.getMonth();
    let y = new_time.getFullYear();
    return `${formattedTime} ${d}/${m}/${y}`
}

function HistoryView(props) {

    const [viewHeight, setViewHeight ] = useState(0); 

    useEffect(() => {
        const bottombarheight = document.getElementById('bottom-bar').clientHeight;
        const innerviewtop = document.getElementById('inner-view').offsetTop;
        const windowheight = window.innerHeight;
        setViewHeight(windowheight-innerviewtop-bottombarheight);
        console.log(windowheight-innerviewtop-bottombarheight)
    });
    return (
        <Container className="history">
            <ViewTitle title="History"/>
            <div id="inner-view" style={{height:viewHeight}}>
            {
                props.historical_data?
                Object.keys(props.historical_data).map(x => {
                    return (
                    <HistoryCard
                        key={x}
                        clickHandler={props.app_select_report}
                        id={x}
                        type={props.historical_data[x].type}
                        time={time_formatter(props.historical_data[x].time)}
                        dominant_emotion={dominant_emotion_deriver(props.historical_data[x].complete_analysis)}
                    />
                    )
                }):null
            }
            </div>
           
        </Container>
    )
}

const mstp = (state) => {
    return ({
        historical_data: state.app.historical_data
    });
}

export default connect(mstp,actions)(HistoryView);