
//DOM-event
window.onload = init_map();



//https://nominatim.openstreetmap.org/search?q=sverige+Ludvika&format=geojson
//konstanter
const data_lank = "https://nominatim.openstreetmap.org/search?q";

let dest_seach = document.getElementById('sok_destination');
dest_seach.addEventListener('click', search_dest);
let map;
let marker;


async function init_map()
{
    try
    {
        let url_sok = "https://nominatim.openstreetmap.org/search?q="+"sweden"+"&format=geojson";
        let gps_kord= await get_data(url_sok);
        drawmap([gps_kord.features[0].geometry.coordinates[1] ,gps_kord.features[0].geometry.coordinates[0]],"sweden",4);
        //Lägger till ett event för att kunna fånga upp kordinater från användares intergation. dvs att en användaresklick väljer område
        map.on('click', function(e) {
            var clickkordinates = map.mouseEventToLatLng(e.originalEvent); 
            map.removeLayer(marker);
            marker = L.marker([clickkordinates.lat ,clickkordinates.lng]).addTo(map)
            .bindPopup("test")
            .openPopup();
        });

    }
    //Fångar upp eventuella fel som kan uppstå vid hämtning av data. 
    catch(error)
    {
        console.error('nåt gick fel',error);
    }
}


async function search_dest()
{
    try
    {
        let inputdata = document.getElementById('position_input').value;
        let dest = inputdata;

        //förbereder sökorden för API
        dest.replace(" ","+")
        let url_sok = "https://nominatim.openstreetmap.org/search?q="+dest+"&format=geojson";

        let gps_kord= await get_data(url_sok);

        drawmap([gps_kord.features[0].geometry.coordinates[1] ,gps_kord.features[0].geometry.coordinates[0]],inputdata,13);

        console.log("dest",url_sok);
    }

    //Fångar upp eventuella fel som kan uppstå vid hämtning av data. 
    catch(error)
    {
        console.error('nåt gick fel',error);
    }
}



//Ritar karta via chart.js
function drawmap(kordinater,sokdata,zoomlevel)
{
  
    map = L.DomUtil.get('map');
    if(map != null){
        map._leaflet_id = null;
    }

    map = L.map('map').setView(kordinater, zoomlevel);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    marker = L.marker(kordinater).addTo(map)
        .bindPopup(sokdata)
        .openPopup();

        
}

//hämtar data asynkront baserat på input url
async function get_data(url_IN)
{
        const response = await fetch(url_IN);
        const data = await response.json();
        return data;
}

