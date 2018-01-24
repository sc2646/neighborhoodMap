var initialLocations = [
	{
		name: 'Starbucks Coffee',
		lat: 37.388282,
		long: -122.030356
	},
	{
		name: 'Peets Coffee',
		lat: 37.3679,
		long:-122.0332

	},
	{
		name: 'Philz Coffee',
		lat: 37.377290,
		long: -122.031438
	},
	{
		name: 'Bean Scene Cafe',
		lat:37.376118,
		long:-122.029826
	},
	{
		name: 'Cocohodo Sunnyvale',
		lat:37.351586,
		long:-122.002466

	},
	{
		name: 'Panera Bread',
		lat:37.381125,
		long:-121.996379

	},
	{
		name: 'Big Mug Coffee Roaster',
		lat:37.351507,
		long:-121.981114

	},
	{
		name: 'The Coffee Bean & Tea Leaf',
		lat:37.416822,
		long:-121.955170

	},
	{
		name: 'Caffe Bene',
		lat:37.412761,
		long:-121.938314

	},
	{
		name: 'Red Berry Coffee Bar',
		lat:37.379552,
		long:-122.114634

	}
];

function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    };

var Location = function(data){
	var self = this;
	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;
	this.URL = "";
	this.street = "";
	this.city = "";
	this.bounds = new google.maps.LatLngBounds();
	this.marker = new google.maps.Marker({
		position: new google.maps.LatLng(data.lat, data.long),
		map:map,
		title:data.name,
		animation: google.maps.Animation.DROP

	});

	this.visible= ko.observable(true);
	this.infowindow = new google.maps.InfoWindow({
		content: self.name+'<div><img src="http://maps.googleapis.com/maps/api/streetview?location='+this.lat+','+this.long+
		'&size=100x100&heading=220&fov=70&pitch-40&key=AIzaSyAnGZh6rwcSxGMuNlDCw6dXE35xnUJIPu8"></div>'
	});

	self.bounds.extend(self.marker.position);
	self.marker.addListener('click', function(){
		self.infowindow.open(map, self.marker);
		toggleBounce(self.marker);
		setTimeout(function() {
      		self.marker.setAnimation(null);
      		self.infowindow.close();
     	}, 3000);
	});

	this.showMarker = ko.computed(function(){
		if(this.visible()===true){
			this.marker.setMap(map);
		}else{
			this.marker.setMap(null);
		}
		return true;
	}, this);
};

var map;
var geocoder;

var ViewModel = function(){
	var self = this;
	this.locationList = ko.observableArray([]);

	map = new google.maps.Map(document.getElementById('google-map-container'),{
		center:{lat:37.370, lng:-122.002},
		zoom:12
	});

	geocoder = new google.maps.Geocoder();

	var centerImage = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

	geocoder.geocode({'location':map.center}, function(results, status){
		if(status=='OK'){
			if(results[0]){
				map.setZoom(11);
				var marker = new google.maps.Marker({
					position:map.center,
					map:map,
					animation: google.maps.Animation.DROP,
					icon:centerImage
				});
				var address = results[0].formatted_address;
				var streetviewUrl= 'http://maps.googleapis.com/maps/api/streetview?size=600x375&location=' + address + '';
				$(document.getElementById('street-view')).append('<img class="bgimg" src="' + streetviewUrl + '">');

			}else{
				window.alert('No results found');
			}
		}else{
			window.alert('Geocoder failed due to : '+status);
		}

	});

	initialLocations.forEach(function(locationItem){
				self.locationList.push(new Location(locationItem));
	});

	self.searchTerm = ko.observable("");
		this.filteredList = ko.computed(function(){
			var filter = self.searchTerm().toLowerCase();
			if(!filter){
				self.locationList().forEach(function(locationItem){
					locationItem.visible(true);
				});
				return self.locationList();
			}else{
				return ko.utils.arrayFilter(self.locationList(), function(locationItem){
					var string = locationItem.name.toLowerCase();
					var result = (string.search(filter)>=0);
					locationItem.visible(result);
					return result;
				});
			}
		}, self);
	

};



function initMap(){
		ko.applyBindings(new ViewModel());
};


function errorHandling() {
	alert("Connection error. Please try again later.");
};