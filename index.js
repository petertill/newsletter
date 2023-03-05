const express = require('express');
const request = require('request-promise');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const csv = require('csv-parser');
//import { appendFileSync } from "fs";

const app = express();
// Using express.urlencoded middleware
app.use(express.urlencoded({
    extended: true
}))

class Contact {
  constructor(name = "", date="", email="") {
    this.name = name;
    this.date = date;
    this.email = email;
  }
	saveAsCSV() {
    const csv = `${this.name},${this.date},${this.email}\n`;
    try {
      fs.appendFileSync("./contacts.csv", csv);
    } catch (err) {
      console.error(err);
    }
  }
}
let transporter = nodemailer.createTransport({
             host: 'smtp.gmail.com',
             port: 465,
             auth: {
                 user: "ptertilldev@gmail.com",
                 pass: "gquntmlevfnnmjtt"
             }
     })

function sendWelcome(email){
	message = {
         from: "ptertilldev@gmail.com",
         to: email,
         subject: "Thanks for signing up!",
         text: "Hello SMTP Email"
    }
    transporter.sendMail(message, function(err, info) {
         if (err) {
           console.log(err);
         } else {
           console.log(info);
         }
	});
}



	

app.get('/signup', function(req, res){
res.sendFile(path.join(__dirname + '/index.html'));
	var name = req.params['name']
	var email = req.params['email']
	
});
app.get('/join/:name/:email', async function(req, res) {
    
    // Retrieve the tag from our URL path
    var name = req.params.name;
	var email = req.params.email;

    console.log(name, email);
	res.sendFile(path.join(__dirname + '/index.html'));
	var datetime = new Date();
	const contact2 = new Contact(name, datetime, email);
  	contact2.saveAsCSV();
	sendWelcome(email);
});
app.get('/leave/:email', async function(req, res) {
	var email = req.params.email; 
	res.sendFile(path.join(__dirname + '/index.html'));
	const results = [];

	fs.createReadStream('contacts.csv')
	  .pipe(csv())
	  .on('data', (data) => results.push(data))
	  .on('end', () => {
	    // Filter out the object with the email to delete
	    const updatedResults = results.filter((result) => result.email !== email);
	
	    // Write the updated array back to the CSV file
	    const writeStream = fs.createWriteStream('contacts.csv');
	    writeStream.write('name,date,email\n'); // Write the CSV header row
	    updatedResults.forEach((result) => {
	      writeStream.write(`${result.name},${result.date},${result.email}\n`);
	    });
	    writeStream.end();
	  });
	
});

app.get('/getcontacts/:code', function(req, res){
    var code = req.params.code;
	if (code == "Faszom200"){
		res.sendFile(path.join(__dirname + '/contacts.csv'));
	}
})
app.listen(3000, () => {
  console.log('server started');
});