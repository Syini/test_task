'use strict'
const bodyParser = require("body-parser")
const express = require('express')
const rp = require("request-promise")
let app = express()

const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/home.html')
})
app.post("/home", urlencodedParser, function (req, res) {
  res.render(__dirname + '/views/home.html')
})

var userName = {}
var account,reps
var opt = {}
app.post("/getInfo", urlencodedParser, async function (req, res) {
  userName = req.body.userName


  let options = {
    uri: 'https://api.github.com/users/' + req.body.userName,
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  }

  let response = await rp(options, function (err, response,body) {
  })

  account = JSON.parse(response)

  let options1 = {
    uri: 'https://api.github.com/users/' + req.body.userName + '/repos',
    method: 'GET',
    headers: {
      'user-agent': 'node.js',
      'Accept': 'application/vnd.github.mercy-preview+json',
      authorization: "Syini"
    }
  }
  reps = JSON.parse(await rp(options1, function (err, response,body) {
  }))
  res.sendFile(__dirname + '/views/getInfo.html')
})


app.get("/getInfo/:userName", urlencodedParser, async function (req, res) {
  userName = req.params.userName
  opt = req.query

  let options = {
    uri: 'https://api.github.com/users/' + req.params.userName,
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  }

  let response = await rp(options, function (err, response,body) {
  })

  account = JSON.parse(response)

  let options1 = {
    uri: 'https://api.github.com/users/' + req.params.userName + '/repos',
    method: 'GET',
    headers: {
      'user-agent': 'node.js',
      'Accept': 'application/vnd.github.mercy-preview+json',
      authorization: "Syini"
    }
  }
  reps = JSON.parse(await rp(options1, function (err, response,body) {
  }))
  res.sendFile(__dirname + '/views/getInfo.html')




})
app.get('/json', function (req, res) {
  res.json({userName:userName, account: account, reps: reps})
})

app.listen(3000, function () {
  console.log('server listening on: 3000')
})
