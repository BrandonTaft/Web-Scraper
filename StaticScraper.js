import cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import sendMail from './Mailer.js';

const cnn = 'https://lite.cnn.com/en';
const string = 'US';

//fetches html from *cnn* and converts that html to html
//then it puts the html html in a callback function called *callbackFunction*
//which will be passed in to the *getLatestHeadline* function
function getFromCNN(callbackFunction) {
    fetch(cnn)
        .then(res => {
            if (!res.ok) {
                throw new Error('Network response was not OK');
            }
            return res.text();
        })
        .then((html) => {
            callbackFunction(html);
        })
        .catch((err) => {
            console.log(err);
        })
};

//Loads HTML html passed in from *callback function* into a cheerio instance.
//then initializes *Titles* array which will hold what we tell
//cheerio to extract from the html html
//then tells cheerio to look at the li element which is a child of ul element
//then extract the title and link from each one 
//and store them as objects in the *Titles* array
function getLatestHeadline(html) {
    var $ = cheerio.load(html);
    var Titles = [];
    $('ul').children('li').each(function (i, el) {
        Titles.push({
            title: $(el).text(), link: $(el).children('a').attr('href')
        })
    })
    return Titles[0];
};

//fires the *getFromCNN* function
//after it converts the response to html it fires
//the *getLatestHeadline* function and passes in the html html
//assigns variable *latestHeadline* to the html returned from *getLatestHeadline*
//then checks if *latestHeadline* contains the word we assigned to the variable *string*
// setInterval(() => {
//     getFromCNN((html) => {
//         const latestHeadline = getLatestHeadline(html);
//         if (latestHeadline.title.includes(string)) {
//             console.log('The latest headline about ' + string + ' is :', latestHeadline.title)
//         } else {
//             console.log('There is nothing new about ' + string + ' yet')
//             console.log("There new article is", latestHeadline.title)
//         }
//     })
// }, 5 * 1000);

//fires the *getFromCNN* function to get the newest headline
//assigns variable *previousHeadline* to the output returned from *getLatestHeadline*
//setTimeout fires *getFromCNN* again 2 seconds later which fires *getLatestHeadline*
//assigns variable *newestHeadline* to the new output returned from *getLatestHeadline*
//checks if the *newestheadline* matches *previousHeadline*
//if they dont it prints 'new article found' and *newestheadline*
//then checks if the title of *newestheadline* contains the word set in *string* 
//if it does it prints 'new' + string + 'post found, Sending Email'
//if it does match it prints 'There is nothing new about ' + string + ' yet'
//"The most recent article is still", previousHeadline
function compare() {
    getFromCNN((html) => {
        let previousHeadline = getLatestHeadline(html)
        setTimeout(() => {
            getFromCNN((html) => {
                let newestHeadline = getLatestHeadline(html);
                if (newestHeadline.title !== previousHeadline.title) {
                    console.log('new article found');
                    console.log(newestHeadline);
                    if (newestHeadline.title.includes(string)) {
                        console.log('new' + string + 'post found, Sending Email');
                        sendMail('New' + string + 'article released!',newestHeadline.title,newestHeadline.link,'')
                    }else{
                        sendMail('This is your most recent Article',newestHeadline.title,newestHeadline.link,'')
                    }
                } else {
                    sendMail('This is still the most recent Article',previousHeadline.title,previousHeadline.link,'')
                    console.log('There is nothing new about ' + string + ' yet')
                    console.log("The most recent article is still", previousHeadline)
                }
            })
        }, 2 * 1000)
    })
}
//fires compare function every 10 seconds
setInterval(compare, 10 * 1000);