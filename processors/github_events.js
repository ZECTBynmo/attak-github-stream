rp = require('request-promise')
async = require('async')
moment = require('moment')

exports.handler = function(event, context, callback) {
  console.log("Searching for events from " + event.user)

  function triggerNext(response) {
    // Emit a call for more events after a few seconds
    // Note: This will incur a higher node-lambda cost, but since the
    // call volume is very low, it's not an issue
    setTimeout(function() {
      event.lastmod = response ? response.headers['last-modified'] : event.lastmod
      context.emit('next', event, function() {
        callback()
      })
    }, 2000)
  }

  opts = {
    uri: 'https://api.github.com/users/' + event.user + '/events',
    json: true,
    proxy: event.proxy ? event.proxy.curl : undefined,
    method: 'GET',
    resolveWithFullResponse: true,
    headers: {
      'User-Agent': 'attak-github-stream',
      'If-Modified-Since': event.lastmod
    },
  }

  rp(opts).then(function(response) {
    events = response.body
    lastmod = new Date(event.lastmod).getTime()

    for(var iEvent=0; iEvent<events.length; ++iEvent) {
      if (event.lastmod === undefined || moment(new Date(events[iEvent].created_at)).isAfter(lastmod)) {
        context.emit('events', events[iEvent])

      }
    }

    triggerNext(response)
  }).catch(function(err) {
    if (err.statusCode === 304) {
      triggerNext()
    } else {
      throw new Error(err)
    }
  })
}