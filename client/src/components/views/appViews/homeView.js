import React, {useState, useEffect} from 'react'

import { Container, TextField, Button, Typography, Paper } from '@material-ui/core';
import {connect} from 'react-redux';
import * as actions from '../../../actions';

import ViewTitle from '../../applicationComponents/ViewTitle';

const find_latest_report = (data) => {
    if (!data) return null;
    let max = Object.keys(data).reduce(function(a, b) {
        return Math.max(a, b);
    });
    return data[max]
}

const complete_dominant_emotion_deriver = (fb_data, twitter_data) => {
    if (fb_data && twitter_data){
        let collect = [fb_data.complete_analysis, twitter_data.complete_analysis];
        const result = {};
        Object.values(collect).forEach(basket => {
            for (let [key, value] of Object.entries(basket)) {
                if (result[key]) { 
                    result[key] += value; 
                } else { 
                    result[key] = value;
                }
            }
        });
        return dominant_emotion_deriver(result);
    } else {
        return '';
    }
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

function HomeView(props) {
    let latest_report = find_latest_report(props.historical_data)
    return (
        <Container className="home">
            <ViewTitle title="Welcome"/>
            <Typography>Start analyzing yourself today!</Typography>
            <div class='space-1rem'></div>
            <Button
                // disabled={props.tag == tag}
                onClick={()=>props.appnav_view_change('analysis')}
                size="large"
                variant="contained"
                fullWidth
                color='primary'>
                    Start Analyzing
            </Button>
            <div class='space-1rem'></div>
            {
                latest_report?

            <Paper variant="elevation" elevation={4} className='analysis_processing'>
                <Typography>Your last analysis report</Typography>
                <Typography>performed at {time_formatter(latest_report.time)}</Typography>
                <Typography>performed on {latest_report.type}</Typography>
                <Typography><b>Dominant emotion: {latest_report.type=='complete'?complete_dominant_emotion_deriver(latest_report.facebook, latest_report.twitter):dominant_emotion_deriver(latest_report.complete_analysis)}</b></Typography>
            </Paper>:null
            }
        </Container>
    )
}

const mstp = (state) => {
    return ({
        historical_data: state.app.historical_data
    });
}

export default connect(mstp,actions)(HomeView);