import React, {useState, useEffect} from 'react'
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import { Container, Paper, Button, Tabs, Tab, AppBar, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, FormControl, InputLabel  } from '@material-ui/core';
import {connect} from 'react-redux';
import { Close } from '@material-ui/icons';
import { ResponsiveRadar } from '@nivo/radar'


import * as actions from '../../../actions';

function tabProps(index) {
    return {
      id: `scrollable-auto-tab-${index}`,
      'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <Paper
            variant="elevation" elevation={4} 
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Paper>
    );
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

const BargraphView = ({data, y_data, x_data}) => {
    let new_data = Object.keys(data).map(x => { return ({sentiments:x, posts:data[x] })})
    new_data = new_data.reverse()
    return (
        <ResponsiveContainer width="100%" height={200}>
        <BarChart data={new_data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sentiments" tick={{fontSize: 10}} interval={0}/>
        <Tooltip />
        <Bar dataKey="posts" fill="#3b5998" />
      </BarChart>
      </ResponsiveContainer>
      
    )
}

const monthly_dominant_emotion = (data, months) => {
    let new_array = months.map(x => {return({month:x,sentiment: dominant_emotion_deriver(data[x])})})
    return new_array;
}

const month_data_counter = (data) => {
    let total = 0;
    Object.keys(data).map(x => total+=data[x])
    return total;
}

const sentiment_breakdown_view = (data, total) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>Sentiment</TableCell>
                    <TableCell align="right">Posts</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {
                        Object.keys(data).map(x => {
                            return (
                            <TableRow>  
                                <TableCell component="th" scope="row">{x}</TableCell>
                                <TableCell align="right">{data[x]}</TableCell>
                                <TableCell align="right">{(100*data[x]/total).toFixed(2)}%</TableCell>
                            </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )

}

const SingleRadar = (({type, data}) => {

    const new_data = Object.keys(data).map(x => {return {sentiment: x, [type]: data[x]}})

    return <div style={{ height: 300 }}>
        <ResponsiveRadar
            data={new_data}
            keys={[ type ]}
            indexBy="sentiment"
            maxValue="auto"
            margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
            />
    </div>
})

const CompleteRadar = ({ data }) => {
    console.log(data)
    return <div style={{ height: 300 }}>
        <ResponsiveRadar
            data={data}
            keys={[ 'facebook', 'twitter' ]}
            indexBy="sentiment"
            maxValue="auto"
            margin={{ top: 40, right: 50, bottom: 40, left: 50 }}
            legends={[
            {
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }
        ]}
    /></div>
}

const SingleReportView = ({height, data}) => {
    const [value, setValue] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(data.all_months[0]);
    let month_data = data.month_filtered_data[selectedMonth];
    let month_count = {};
    data.all_months.map(x => {         
        let count = Object.values(data.month_filtered_data[x]);
        let full_count = count.reduce((a,b)=> a+b, 0);
        month_count[x] = full_count;
    })
    return (<>
        <AppBar position="static" color="default">
            <Tabs value={value} onChange={(e,val) => setValue(val)} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
                <Tab label="Info" {...tabProps(0)} />
                <Tab label="Break-down" {...tabProps(1)} />
                <Tab label="Visuals" {...tabProps(2)} />
                <Tab label="Monthly Sentiment" {...tabProps(3)} />
                <Tab label="Monthly Break-down" {...tabProps(4)} />
            </Tabs>
        </AppBar>
        <Paper variant='outlined' id='report_panel' style={{height: height-10, overflow:'scroll' }}>
            <TabPanel elevation={0} value={value} index={0} >
                <TableContainer component={Paper} variant="outlined">
                    <Table size='small'>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">Dominant emotion</TableCell>
                                <TableCell align="right">{dominant_emotion_deriver(data.complete_analysis)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Number of post analysed</TableCell>
                                <TableCell align="right">{data.total_posts}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Starting date</TableCell>
                                <TableCell align="right">{data.time_start}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Ending date</TableCell>
                                <TableCell align="right">{data.time_end}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Months spanned</TableCell>
                                <TableCell align="right">{data.all_months.length}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel elevation={0} value={value} index={1} >
                {sentiment_breakdown_view(data.complete_analysis, data.total_posts)}
            </TabPanel>
            <TabPanel elevation={0} value={value} index={2} >
                <SingleRadar type={data.type} data={data.complete_analysis}/>
                <div className='space-1rem'></div>
                <BargraphView data={data.complete_analysis}/>
            </TabPanel>
            <TabPanel elevation={0} value={value} index={3} >
                <TableContainer component={Paper} variant="outlined">
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Month</TableCell>
                                <TableCell align="right">Dominant Emotion</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                monthly_dominant_emotion(data.month_filtered_data, data.all_months).map(x => {
                                    return (
                                    <TableRow>  
                                        <TableCell component="th" scope="row">{x.month}</TableCell>
                                        <TableCell align="right">{x.sentiment}</TableCell>
                                    </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className='space-1rem'></div>
                <Paper variant='outlined' style={{padding: '10px'}}>
                    <Typography variant='h6'>Posts per month</Typography>
                    <BargraphView data={month_count}/>
                </Paper>
            </TabPanel>
            <TabPanel elevation={0} value={value} index={4} >
            <FormControl fullWidth>
                <InputLabel>Selected Month</InputLabel>
                <Select
                     value={selectedMonth}
                     onChange={e => setSelectedMonth(e.target.value)}
                >
                    {data.all_months.map(x => <option style={{fontFamily: 'Helvetica'}} value={x}>{x}</option>)}
                </Select>
            </FormControl>
            <div className="space-1rem"></div>
            <Paper variant="outlined" style={{padding: '10px 20px'}}>
                <Typography variant='h6'>Information</Typography>
                <TableContainer >
                    <Table size='small'>
                        <TableBody>
                            <TableRow>  
                                <TableCell align="left">Total Posts</TableCell>
                                <TableCell align="right">{month_data_counter(month_data)}</TableCell>
                            </TableRow>
                            <TableRow>  
                                <TableCell align="left">Dominant Emotion</TableCell>
                                <TableCell align="right">{dominant_emotion_deriver(month_data)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <div className="space-1rem"></div>       
            {sentiment_breakdown_view(month_data, month_data_counter(month_data))}
            <div className="space-1rem"></div>       
            <Paper variant="outlined" style={{padding: '10px'}}>
                <BargraphView data={month_data}/>
            </Paper>
        </TabPanel>
        </Paper>
    </>)
}

const post_sum = (data) => {
    let count = 0;
    Object.keys(data).map(x => count+=data[x]);
    return count;
}

const complete_emotions = (data) => {
    let all_emotions = {'happy':0, 'sad':0, 'angry':0, 'hate':0, 'neutral':0};
    return {...all_emotions, ...data}
}
const complete_prepare_for_radar = (fb_data, twitter_data) => {
    let all_emotions = ['happy', 'sad', 'angry', 'hate', 'neutral'];
    let data = all_emotions.map(x => {
        return ({
            sentiment: x,
            facebook: fb_data[x]?fb_data[x]:0, 
            twitter: twitter_data[x]?twitter_data[x]:0 
        })
    })
    return data;
}

const CompleteBreakDown = ({facebook , twitter}) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>Sentiment</TableCell>
                    <TableCell align="right">Facebook</TableCell>
                    <TableCell align="right">Twitter</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {
                        Object.keys(complete_emotions(facebook)).map(x => {
                            if (x == 0 && twitter[x] == 0) {
                                return null;
                            }
                            return (
                            <TableRow>  
                                <TableCell component="th" scope="row">{x}</TableCell>
                                <TableCell align="right">{facebook[x]?facebook[x]:0}</TableCell>
                                <TableCell align="right">{twitter[x]?twitter[x]:0}</TableCell>
                            </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const CompleteMonthlySentiment = ({months, facebook, twitter}) => {
    return (
        <TableContainer component={Paper} variant="outlined">
            <Table size='small'>
            <TableHead>
                <TableRow>
                    <TableCell>Month</TableCell>
                    <TableCell align="right">Facebook</TableCell>
                    <TableCell align="right">Twitter</TableCell>
                </TableRow>
            </TableHead>
                <TableBody>
                    {
                        months.map(x => {
                            return (
                            <TableRow>  
                                <TableCell component="th" scope="row">{x}</TableCell>
                                <TableCell align="right">{dominant_emotion_deriver(facebook[x])}</TableCell>
                                <TableCell align="right">{dominant_emotion_deriver(twitter[x])}</TableCell>
                            </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

const DoubleReportView = ({height, data}) => {
    const [value, setValue] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(data.shared_months[0]);
    return (<>
        <AppBar position="static" color="default">
            <Tabs value={value} onChange={(e,val) => setValue(val)} indicatorColor="primary" textColor="primary" variant="scrollable" scrollButtons="auto" aria-label="scrollable auto tabs example">
                <Tab label="Info" {...tabProps(0)} />
                <Tab label="Visuals" {...tabProps(1)} />
                <Tab label="Break-down" {...tabProps(2)} />
                <Tab label="Monthly Sentiments" {...tabProps(3)} />
                <Tab label="Monthly Break-down" {...tabProps(4)} />
            </Tabs>
        </AppBar>
        <Paper variant='outlined' id='report_panel' style={{height: height-10, overflow:'scroll' }}>
            <TabPanel elevation={0} value={value} index={0} >
                <TableContainer component={Paper} variant="outlined">
                    <Table size='small'>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">Dominant emotion</TableCell>
                                <TableCell align="right">{complete_dominant_emotion_deriver(data.facebook, data.twitter)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Facebook emotion</TableCell>
                                <TableCell align="right">{dominant_emotion_deriver(data.facebook.complete_analysis)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">twitter emotion</TableCell>
                                <TableCell align="right">{dominant_emotion_deriver(data.twitter.complete_analysis)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Facebook posts</TableCell>
                                <TableCell align="right">{post_sum(data.twitter.complete_analysis)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Twitter posts</TableCell>
                                <TableCell align="right">{post_sum(data.facebook.complete_analysis)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell component="th" scope="row">Months spanned</TableCell>
                                <TableCell align="right">{data.shared_months.length}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel elevation={0} value={value} index={1} >
                <CompleteRadar data = {complete_prepare_for_radar(data.facebook.complete_analysis,data.twitter.complete_analysis)}/>
            </TabPanel>
            <TabPanel elevation={0} value={value} index={2} >
                <CompleteBreakDown facebook={data.facebook.complete_analysis} twitter={data.twitter.complete_analysis}/>
            </TabPanel>
            <TabPanel elevation={0} value={value} index={3} >
                <CompleteMonthlySentiment months={data.shared_months} facebook={data.facebook.month_filtered_data} twitter={data.twitter.month_filtered_data} />
            </TabPanel>
            <TabPanel elevation={0} value={value} index={4} >
                <FormControl fullWidth>
                    <InputLabel>Selected Month</InputLabel>
                    <Select
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(e.target.value)}
                    >
                        {data.shared_months.map(x => <option style={{fontFamily: 'Helvetica'}} value={x}>{x}</option>)}
                    </Select>
                </FormControl>
                <div className="space-1rem"></div>
                <Paper variant="outlined" style={{padding: '10px 20px'}}>
                    <Typography variant='h6'>Information</Typography>
                    <TableContainer >
                        <Table size='small'>
                            <TableBody>
                                <TableRow>  
                                    <TableCell align="left">Total Faceook posts</TableCell>
                                    <TableCell align="right">{month_data_counter(data.facebook.month_filtered_data[selectedMonth])}</TableCell>
                                </TableRow>
                                <TableRow>  
                                    <TableCell align="left">Total Twitter posts</TableCell>
                                    <TableCell align="right">{month_data_counter(data.twitter.month_filtered_data[selectedMonth])}</TableCell>
                                </TableRow>
                                <TableRow>  
                                    <TableCell align="left">Facebook sentiments</TableCell>
                                    <TableCell align="right">{dominant_emotion_deriver(data.facebook.month_filtered_data[selectedMonth])}</TableCell>
                                </TableRow>
                                <TableRow>  
                                    <TableCell align="left">Twitter sentiments</TableCell>
                                    <TableCell align="right">{dominant_emotion_deriver(data.twitter.month_filtered_data[selectedMonth])}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
                <div className='space-1rem'></div>
                <CompleteBreakDown facebook={data.facebook.month_filtered_data[selectedMonth]} twitter={data.twitter.month_filtered_data[selectedMonth]}/>
            </TabPanel>
        </Paper>
    </>)
}

function ReportView(props) {
    let report = props.historical_data[props.selected_report];
    const [viewHeight, setViewHeight ] = useState(0); 

    useEffect(() => {
        const bottombarheight = document.getElementById('bottom-bar').clientHeight;
        const innerviewtop = document.getElementById('report_panel').offsetTop;
        const windowheight = window.innerHeight;
        setViewHeight(windowheight-innerviewtop-bottombarheight);
    });
    return (
        <Container className="report">
            <div className="report-header">
                <div className='report-title'>
                    <Typography variant="h5">{report.type} analysis report</Typography>
                </div>
                <div>
                    <Button
                    onClick={()=> props.app_report_view(false)}
                    color='primary'
                    size="large"
                    variant="outline"
                ><Close/></Button>
                </div>
            </div>
           <div id="inner-view" >
                {report.type == 'complete'? <DoubleReportView height={viewHeight} data={report}/>:<SingleReportView height={viewHeight} data={report}/>} 
                <div className='space-1rem'></div>
                
           </div>
        </Container>
    )
}

const mstp = (state) => {
    return ({
        historical_data: state.app.historical_data,
        selected_report: state.app.selected_report
    });
}

export default connect(mstp,actions)(ReportView);