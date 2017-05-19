var express = require('express');
var cfenv = require('cfenv');
var request = require('request');
var feed = require('rss-to-json');
var fs = require('fs');
var PythonShell = require('python-shell');

// create a new express server
var app = express();
var appEnv = cfenv.getAppEnv();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

//To render
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/public');

var routeArray = ['/', '/home', '/index', '/index.html'];
app.get(routeArray, function(req, res) {});

app.get('/stock_data/*', function(req, res) {
    res.render('stock.html');
});

app.post('/redirect', function(req, res) {
    res.redirect('/stock_data/' + req.body.ticker);
});

app.get('/stock/*', function(req, res) {
    var pyshell = new PythonShell('financials.py', {
        args: [req.url.substring(7)]
    });
    pyshell.on('message', function(message) {
        if (message == 'False') {
            res.send('Error: Invalid Stock Ticker');
        } else {
            console.log('getArticles(' + req.url.substring(7) + ', ' + message.trim() + ')');
            getArticles(req.url.substring(7), message.trim(), function(ticker, company, scores, links) {
                var positive = 0;
                var negative = 0;
                var sentiment = "";
                for (var i = 0; i < scores.length; i++) {
                    if (scores[i].tag == 'positive') {
                        positive++;
                    } else if (scores[i].tag == 'negative') {
                        negative++;
                    }
                }
                if (positive > negative) {
                    sentiment = "Positive (+" + (positive - negative) + ")";
                } else if (positive < negative) {
                    sentiment = "Negative (-" + (negative - positive) + ")";
                } else {
                    sentiment = "Neutral (+/-0)";
                }
                res.send({
                    'company': message.trim(),
                    'ticker': ticker,
                    'sentiment': sentiment,
                    'positive': positive,
                    'negative': negative,
                    'links': links
                });
            });
        }
    });
});

app.listen(appEnv.port, '0.0.0.0', function() {
    console.log("server starting on " + appEnv.url);
});

//Grab articles from Bing
function getArticles(ticker, company, finalCB) {
    var links = [];
    var url = "https://bing.com/news/search?q=" + company + "&format=rss";
    feed.load(url, function(err, rss) {
        //console.log(rss);
        var items = rss.items;
        for (var i = 0; i < items.length; i++) {
            links.push(items[i]);
        }
        scoreSentiment(ticker, company, links, 0, [], finalCB);
    });
}

function scoreSentiment(ticker, company, links, count, scores, finalCB) {
    if (count < links.length) {
        checkUrl(links[count], function(data) {
            console.log(data);
            scores.push(data);
            count++;
            scoreSentiment(ticker, company, links, count, scores, finalCB);
        });
    } else {
        finalCB(ticker, company, scores, links);
    }
}

function checkUrl(link, callback) {
    //console.log(link);
    request({
        url: link.url
    }, function(err, res, body) {
        if (err) {
            //For loop errors
            callback({
                'url': link.url,
                'title': link.title,
                'description': link.description,
                'created': link.created,
                'pos': 0,
                'neg': 0,
                'total': 0,
                'tag': 'invalid'
            });
        } else {
            text = body.toLowerCase();
            text = text.split(" ");
            var positive_arr = fs.readFileSync('positive-words.txt').toString().split('\n');
            var negative_arr = fs.readFileSync('negative-words.txt').toString().split('\n');
            var pos = 0;
            var neg = 0;
            for (var i = 0; i < text.length; i++) {
                if (text[i] !== '' && text[i] != '=' && text[i] != ' ') {
                    for (var j = 0; j < negative_arr.length; j++) {
                        if (j < positive_arr.length) {
                            if (text[i].trim() === positive_arr[j].trim()) {
                                pos = pos + 1;
                            }
                        }
                        if (text[i].trim() === negative_arr[j].trim()) {
                            neg = neg + 1;
                        }
                    }
                }
            }
            var total = pos - neg;
            var tag;
            //Must have at least 30 pos/neg matches to be used
            if (pos >= 30 && neg >= 30) {
                //Adjust for data skewed postivie
                if (total >= 15 && total !== 0) {
                    tag = "positive";
                } else if (total < 15 && total !== 0) {
                    tag = "negative";
                } else {
                    tag = "neutral";
                }
                callback({
                    'url': link.url,
                    'title': link.title,
                    'description': link.description,
                    'created': link.created,
                    'pos': pos,
                    'neg': neg,
                    'total': total,
                    'tag': tag
                });
            } else {
                callback({
                    'url': link.url,
                    'title': link.title,
                    'description': link.description,
                    'created': link.created,
                    'pos': 0,
                    'neg': 0,
                    'total': 0,
                    'tag': 'invalid'
                });
            }
        }

    }).setMaxListeners(0);
}
