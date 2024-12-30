import express from "express";
import axios from "axios";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", (req,res) => {
    res.render("index.ejs");
});

app.get('/search', async (req, res) => {
    const city = req.query.city;
    const country = req.query.country; 
    const apiKey = '';
    const geocodingApiKey = ''; 

    try {
        
        const geoUrl = `https://api.opencagedata.com/geocode/v1/json?q=${city}${country ? `,${country}` : ''}&key=${geocodingApiKey}`;
        const geoResponse = await axios.get(geoUrl);

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            throw new Error('No location found for the specified city.');
        }

        const location = geoResponse.data.results[0].geometry;
        const { lat, lng } = location;

        console.log(`Latitude: ${lat}, Longitude: ${lng}`);

       
        const apiUrl = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lng}&distance=50&key=${apiKey}`;
        const response = await axios.get(apiUrl);

        

        const chargers = response.data;
        res.render('results', { chargers, city });
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.render('error', { message: error.message || 'Failed to retrieve data. Please try again.' });
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});