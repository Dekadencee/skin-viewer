'use strict';

// == Module Dependencies

var path    = require('path'),
    express = require('express')

// == Module Definition

var app = module.exports = express()

// == Configurations

// -- Variables

app.set('port', (process.env.PORT || 3000))

// -- Middleware

// ...

// == Routing

app.use(express.static(path.join(__dirname + '/public')))

app.use('/assets', express.static(path.join(__dirname + '/assets')))
app.use('/api', express.static(path.join(__dirname + '/api')))

// == HTTP Listener

app.listen(app.get('port'), function () {
  console.log('Express server listening on port %d (%s)', app.get('port'), app.get('env'))
})
