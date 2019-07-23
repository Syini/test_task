'use strict'
const bodyParser = require("body-parser")
const express = require('express')
const rp = require("request-promise")
const exphbs  = require('express-handlebars')
const Handlebars = require('handlebars')
let app = express()

const urlencodedParser = bodyParser.urlencoded({extended: false})
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/home', function (req, res) {
  res.render('home')
})
app.post("/home", urlencodedParser, function (req, res) {
  res.render('home')
})

app.post("/getInfo", urlencodedParser, async function (req, res) {
  let options = {
    uri: 'https://api.github.com/users/' + req.body.userName,
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  }
  
  let response = await rp(options, function (err, response,body) {
  })
  
  let helper = JSON.parse(response)

  let options1 = {
    uri: 'https://api.github.com/users/' + req.body.userName + '/repos',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  }
  
  let response2 = await rp(options1, function (err, response,body) {
  })
  
  res.render('getInfo',{name:req.body.userName, url: helper.html_url, title:'Repositories', repositories_amount: helper.public_repos})
  
  Handlebars.registerHelper('card', function(context, options) {
    let ret = ''
    context = JSON.parse(response2)
    for(let i=0; i<context.length; i++) {
      ret += `<a href = ${context[i].svn_url}><div class='card'  >` + "<div class='container'>" + options.fn(context[i]) + "</div>" + "</div></a>"
    }
  return ret

  })
  
})

app.listen(3000, function () {
  console.log('server listening on: 3000')
})