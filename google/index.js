'use strict'

const httpreq = require('httpreq')

const parseReverseGeoAddressGoogle = data => {
  let address = {
    provider: 'Google',
    full_address: data.results[0].formatted_address
  }
  let addressJSON = data.results[0].address_components
  for (var i = 0; i < addressJSON.length; i++) {
    switch (addressJSON[i].types[0]) {
      case 'street_number':
        address.street_number = addressJSON[i].long_name
        break
      case 'route':
        address.street = addressJSON[i].long_name
        break
      case 'neighborhood':
        address.neighborhood = addressJSON[i].long_name
        break
      case 'locality' || 'sublocality':
        address.city = addressJSON[i].long_name
        break
      case 'administrative_area_level_2':
        address.municipality2 = addressJSON[i].long_name
        break
      case 'administrative_area_level_1':
        address.municipality = addressJSON[i].long_name
        break
      case 'country':
        address.country = addressJSON[i].long_name
        address.countryCode = addressJSON[i].short_name
        break
      case 'postal_code':
        address.postal_code = addressJSON[i].long_name
        break
    }
  }
  return address
}

const RequestReverseGeocode = (apiKey, lat, lng, callback) => {
  if (lat.lat && lat.lng) {
    callback = lng
    lng = lat.lng
    lat = lat.lat
  }
  let options = {
  	timeout: 3000,
  	method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    parameters: {
    	latlng: lat.toString() + ',' + lng.toString(),
    	sensor: false,
    	key: apiKey
    }
  }

  httpreq.doRequest(options, (err, res) => {
  	let data = res && res.body || ''
    let error = null
    let parsedData = null

    try {
      parsedData = JSON.parse(data)
    } catch (e) {
      error = new Error('Invalid response')
      error.error = e
    }

    if (err) {
      error = new Error('Request failed')
      error.error = err
    }

    if (parsedData && parsedData.error_message) {
      error = new Error(parsedData.status)
      error.error =  parsedData.error_message
    }

    if (error) {
      callback(error)
    } else {
    	if (parsedData.results && parsedData.results.length) {
      	let address = parseReverseGeoAddressGoogle(parsedData)
	      address.coords = [lng, lat]
	      callback(null, address)
    	} else {
    		error = new Error('No Results')
      	callback(error)
    	}
    }
  })
}

module.exports = {
  RequestReverseGeocode: RequestReverseGeocode,
}