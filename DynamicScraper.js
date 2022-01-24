import cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import sendMail from './Mailer.js';

const url = 'https://www.youtube.com/user/RichEisenShow/videos';
const string = 'Brady';

//fetch data from youtube & store it in a callback function
//create an instance of browser and open a page & go to *URL*
//then passes in page content to callback function *resp* & close browser
async function fetchFromYouTube(resp) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    resp(await page.content())
    browser.close()
}


//initiate cheerio instance with data from callback function
//define videotitles open array
//use jquery selectors to specify location of data we want off the page
//store titles and links that match our selectors into videotitles array
function getLatestTitle(data) {
    const $ = cheerio.load(data)
    let VideoTitles = []
    $('div #details')
      .children('div #meta')
      .children('h3')
      .children('a')
      .each(function (i, el) {
        VideoTitles.push({ title: $(el).text(), link: $(el).attr('href') })
      })
    return VideoTitles[0]
  }

  function compare() {
    let previousTitle,latestTitle;
  fetchFromYouTube((data)=>{
    previousTitle=  getLatestTitle(data);
  }).then(()=> {
    fetchFromYouTube((data)=>{
      latestTitle = getLatestTitle(data);
    if(latestTitle.title !== previousTitle.title) {
      console.log('new video found');
      if(latestTitle.title.includes(string)) {
     sendMail("Trick Shot Video Found",title.title,title.link,"https://www.youtube.com");
      }
    }
    })
  })
  .then(()=>{
    compare();
  })
}
compare()