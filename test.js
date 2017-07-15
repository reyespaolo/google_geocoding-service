const reverseGeocode = require('./google');

const config = require('./config');


reverseGeocode.RequestReverseGeocode(config.apiKey, 14.749210, 121.045038, data => {
  console.log(data)
})
