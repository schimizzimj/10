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
        args: [req.url.substring(7).toUpperCase()]
    });
    pyshell.on('message', function(message) {
        if (message == 'False') {
            res.send({'ticker': message});
        } else {
            console.log('getArticles(' + req.url.substring(7).toUpperCase() + ', ' + message.trim() + ')');
            /*
            res.send({
                "company": "Tesla, Inc.",
                "ticker": "TSLA",
                "sentiment": "Neutral (0)",
                "positive": 0,
                "negative": 0,
                "all": [
                    {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=http%3a%2f%2finvestorplace.com%2f2017%2f05%2fthe-tesla-inc-tsla-stock-factor-everyone-ignores-the-economy%2f&c=10657904083778782780&mkt=en-us",
                        "title": "The Tesla Inc (TSLA) Stock Factor Everyone Ignores: The Economy",
                        "description": "With Tesla shares up more than 45% in 2017, those bears are clearly holding on tight through a lot of pain. But how long can TSLA keep defying gravity? While people typically break down Tesla by running up and down every one of its latest updates ...",
                        "created": 1495175520,
                        "price": "False",
                        "pos": 0,
                        "neg": 0,
                        "total": 0,
                        "tag": "Invalid"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=http%3a%2f%2f247wallst.com%2fautos%2f2017%2f05%2f19%2ftesla-in-the-crosshairs-again-over-factory-conditions%2f&c=12428590294388544084&mkt=en-us",
                        "title": "Tesla in the Crosshairs Again Over Factory Conditions",
                        "description": "A recent story in The Guardian once more focuses attention on working conditions for the employees who build cars for Tesla Inc. (NASDAQ: TSLA). The report details the toll of the company’s drive to raise production and turn a profit. Tesla has plans to ...",
                        "created": 1495175940,
                        "price": "False",
                        "pos": 0,
                        "neg": 0,
                        "total": 0,
                        "tag": "Invalid"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=https%3a%2f%2fwww.smarteranalyst.com%2f2017%2f05%2f18%2fwarren-buffet-buy-tesla-inc-tsla%2f&c=17150490631485472268&mkt=en-us",
                        "title": "Should Warren Buffet Buy Tesla Inc (TSLA)?",
                        "description": "During Berkshire’s annual meeting, Warren Buffet has acknowledged regret by having missed on the Google and Amazon. All his talk about staying within the circle of competence has suddenly vanished. In my opinion, Buffet didn’t miss it, he just remained ...",
                        "created": 1495116000,
                        "price": "False",
                        "pos": 88,
                        "neg": 58,
                        "total": 30,
                        "tag": "Positive"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=http%3a%2f%2fbuffalonews.com%2f2017%2f05%2f16%2fceo-lyndon-rive-leave-tesla-june%2f&c=3150502662314864408&mkt=en-us",
                        "title": "SolarCity co-founder Lyndon Rive to leave Tesla Inc. in June",
                        "description": "Lyndon Rive, who led SolarCity as it developed plans to open a massive solar factory in South Buffalo, will leave the Tesla Inc. subsidiary next month. Rive told Reuters on Monday he is leaving to pursue a new startup sometime next year. Rive co ...",
                        "created": 1494896400,
                        "price": "False",
                        "pos": 0,
                        "neg": 0,
                        "total": 0,
                        "tag": "Invalid"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=http%3a%2f%2fwww.gamengadgets.com%2ftesla-tops-u-s-auto-industry-electric-innovations-plays-primary-growth-driver%2f&c=14377692146644011035&mkt=en-us",
                        "title": "Tesla Tops The U.S. Auto Industry, Electric Innovations Plays The Primary Growth Driver",
                        "description": "Not even a couple of years back, people weren’t even sure of the future of Tesla Inc., when Elon Musk, the CEO of the company, had set a very unrealistic timeline for the Model 3. This luxury sedan is a result of all the aggressive instincts on their part.",
                        "created": 1495162740,
                        "price": "False",
                        "pos": 59,
                        "neg": 35,
                        "total": 24,
                        "tag": "Positive"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=https%3a%2f%2fmarketexclusive.com%2ftesla-factory-bad-place-workers%2f109751%2f&c=1247742823432785040&mkt=en-us",
                        "title": "Is Tesla Inc (NASDAQ:TSLA) Factory Bad Place for Workers?",
                        "description": "Some workers at Tesla Inc (NASDAQ:TSLA)’s car factory in California are unhappy with working conditions, according to a report from The Guardian. The newspaper talked to many people and some have complained about grueling pressure and sometimes life ...",
                        "created": 1495126380,
                        "price": "False",
                        "pos": 43,
                        "neg": 40,
                        "total": 3,
                        "tag": "Negative"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=http%3a%2f%2fwww.profitconfidential.com%2fstock%2fopportunity-tesla-stock-fast-approaching%2f&c=15558450282620847363&mkt=en-us",
                        "title": "An Opportunity in Tesla Stock Is Fast Approaching",
                        "description": "I am providing a quick update on Tesla Inc (NASDAQ:TSLA) stock because I believe that the current sell-off that is gripping the equity markets is based on political rhetoric surrounding Donald Trump, which will prove to be a temporary speed bump.",
                        "created": 1495069200,
                        "price": "False",
                        "pos": 262,
                        "neg": 177,
                        "total": 85,
                        "tag": "Positive"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=https%3a%2f%2fwww.bloomberg.com%2fnews%2farticles%2f2017-05-16%2ftesla-rebuffed-uber-partnership-on-self-driving-cars-in-2016&c=15071234955649672111&mkt=en-us",
                        "title": "Tesla Rebuffed Uber Partnership on Self-Driving Cars in 2016",
                        "description": "Uber Technologies Inc. Chief Executive Officer Travis Kalanick rang up Tesla Inc. CEO Elon Musk last year to propose a partnership on self-driving cars, according to an upcoming book. “I said, ‘Look man, we should partner,’” Kalanick recalled in ...",
                        "created": 1495082460,
                        "price": "313.06",
                        "pos": 142,
                        "neg": 126,
                        "total": 16,
                        "tag": "Neutral"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=http%3a%2f%2fwww.insidermonkey.com%2fblog%2ftesla-inc-tsla-why-this-bear-threw-in-the-towel-581609%2f&c=394711963277342659&mkt=en-us",
                        "title": "Tesla Inc (TSLA): Why This Bear Threw In The Towel",
                        "description": "While its cars are near-universally praised, Tesla Inc (NASDAQ:TSLA) has plenty of detractors when it comes to its viability as a business model and investment. 27% of the stock’s float is being sold short as of April 28, and numerous bears take swipes ...",
                        "created": 1495094340,
                        "price": "313.06",
                        "pos": 59,
                        "neg": 88,
                        "total": -29,
                        "tag": "Negative"
                    }, {
                        "url": "http://www.bing.com/news/apiclick.aspx?ref=FexRss&aid=&tid=D254857CE7774D7EB6868C764486E532&url=https%3a%2f%2fstockmarketdaily.co%2f11667-2%2f&c=13235027560964973183&mkt=en-us",
                        "title": "Why Tesla Inc (NASDAQ:TSLA) Employees Are More Concerned On Safety?",
                        "description": "Tesla Inc (NASDAQ:TSLA) appears to be keen on accomplish its production targets, which are aggressive. Though its CEO, Elon Musk, indicated that he accorded top priority to the worker safety and satisfaction, recent events are worrying factors for its ...",
                        "created": 1495156980,
                        "price": "False",
                        "pos": 86,
                        "neg": 74,
                        "total": 12,
                        "tag": "Negative"
                    }
                ]
            });
            */

            getArticles(req.url.substring(7).toUpperCase(), message.trim(), function(ticker, company, scores) {
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
                var num = (positive - negative) / (positive + negative);
                num = num.toFixed(2);
                if (num > 0) {
                    if (num > 0.6) {
                        sentiment = "Very Positive (" + num + ")";
                    } else {
                        sentiment = "Slightly Positive (" + num + ")";
                    }
                } else if (num < 0) {
                    if (num < -0.6) {
                        entiment = "Very Negative (" + num + ")";
                    } else {
                        entiment = "Slightly Negative (" + num + ")";
                    }
                } else {
                    sentiment = "Neutral (0)";
                }

                res.send({
                    'company': message.trim(),
                    'ticker': ticker,
                    'sentiment': sentiment,
                    'positive': positive,
                    'negative': negative,
                    'all': scores
                });
            });

        }
    });
});

