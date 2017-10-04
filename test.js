const reverseGeocode = require('./google')

reverseGeocode.RequestReverseGeocode('apiKey', 14.632906, 121.001651, (err, result) => {
  console.log(err && err.message, result)
})
