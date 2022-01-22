
import cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';


const cnn = 'https://lite.cnn.com/en';
const string = 'Trump';

//fetches data from CNN and converts that data to html, 
//then it puts the html data in a callback function called sendToNextFunction
//which will be passed in to the getLatestHeadline function
function getFromCNN(sendToNextFunction){
    fetch(cnn)
    .then(res=>res.text())
    .then(html =>{
        sendToNextFunction(html);
    })
};

//Loads HTML data passed in from the getFromCNN function into a cheerio instance.
//then initializes Titles array which will hold what we tell
//cheerio to extract from the html data
function getLatestHeadline(html) {
    var $ = cheerio.load(html);
    var Titles = [];

//then tells cheerio to look at the li element which is a child of ul element
//then extract the title and link from each one 
//and store them as objects in the Titles array
    $('ul').children('li').each(function(i, el){
        Titles.push({title : $(el).text() ,link : $(el).children('a').attr('href')
        })
        
    })
    return console.log(Titles[0]);
};

//fires the getFromCNN function
//after it converts the response to html it fires
//the getLatestHeadline function and passes in the html data to it
getFromCNN((html) => {
    getLatestHeadline(html)
})

// app.listen(8081, () => {
//     console.log('Server Is Running....')
// })