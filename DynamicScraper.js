import cheerio from 'cheerio';
import nodemailer from 'nodemailer';
import puppeteer from 'puppeteer';
import sendMail from './Mailer.js';

const url = 'https://www.youtube.com/user/RichEisenShow/videos';
const string = 'Rich';

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


function sortTitles() {
    const string = "Rodgers"
    fetchFromYouTube((data) => {
        let titleList = getLatestTitle(data);
        let titles = jobList.filter(titles => titles.title.includes(string)) 
        // if(jobList.title.includes(string))
        //console.log("JOBLIST: ",jobList)
        console.log("MY JOBS",titles)
    })
}


//   fetchFromYouTube((data) => {
//       console.log(getLatestTitle(data))
//   })

//   function compare() {
//       fetchFromYouTube((data)=> {
//         let title =  getLatestTitle(data);
//         if(title.title.includes('Rich')){
//             console.log('new Rich video found');
//             sendMail("Rich Video Found",title.title,title.link,"https://www.youtube.com"); 
//         }
//     })
// }

// compare()


//declares *previousTitle & latestTitle*
//run *fetchFromYouTube* function, save output to variable called *previousTitle*
//After first *fetchFromYouTube* function, run the second one immediately
//store the second ones output in var called *latestTitle* 
//checks if a new video was posted after this function started
//by checking if *latestTitle* is the same as *previousTitle*
//if there is a new video it prints new video found
//then checks new title for the word defined in string variable
//if it does , then it fires *sendmail*
//then runs *compare* again and starts process over

function compare() {
    let previousTitle, latestTitle;
    fetchFromYouTube((data) => {
        previousTitle = getLatestTitle(data);
        console.log("#1", previousTitle)
    }).then(() => {
        fetchFromYouTube((data) => {
            latestTitle = getLatestTitle(data);
            console.log("#2", previousTitle)
            console.log("latest title", latestTitle)
            if (latestTitle.title !== previousTitle.title) {
                console.log('new video found');
                if (latestTitle.title.includes(string)) {
                    sendMail("New " + string + "Video Found", title.title, title.link, "https://www.youtube.com");
                }
            }
        })
    })
        .then(() => {
            compare();
        })
}

compare();


        //   function compare() {
        //     let previousTitle,latestTitle;
        //   fetchFromYouTube((data)=>{
        //     previousTitle=  getLatestTitle(data);
        //     console.log("#1", previousTitle)
        //   }).then(()=> {
        //     fetchFromYouTube((data)=>{
        //       latestTitle = getLatestTitle(data);
        //       console.log("#2", previousTitle)
        //       console.log("latest title", latestTitle)
        //     if(latestTitle.title !== previousTitle.title) {
        //       console.log('new video found');
        //       if(latestTitle.title.includes('Trick Shot')) {
        //      sendMail("Trick Shot Video Found",title.title,title.link,"https://www.youtube.com");
        //       }
        //     }
        //     })
        //   })
        //   .then(()=>{
        //     compare();
        //   })
        //   }

          //compare();