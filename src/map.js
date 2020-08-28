import mapboxgl from 'mapbox-gl'; 
mapboxgl.accessToken = window.accessToken; 

let map;

const makeMap = (id, center) => {
  map = new mapboxgl.Map({
    container: id,
    style: 'mapbox://styles/mapbox/streets-v11',
    center,
    zoom: 5
  });
}


export { makeMap };
