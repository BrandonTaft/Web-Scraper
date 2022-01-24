import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//const nodemailer = require('nodemailer');

dotenv.config()


//create and define reusable transporter object
//specifying what email service, name, and password
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'btafttest@gmail.com',
        pass: process.env.PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

//specify options, tell nodemailer the recipients and sender
var mailOptions = {
from: process.env.USER,
to: 'btaft6278@gmail.com',
subject: '',
text: ''
};

//create function to specify subject and text of email
//we are sending html so we can provide link w/ a tag
//then send email with specified mail options
//if errors it logs them, otherwise it prints success and email info
export default function sendMail(subject,text,link,url) {
    console.log(process.env.PASS)
    console.log(process.env.USER)
    mailOptions.subject = subject;
    mailOptions.html = "<a href="+url+link+ ">" + text + "</a>";
        transporter.sendMail(mailOptions, function(error, info){
            if(error) {
                console.log(error);
            }else{
                console.log('Email Sent: ' + info.response);
            }
        });

}

//export function
//module.exports = sendMail