var request = require('request');
const API_KEY = "7d59d1d5d4b149d9abb301cb98034071";
var url_1 = "https://newsapi.org/v1/sources?language=en";

//getSources();

var source_ids = [
    'abc-news-au',
    'al-jazeera-english',
    'ars-technica',
    'associated-press',
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'breitbart-news',
    'business-insider',
    'business-insider-uk',
    'buzzfeed',
    'cnbc',
    'cnn',
    'daily-mail',
    'engadget',
    'entertainment-weekly',
    'espn',
    'espn-cric-info',
    'financial-times',
    'football-italia',
    'fortune',
    'four-four-two',
    'fox-sports',
    'google-news',
    'hacker-news',
    'ign',
    'independent',
    'mashable',
    'metro',
    'mirror',
    'mtv-news',
    'mtv-news-uk',
    'national-geographic',
    'new-scientist',
    'newsweek',
    'new-york-magazine',
    'nfl-news',
    'polygon',
    'recode',
    'reddit-r-all',
    'reuters',
    'talksport',
    'techcrunch',
    'techradar',
    'the-economist',
    'the-guardian-au',
    'the-guardian-uk',
    'the-hindu',
    'the-huffington-post',
    'the-lad-bible',
    'the-new-york-times',
    'the-next-web',
    'the-sport-bible',
    'the-telegraph',
    'the-times-of-india',
    'the-verge',
    'the-wall-street-journal',
    'the-washington-post',
    'time',
    'usa-today'
];

getArticles("YHOO", "Yahoo!");

function getSources() {
    request({
        url: url_1
    }, function(err, res, body) {
        body = JSON.parse(body);
        for (var i = 0; i < body.sources.length; i++) {
            source_ids.push(body.sources[i].id);
        }
        console.log(source_ids);
    });
}

function getArticles(ticker, company) {
    var links = [];
    for (var i = 0; i < source_ids.length; i++) {
        links.concat(getLinks(source_ids[i]), ticker, company);
    }
    console.log(links);
}

function getLinks(source, ticker, company) {
    var url = "https://newsapi.org/v1/articles?source=" + source + "&sortBy=top&apiKey=" + API_KEY;
    request({
        url: url
    }, function(err, res, body) {
        //console.log(body);
        body = JSON.parse(body);
        var articles = body.articles;
        var links = [];
        for (var i = 0; i < articles.length; i++) {
            var title = articles[i].title.toLowerCase();
            var description = articles[i].description.toLowerCase();
            if (title.includes(ticker)) {
                links.push(articles[i].url);
            } else if (title.includes(company)) {
                links.push(articles[i].url);
            } else if (description.includes(ticker)) {
                links.push(articles[i].url);
            } else if (description.includes(company)) {
                links.push(articles[i].url);
            }
        }
        return links;
    });
}
