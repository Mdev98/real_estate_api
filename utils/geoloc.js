const axios = require('axios');


const geoLoc = async (adress) => {

    try{
        const res = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(adress)}.json?access_token=pk.eyJ1IjoibWFtb3VyLWQiLCJhIjoiY2txaDF6b3VsMXprbjJybjBqYnY1YWF3dSJ9.18uZ2BKSuxUhc2oxcUsSCg&limit=1`);
        const [resultat] = res.data.features;
        return { "formattedAdress" : resultat.place_name, "coord" : resultat.center }
    }catch(e){
        return e
    }
}

// geoLoc("Rufisque")

module.exports = geoLoc;