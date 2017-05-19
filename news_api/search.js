var request = require('request');
var feed = require('rss-to-json');
var fs = require('fs');

getArticles("Credit Suisse", "Credit Suisse");

function getArticles(ticker, company) {
    var links = [];
    var url = "https://bing.com/news/search?q=" + ticker + "&format=rss";
    ticker = ticker.toLowerCase();
    feed.load(url, function(err, rss) {
        console.log(rss);
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
            console.log(data);
            scores.push(data);
            count++;
            scoreSentiment(ticker, company, links, count, scores);
        });
    } else {
        analyze(ticker, company, scores);
    }
}

function checkUrl(url, callback) {
    //console.log(url);
    request({
        url: url
    }, function(err, res, body) {
        if (err) {
            callback({'url': url, 'pos': 0, 'neg': 0, 'total': 0, 'tag': 'neutral'});
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
            if (total >= 15 && total !== 0) {
                tag = "positive";
            } else if (total < 15 && total !== 0) {
                tag = "negative";
            } else {
                tag = "neutral";
            }
            callback({'url': url, 'pos': pos, 'neg': neg, 'total': total, 'tag': tag});
        }

    }).setMaxListeners(0);
}

function analyze(ticker, company, scores) {
    //console.log(scores);
    var positive = 0;
    var negative = 0;
    for (var i = 0; i < scores.length; i++) {
        console.log(scores[i]);
        if (scores[i].tag == 'positive') {
            positive++;
        } else if (scores[i].tag == 'negative') {
            negative++;
        }
    }
    console.log(company + ": " + ticker);
    console.log("positive: " + positive);
    console.log("negative: " + negative);
}
