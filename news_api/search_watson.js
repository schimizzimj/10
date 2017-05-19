var request = require('request');
var cheerio = require('cheerio');
var feed = require('rss-to-json');
var fs = require('fs');
var watson = require('watson-developer-cloud/natural-language-understanding/v1.js');
var nlu = new watson({username: '530fa29f-c355-4fe5-8f64-7efb8e26cb80', password: 'FUDLKamRD85s', version_date: watson.VERSION_DATE_2017_02_27});

getArticles("TSLA", "Tesla");

function getArticles(ticker, company) {
    var links = [];
    var url = "https://news.google.com/news?q=" + ticker + "&output=rss";
    ticker = ticker.toLowerCase();
    feed.load(url, function(err, rss) {
        //console.log(rss);
        var items = rss.items;
        for (var i = 0; i < items.length; i++) {
            var title = items[i].title.toLowerCase();
            var description = items[i].description.toLowerCase();
            if (title.includes(ticker)) {
                links.push(items[i].link);
            } else if (description.includes(ticker)) {
                links.push(items[i].link);
            }
        }
        var scores = [];
        var count = 0;
        scoreSentiment(ticker, company, links, count, scores);
    });

    /*
    var url_2 = "https://news.google.com/news?q=" + ticker + "&output=rss";
    company = company.toLowerCase();
    feed.load(url_2, function(err, rss) {
        console.log(rss);
        var links = [];
        var items = rss.items;
        for (var i = 0; i < items.length; i++) {
            var title = items[i].title.toLowerCase();
            var description = items[i].description.toLowerCase();
            if (title.includes(ticker)) {
                links.push(items[i].link);
            } else if (description.includes(ticker)) {
                links.push(items[i].link);
            }
        }
    });
    */
}

function scoreSentiment(ticker, company, links, count, scores) {
    if (count < links.length) {
        checkUrl(links[count], function(data) {
            var num;
            if (data.label == 'positive' && data.score >= 0.3) {
                num = 1;
            } else if (data.label == 'negative' && data.score <= -0.3) {
                num = -1;
            } else {
                num = 0;
            }
            var ind_data = {
                'score': data.score,
                'label': data.label,
                'num': num,
                'url': links[count]
            };
            scores.push(ind_data);
            count++;
            scoreSentiment(ticker, company, links, count, scores);
        });
    } else {
        analyze(ticker, company, scores);
    }
}

function checkUrl(url, callback) {
    request({
        url: url
    }, function(err, res, body) {
        var $ = cheerio.load(body);
        var text = $('body').text();

        nlu.analyze({
            'html': body,
            'features': {
                'sentiment': {}
            }
        }, function(err, response) {
            if (err) {
                console.log('error:', err);
            } else {
                callback(response.sentiment.document);
            }
        });
    });
}

function analyze(ticker, company, scores) {
  console.log(scores);
    var total_score = 0;
    for (var i = 0; i < scores.length; i++) {
        total_score += scores[i].num;
    }
    console.log(company + ": " + ticker);
    console.log("Score: " + total_score);
}
