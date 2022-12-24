require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");


const app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html")

});

app.post("/", function (req, res) {
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    //const user_birthday = req.body.dob;
    const emailId = req.body.mailId;
    //console.log(user_birthday);
    const data = {
        members: [{
            email_address: emailId,
            status: "subscribed",
            merge_fields: {
                FNAME: fName,
                LNAME: lName,
                //BIRTHDAY: user_birthday
            }
        }]
    }
    const jsonData = JSON.stringify(data);
    //const list_id = "eb31c7268e";
    const url = "process.env.MAIL_CHIMP"
    const options = {
        method: "POST",
        auth: "key:process.env.MAILCHIP_API_KEY"
    }
    const request = https.request(url, options, function (response) {
        response.on("data", function (data) {
            console.log(JSON.parse(data));
            if (response.statusCode === 200) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html")
            }
        })
    });

    request.write(jsonData);
    request.end();
})

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("your server os running on port 3000");
})