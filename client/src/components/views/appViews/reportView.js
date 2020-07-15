import React, {useState, useEffect} from 'react'
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import { Container, Paper, Button, Tabs, Tab, AppBar, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, FormControl, InputLabel  } from '@material-ui/core';
import {connect} from 'react-redux';
import { Close } from '@material-ui/icons';

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
                <Tab label="Visualization" {...tabProps(2)} />
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
                                <TableCell component="th" scope="row">Months Spanned</TableCell>
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

const DoubleReportView = (props) => {
    return 'I am the double view';
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
                {report.type == 'complete'? <DoubleReportView data={report}/>:<SingleReportView height={viewHeight} data={report}/>} 
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