function getPrice(ticker, date, callback) {
    var pyshell = new PythonShell('prices.py', {
        args: [ticker, date]
    });
    pyshell.on('message', function(message) {
        callback(message);
    });
}

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
            items[i].created = items[i].created / 1000;
            links.push(items[i]);
        }
        scoreSentiment(ticker, company, links, 0, [], finalCB);
    });
}

function scoreSentiment(ticker, company, links, count, scores, finalCB) {
    if (count < links.length) {
        checkUrl(links[count], function(data) {
            getPrice(ticker, links[count].created, function(price) {
                data.price = price;
                console.log(data);
                scores.push(data);
                count++;
                scoreSentiment(ticker, company, links, count, scores, finalCB);
            });
        });
    } else {
        finalCB(ticker, company, scores);
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
                'price': link.price,
                'pos': 0,
                'neg': 0,
                'total': 0,
                'tag': 'Invalid'
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
            var indNum = (pos - neg) / (pos + neg);
            //Must have at least 30 pos/neg matches to be used
            if (pos >= 10 && neg >= 10) {
                //Adjust for data skewed postivie
                if (total >= 17) {
                    tag = "Positive";
                } else if (total < 13) {
                    tag = "Negative";
                } else {
                    tag = "Neutral";
                }
                callback({
                    'url': link.url,
                    'title': link.title,
                    'description': link.description,
                    'created': link.created,
                    'price': link.price,
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
                    'price': link.price,
                    'pos': 0,
                    'neg': 0,
                    'total': 0,
                    'tag': 'Invalid'
                });
            }
        }

    }).setMaxListeners(0);
}
