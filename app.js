var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var search_website = "https://www.sedna.com/";
var maximun_no_of_pages = 25;

var pages_visited = {};
var numpages_visited = 0;
var pages_to_visit = [];
var url = new URL(search_website);
var baseUrl = url.protocol + "//" + url.hostname;

pages_to_visit.push(search_website);
crawl();

function crawl() {
    if (numpages_visited >= maximun_no_of_pages) {
        console.log("Reached the maximum number of pages to visit i.e. ", maximun_no_of_pages);
        return;
    }
    var nextPage = pages_to_visit.pop();
    if (nextPage != undefined) { //checking whether there are still any urls left to crawl
        if (nextPage in pages_visited) {
            crawl(); // if already visited the page, repeat the function crawl
        } else {
            visit_sub_links(nextPage, crawl); // is the page is unvisited
        }
    }
}

function visit_sub_links(url, callback) {
    pages_visited[url] = true;
    numpages_visited++;

    console.log("Url of the page currently visiting " + url);
    request(url, function(error, response, body) {

        // Parse the document body
        var $ = cheerio.load(body);
        collectInternalLinks($);
        callback();

    });
}

function collectInternalLinks($) {
    var relativeLinks = $("a[href^='/']");
    console.log("Found " + relativeLinks.length + " relative links on page: ", pages_to_visit);
    relativeLinks.each(function() {
        pages_to_visit.push(baseUrl + $(this).attr('href'));
    });
}