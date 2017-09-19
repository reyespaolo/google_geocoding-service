`use strict`
const https = require('https');
const http = require('http');
const url = require('url');

const parseReverseGeoAddressGoogle = data => {
  var address = {
			provider: "Google",
			full_address : data.results[0].formatted_address
		},
		addressJSON = data.results[0].address_components;
		for (var i = 0; i < addressJSON.length; i++) {
			switch (addressJSON[i].types[0]) {
				case 'street_number':
					address.street_number = addressJSON[i].long_name;
					break;
				case 'route':
					address.street = addressJSON[i].long_name;
					break;
				case 'neighborhood':
					address.neighborhood = addressJSON[i].long_name;
					break;
				case 'locality' || 'sublocality':
					address.city = addressJSON[i].long_name;
					break;
				case 'administrative_area_level_2':
					address.municipality2 = addressJSON[i].long_name;
					break;
				case 'administrative_area_level_1':
					address.municipality = addressJSON[i].long_name;
					break;
				case 'country':
					address.country = addressJSON[i].long_name;
          address.countryCode = addressJSON[i].short_name;

					break;
				case 'postal_code':
					address.postal_code = addressJSON[i].long_name;
					break;
			};
		};
		return address;
}

const RequestReverseGeocode = (apiKey,lat,lng,callback) => {
  if (lat.lat && lat.lng) {
  			callback = lng
  			lng = lat.lng
  			lat = lat.lat
  }
  var query = lat.toString() + ',' + lng.toString() + '&sensor=false',
				options = {
					host : 'maps.googleapis.com',
					path: '/maps/api/geocode/json?latlng=' + query + '&key=' + apiKey
				};
		var req = https.get(options, function(res) {
			// console.log('Response: ' + res.statusCode);
			var results = '';
			res.on('error', function(e) {
				// console.log('Got error: ' + e.message);
			});
			res.on('data', function(data) {

				results += data;
			});
			res.on('end', function() {
				var body = JSON.parse(results);
				if (body.error_message) {
					// console.log(body.error_message);
          // address = "No Result"
					callback("No Result");
				}

				var address = parseReverseGeoAddressGoogle(body)
        address.coords = [lng,lat];

        // address.coords.push(lng);
        // address.coords.push(lat);
        // if(body.error_message){
        //   address = "No Result"
        // }

				if (callback) {
					callback(address);
				} else {
					return address;
				};
			});
		});
}

module.exports = {
  RequestReverseGeocode: RequestReverseGeocode,
};
