// Check on 9:15 PM - 15/07/2020
// WORK LEFT ON LINE 219

var Twit = require('twit')
var axios = require('axios')

const {
    updateTwitterTagSchema,
    updateSaveSettingSchema,
} = require('./joiSchema');

var T = new Twit({
    consumer_key: process.env.twitter_consumer_key,
    consumer_secret: process.env.twitter_consumer_secret,
    app_only_auth: true
})

var graph = require('fbgraph');

const { fetchByID, updateDocByID } = require('../utils/db_util');
const { time } = require('console');
const { filter } = require('bluebird');

const twitter_fetch = (tag) => new Promise((resolve, reject) => {
    T.get('statuses/user_timeline', {
        screen_name: tag,
        count: 200
    }, function (err, data, response) {
        if (err) reject('failed');
        newData = [];
        data.map(x => {
            newData.push({
                id: x.id,
                time: x.created_at,
                text: x.text,
            })
        })
        let ndata = JSON.stringify(newData);
        axios({
            method: 'post',
            url: `http://localhost:${process.env.FLASK_PORT}/analysis`,
            data: {
                data:ndata
            }
        })
        .then(({data}) => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    })
})

const facebook_fetch = (accessToken) => new Promise((resolve, reject) => {
    graph.setAccessToken(accessToken);
    graph.setVersion("2.8");
    graph.get('me/posts', {access_token: accessToken}, function(err, response) {
        if (err) reject('failed')
        new_data = response.data.filter(x => x.message?true:false)
        formatted_data = new_data.map(x => {return {time:x.created_time,text: x.message,id: x.id}})
        let ndata = JSON.stringify(formatted_data);
        axios({
            method: 'post',
            url: `http://localhost:${process.env.FLASK_PORT}/analysis`,
            data: {
                data:ndata
            }
        })
        .then(({data}) => {
            resolve(data);
        })
        .catch(error => {
            reject(error);
        })
    });
})

function timeconverter (time) {
    let date = new Date(time);
    let day = date.getDay(); 
    let month = date.getMonth(); 
    let year = date.getFullYear(); 
    return `${day}/${month}/${year}`;
}

const analyzed_data_organizer = (data, db, id, type, save=true) => new Promise((resolve,reject)=> {
    analysis_time = + new Date()
    complete_analysis_raw = data.map(x => x.sentiment)
    var complete_analysis = {};
    complete_analysis_raw.forEach(function(x) { complete_analysis[x] = (complete_analysis[x] || 0)+1; });
    all_months = [];
    month_formatted_data = data.map(x => {
        const formatter = new Intl.DateTimeFormat('en-us', { month: 'long', year: 'numeric' })
        let month = formatter.format(new Date(x.time)).replace(/\s+/g, '-');
        all_months.push(month)
        return {
            month,
            sentiment: x.sentiment
        }
    })
    all_months = [...new Set(all_months)];
    month_filtered_data = {};
    all_months.forEach(month => {
        month_formatted_data.forEach(data => {
            if (data['month'] == month) {
                if (month_filtered_data[month] == undefined){
                    month_filtered_data = {...month_filtered_data, [month]: [data.sentiment]} 
                } else {
                    month_filtered_data = {...month_filtered_data, [month]: [...month_filtered_data[month],data.sentiment]} 
                }
            }
        });
    });
    all_months.forEach(month => {
        var new_data = {};
        month_filtered_data[month].forEach(function(x) { new_data[x] = (new_data[x] || 0)+1; });
        month_filtered_data[month] = new_data;
    })
    let new_analysis = {
        id: analysis_time,
        time: analysis_time,
        type: type,
        total_posts: data.length,
        time_start: timeconverter(data[0].time),
        time_end: timeconverter(data[data.length-1].time),
        complete_analysis,
        month_filtered_data,
        all_months
    }
    if (!save) {
        resolve(new_analysis);
    }
    fetchByID(db, 'users', String(id))
    .then(data => {
        analysis = data.analysis;
        if (analysis == undefined) analysis = {};
        analysis = {...analysis, [analysis_time]: new_analysis};
        data = {...data,analysis}
        updateDocByID(db, 'users', String(id), data)
        .then((x) => {
            resolve(new_analysis)
        })
        .catch(error => {
            reject('failed')
        })
    })
})

const save_post_data = (db, id, type, data) => {
    fetchByID(db, 'users', String(id))
    .then(rdata => {
        let new_data = rdata;
        let post_data = {};
        data.map(x => {post_data[x.id] = x});
        if ((type == 'facebook' && rdata.facebook_save == true) || (type == 'twitter' && rdata.twitter_save == true)) {
            let old_data = {};
            let old_type_data = {};
            if (rdata.saved_data){
                old_data = rdata.saved_data;
                if (rdata.saved_data[type]) {
                    old_type_data = rdata.saved_data[type];
                }
            }
            new_data = {...rdata, saved_data: {...old_data, [type]: {...old_type_data, ...post_data}}}
        updateDocByID(db, 'users', String(id), new_data) 
        }
    })
}

const combine_monthly_data = (data) => {
    const result = {};
    Object.values(data).forEach(basket => {
        for (let [key, value] of Object.entries(basket)) {
            if (result[key]) { 
                result[key] += value; 
            } else { 
                result[key] = value;
            }
        }
    });
    return result;
}

module.exports = (app, db) => {

    app.use((req,res,next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/login');
        }
    })

    app.post('/updateTwitterTag', (req,res) => {
        const validation = updateTwitterTagSchema.validate(req.body);
        if (validation.error !== null){
            res.status(400).send(validation.error.details[0].message);
        } else {
            fetchByID(db, 'users', req.user.profile.id)
            .then(data => {
                updateDocByID(db, 'users', req.user.profile.id, {...data, twitterTag: req.body.tag})
                .then(_data => {
                    req.user.profile.twitterTag = req.body.tag;
                    res.send(_data)
                })
                .catch(error => {
                    res.status(500).send("Unable to make changes")
                })
            })
            .catch(error => {
                res.status(400).send(`No user exists with id: ${req.user.profile.id}`)
            })
        }
    });

    app.post('/updateSaveSetting', (req,res) => {
        const validation = updateSaveSettingSchema.validate(req.body);
        if (validation.error !== null){
            res.status(400).send(validation.error.details[0].message);
        } else {
            fetchByID(db, 'users', req.user.profile.id)
            .then(data => {
                updateDocByID(db, 'users', req.user.profile.id, {...data, facebook_save: req.body.facebook_save,twitter_save: req.body.twitter_save,})
                .then(_data => {
                    res.send(_data)
                })
                .catch(error => {
                    res.status(500).send("Unable to make changes")
                })
            })
            .catch(error => {
                res.status(400).send(`No user exists with id: ${req.user.profile.id}`)
            })
        }
    });

    // work needs to be done here
    app.post('/analysis', (req,res) => {
        if (req.body.type == 'twitter') {
            if(req.user.profile.twitterTag){
                twitter_fetch(req.user.profile.twitterTag)
                .then((raw_data) => {
                    analyzed_data_organizer(raw_data,db,req.user.profile._json.id,req.body.type)
                    .then(data => {
                        save_post_data(db,req.user.profile._json.id,'twitter', raw_data);
                        res.send(data);
                    })
                    .catch(err => {
                        res.status(500).send("Error occurred while analyzing");
                    })
                })
                .catch(error => {
                    res.status(500).send(error)
                }) 
            } else {
                res.status(400).send('Twitter username missing, hence cannot perform twitter analysis')
            }
        } else if (req.body.type == 'facebook') {
            facebook_fetch(req.user.accessToken)
            .then(raw_data => {
                analyzed_data_organizer(raw_data,db,req.user.profile._json.id,req.body.type)
                .then(data => {
                    save_post_data(db,req.user.profile._json.id,'facebook', raw_data);
                    res.send(data);
                })
                .catch(err => {
                    res.status(500).send("Error occurred while analyzing");
                })
            })
            .catch(err => {
                res.status(500).send('failed')
            })
        } else {
            if(req.user.profile.twitterTag){
                facebook_fetch(req.user.accessToken)
                .then(facebook_data => {
                    twitter_fetch(req.user.profile.twitterTag)
                    .then(twitter_data => {
                        analyzed_data_organizer(facebook_data,db,req.user.profile._json.id,'facebook', false)
                        .then(analyzed_facebook_data => {
                            analyzed_data_organizer(twitter_data,db,req.user.profile._json.id,'twitter', false)
                            .then(analyzed_twitter_data => {
                                shared_months = analyzed_facebook_data.all_months.filter(value => analyzed_twitter_data.all_months.includes(value))
                                if (!shared_months) {
                                    res.status(400).send('Twitter and facebook data do not share month');
                                }
                                let t_time = + new Date();
                                let filtered_twitter_data = {}
                                shared_months.map(x => filtered_twitter_data[x] = analyzed_twitter_data.month_filtered_data[x]);
                                let filtered_facebook_data = {}
                                shared_months.map(x => filtered_facebook_data[x] = analyzed_facebook_data.month_filtered_data[x]);
                                complete_analysis_data = {
                                    id: t_time,
                                    time: t_time,
                                    type: 'complete',
                                    shared_months,
                                    facebook: {
                                        complete_analysis: combine_monthly_data(filtered_facebook_data),
                                        month_filtered_data: filtered_facebook_data
                                    },
                                    twitter: {
                                        complete_analysis: combine_monthly_data(filtered_twitter_data),
                                        month_filtered_data: filtered_twitter_data
                                    }
                                }
                                fetchByID(db, 'users', String(req.user.profile._json.id))
                                .then(data => {
                                    analysis = data.analysis;
                                    if (analysis == undefined) analysis = {};
                                    analysis = {...analysis, [t_time]: complete_analysis_data};
                                    data = {...data,analysis}
                                    updateDocByID(db, 'users', String(req.user.profile._json.id), data)
                                    .then((x) => {
                                        res.send(complete_analysis_data)
                                    })
                                    .catch(error => {
                                        res.status(500).send('Failed')
                                    })
                                })
                            })
                            .catch(err => {
                                res.status(500).send('failed');
                            })
                        })
                        .catch(err => {
                            res.status(500).send('failed');
                        })
                        save_post_data(db,req.user.profile._json.id,'twitter', twitter_data);
                        save_post_data(db,req.user.profile._json.id,'facebook', facebook_data);
                    })
                    .catch(error => {
                        res.status(500).send('failed')
                    })
                })
                .catch(err => { 
                    res.status(500).send('failed')
                })
            } else {
                res.status(400).send('Twitter username missing, hence cannot perform complete analysis')
            }
        }
    })

    app.post('/fetchSearchData', (req, res) => {
        fetchByID(db, 'users', req.user.profile.id)
        .then(data => {
            if (data.saved_data){
                res.send(data.saved_data);
            } else {
                res.send([]);
            }
        })
        .catch(error => {
            res.status(400).send(`No user exists with id: ${req.user.profile.id}`)
        })
    })
    
}