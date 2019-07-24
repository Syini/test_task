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
  let sort = req.body.sort,
    starred = req.query.starred,
    updated = req.query.updated,
    language = req.query.language,
    order= req.query.desc,
    has_open_issues = req.query.has_open_issues

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
    headers: {'user-agent': 'node.js',
    authorization: "Syini"}
  }
  
  let response2 = await rp(options1, function (err, response,body) {
  })
  //console.log(response2)
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
app.get('/getInfo/:userName', urlencodedParser, async function (req, res) {

  console.log(req.query)
  console.log(req.params)
  let sort = req.body.sort,
    starred = req.query.starred,
    updated = req.query.updated,
    language = req.query.language,
    order= req.query.desc,
    has_open_issues = req.query.has_open_issues

  let options = {
    uri: 'https://api.github.com/users/' + req.params.userName,
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  }

  let response = await rp(options, function (err, response,body) {
  })

  let helper = JSON.parse(response)

  let options1 = {
    uri: 'https://api.github.com/users/' + req.params.userName + '/repos',
    method: 'GET',
    headers: {'user-agent': 'node.js',
      authorization: "Syini"}
  }

  let response2 = await rp(options1, function (err, response,body) {
  })
  //console.log(JSON.parse(response2))
  console.log(req.query.updated_value)
  console.log(JSON.parse(response2)[4].updated_at)
  console.log(req.query.updated_value < JSON.parse(response2)[4].updated_at)
  res.render('getInfo',{name:req.params.userName, url: helper.html_url, title:'Repositories', repositories_amount: helper.public_repos})

  Handlebars.registerHelper('card', function(context, options) {
    let ret = ''
    context = JSON.parse(response2)
    for(let i=0; i<context.length; i++) {
      if (req.query === {}) {
        ret += `<a href = ${context[i].svn_url}><div class='card'  >` + "<div class='container'>" + options.fn(context[i]) + "</div>" + "</div></a>"
      }
      else {
        if (req.query.updated === 'on' && new Date(req.query.updated_value) < new Date(context[i].updated_at)) {
          ret += `<div class='card'  >` + "<div class='container'>" + options.fn(context[i]) + "</div>" + "</div>"
        }
      }
    }
      return ret
  })

})
app.listen(3000, function () {
  console.log('server listening on: 3000')
})