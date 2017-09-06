const reverseGeocode = require('./google');

const config = require('./config');


reverseGeocode.RequestReverseGeocode(config.apiKey, 14.632906,121.001651, data => {
  console.log(data)
})
