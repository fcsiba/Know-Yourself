import React, {useState, useEffect} from 'react'

import { Container, Button, Paper, Typography } from '@material-ui/core';
import {connect} from 'react-redux';
import * as actions from '../../../actions';
import {Facebook, Twitter, Warning, Assessment, ArrowBackIos} from '@material-ui/icons';

import Lottie from 'react-lottie';

import * as animationData from '../../../lottie/loader.json';
import * as tick from '../../../lottie/tick.json';

import ViewTitle from '../../applicationComponents/ViewTitle';

const AnalysisButtonView = (props) => {
    if (!props.display) {
        return null;
    }
    return (
        <div className="buttonview">
            <Button
                onClick={()=> props.app_perform_analysis('facebook')}
                color='primary'
                size="large"
                variant="contained"
                fullWidth
            ><Facebook/>&nbsp;Facebook Analysis</Button>
            <div className="space-1rem"></div>
            <Button
                onClick={()=> props.app_perform_analysis('twitter')}
                className={props.twitter_enabled?'':'disabled'}
                disabled={!props.twitter_enabled}
                color='primary'
                size="large"
                variant="contained"
                fullWidth
            ><Twitter/>&nbsp;Twitter Analysis</Button>
            <div className="space-1rem"></div>
            <Button
                onClick={()=> props.app_perform_analysis('complete')}
                className={props.twitter_enabled?'':'disabled'}
                disabled={!props.twitter_enabled}
                color='primary'
                size="large"
                variant="contained"
                fullWidth
            ><Facebook/>+<Twitter/>&nbsp;Complete Analysis</Button>
            {
                !props.twitter_enabled? <>
                <div className="space-1rem"></div>
                <Paper variant="elevation" elevation={4} className='analysis_warning'>
                    <div>
                        <Warning/>&nbsp;
                        <Typography variant='h6'>Twitter username not set</Typography>
                    </div>
                    <Typography>
                        You cannot perform Twitter analysis without setting your Twitter username.
                    </Typography>
                </Paper>
                </>
                :
                <>
                </>
            }
        </div>
    );
}

const AnalysisPerformanceView = (props) => {
    if (!props.display) {
        return null;
    }
    const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: animationData.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
    const tickdefaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: tick.default,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
    };
    let title = props.ongoing_analysis.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    return (
        <Paper variant="elevation" elevation={4} className='analysis_processing'>
            <div>
                <Typography variant='h6'>{title} analysis {props.completed?'completed':'underway'}</Typography>
            </div>
            <div className="animation">
                <Lottie options={props.completed?tickdefaultOptions:defaultOptions} />
            </div>
            {props.completed?
            <>
            <Button
                className='check-report'
                onClick={()=> props.app_report_view(true)}
                color='primary'
                size="large"
                variant="contained"
                fullWidth
            ><Assessment/>&nbsp;Check Report</Button>
            <div className="space-1rem"></div>
            <Button
                className='go-back'
                onClick={()=> props.app_go_back_analysis('twitter')}
                color='primary'
                size="large"
                variant="contained"
                fullWidth
            ><ArrowBackIos/>Go back</Button>
            </>:
            <Typography>
                Please wait while the analysis is complete.
            </Typography>
            }
        </Paper>
    );
}

function AnalysisView(props) {

    return (
        <Container>
           <ViewTitle title="Analysis"/>
           <div className='analysis inner-view'>
                <AnalysisButtonView app_perform_analysis={props.app_perform_analysis} display={props.analysis_state == 0} twitter_enabled={props.twitter_enabled}/>
                <AnalysisPerformanceView app_report_view={props.app_report_view} app_go_back_analysis={props.app_go_back_analysis} ongoing_analysis={props.ongoing_analysis} completed={props.analysis_state == 2} display={props.analysis_state == 1 || props.analysis_state == 2}/>
           </div>
        </Container>
    )
}

const mstp = (state) => {
    return ({
        analysis_state: state.app.analysis_state,
        twitter_enabled: state.app.profile?state.app.profile.twitterTag?true:false:false,
        ongoing_analysis: state.app.ongoing_analysis
    });
}

export default connect(mstp,actions)(AnalysisView);