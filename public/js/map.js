

	// const map = L.map('map').setView([   28.644800 , 77.216721 ], 12);

	// const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	// 	maxZoom: 19,
    // 		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	// }).addTo(map);

    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map);

	// var circle = L.circle([ 28.644800 , 77.216721 ], {
	// 	color: 'red',
	// 	fillColor: '#ffff',
	// 	fillOpacity: 0.5,
	// 	radius: 500
	// }).addTo(map);

	var map;
	function initMap1() {
		map = new mappls.Map('map', {
			disableDoubleClickZoom: false,
			zoomControl: false,
			draggable: true,
			scrollwheel: true,
			zoom: 5,
		});
	}
	function initMap1() {
		map = new mappls.Map('map', {center:[28.638698386592438,77.27604556863412]});
	}