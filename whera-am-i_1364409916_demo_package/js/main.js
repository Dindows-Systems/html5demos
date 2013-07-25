$(document).ready(function() {
	var datetime = new Date(), api_key = 'f3fcfe4d1b8a4b0ef8176bc614c2a2e4', geocoder = new google.maps.Geocoder(), tag = '';
	$('#time').text(datetime);
	navigator.geolocation.getCurrentPosition(function (position) {
		var coords = position.coords;
		$('#latitude').text(coords.latitude);
		$('#longitude').text(coords.longitude);
		$('#altitude').text(coords.altitude);
		var mapOptions = {
			center: new google.maps.LatLng(coords.latitude, coords.longitude),
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(document.getElementById("map"), mapOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(coords.latitude, coords.longitude)
		});
		// To add the marker to the map, call setMap();
		marker.setMap(map);
		var latlng = new google.maps.LatLng(coords.latitude, coords.longitude);
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results) {
					var arrAddress = results[0].address_components;
                    var itemRoute='';
                    var itemLocality='';
                    var itemCountry='';
                    var itemPc='';
                    var itemSnumber='';
                    // iterate through address_component array
                    $.each(arrAddress, function (i, address_component) {
                        //console.log('address_component:'+i);
                        if (address_component.types[0] == "route"){
                            //console.log(i+": route:"+address_component.long_name);
                            itemRoute = address_component.long_name;
                        }
                        if (address_component.types[0] == "locality"){
                            //console.log("town:"+address_component.long_name);
                            itemLocality = address_component.long_name;
                        }
                        if (address_component.types[0] == "country"){ 
                            //console.log("country:"+address_component.long_name); 
                            itemCountry = address_component.long_name;
                        }
                        if (address_component.types[0] == "postal_code_prefix"){ 
                           // console.log("pc:"+address_component.long_name);  
                            itemPc = address_component.long_name;
                        }
                        if (address_component.types[0] == "street_number"){ 
                            //console.log("street_number:"+address_component.long_name);  
                            itemSnumber = address_component.long_name;
                        }
                        //return false; // break the loop
                    });
					tag = itemLocality;
					//Flickr
					$.getJSON('http://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key='+api_key+'&tags='+tag+/*'&lat='+coords.latitude+'&lon='+coords.longitude+'&geo_context=2*/'&format=json&jsoncallback=?',
					function(data) {
						var i, item, photo_url = '', img_str = '', len = data.photos.photo.length;
						for (i = 0; i < len; i++) {
							item = data.photos.photo[i];
							photo_url = 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_m.jpg';
							img_str += '<div><img src="'+photo_url+'" alt=""><div>'+item.title+'</div></div>';
						}
						$('#images').html(img_str);
					});
				}
			} else {
				alert("Geocoder failed due to: " + status);
			}
		});
		
	}, function(error) {
		alert('Error: '+error.code);
	});
	/* var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg'*/
			
			/*http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
				or
			http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
				or
			http://farm{farm-id}.staticflickr.com/{server-id}/{id}_{o-secret}_o.(jpg|gif|png)*/
	 /*$('#twitter').sharrre({
		share: {
		twitter: true
		},
		enableHover: false,
		enableTracking: true,
		buttons: { twitter: {via: '_JulienH'}},
		click: function(api, options){
		api.simulateClick();
		api.openPopup('twitter');
		}
		});
		$('#facebook').sharrre({
		share: {
		facebook: true
		},
		enableHover: false,
		enableTracking: true,
		click: function(api, options){
		api.simulateClick();
		api.openPopup('facebook');
		}
		});
		$('#googleplus').sharrre({
		share: {
		googlePlus: true
		},
		enableHover: false,
		enableTracking: true,
		click: function(api, options){
		api.simulateClick();
		api.openPopup('googlePlus');
		}
	});*/
});
Cufon.replace('h1');
/*
 *  	Where am I
Key:
f3fcfe4d1b8a4b0ef8176bc614c2a2e4

Secret:
dfca7e0c2cb25df0 
*/
//http://www.flickr.com/services/api/misc.urls.html
//http://kylerush.net/blog/tutorial-flickr-api-javascript-jquery-ajax-json-build-detailed-photo-wall/
//http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=d3af7d7dac7cb75a1cce3c0fc5c5c5ce&tags=roma&geo_context=2&lat=41.933614&lon=12.463989&page=1&format=rest
/*<rsp stat="ok">
<photos page="1" pages="1" perpage="100" total="1">
<photo id="2825253961" owner="83979593@N00" secret="a7d4a7d474" server="3106" farm="4" title="Pantheon, Rome, Italy, 1895." ispublic="1" isfriend="0" isfamily="0"/>
</photos>
</rsp>*/
//http://web.appstorm.net/roundups/30-incredibly-useful-fun-html5-mobile-apps/
//https://developers.google.com/+/web/share/
//http://sharrre.com/
/*
latitude 	double 	The user's current latitude, in degrees. Read only.
longitude 	double 	The user's current longitude, in degrees. Read only.
altitude 	double 	The user's current altitude, in meters. Zero if the device doesn't support altitude detection. Read only.
accuracy 	double 	The accuracy of position information, in meters. Read only.
altitudeAccuracy 	double 	The accuracy of altitude information, in meters. Zero if the device doesn't support altitude detection. Read only.
heading 	double 	The current heading at which the user is moving, in degrees. Read only.
speed 	double 	The speed at which the user is moving, in meters per second (confirm this). Read only.
*/