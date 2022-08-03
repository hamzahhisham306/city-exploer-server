'use strict';

require('dotenv').config();

const express=require('express');
const cors=require('cors');
const axios=require("axios");

const app=express();

app.use(cors());

const PORT=3000 || 5000;
const keyMovie='915a2c5b1b8723046c5bfe5167d3a0d4';
const keyWeather='d4b28539a2b24563a94b4a3d14d3d37f';

const weatherData=require('./data/Weather.json');

console.log(weatherData);

app.get('/weather',async (req, res)=>{
    const searchQuery=req.query.searchQuery;
    const lat=req.query.lat;
    const lon=req.query.lon;

    const cityArr=await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${keyWeather}`);
    console.log(cityArr)
    try{
    const weatherArr=cityArr.data.data.map((item=>new Forecast(item)))
     
    res.status(200).send(weatherArr);
    }
    catch(err){
      handleError(err, res);
    }
})
app.get('/movies', async (req, res)=>{
    const searchQuery=req.query.searchQuery;
    const moviesArr=await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${keyMovie}&query=${searchQuery}`);
    try{
      const arrayOfmovies=moviesArr.data.results.map((movie=>new Movie(movie)));
       res.status(200).send(arrayOfmovies);
    }
    catch(err){
        handleError(err, res);
    }
})

function handleError(error, res){
    res.status(500).send('Somthing went wrong');

}



class Forecast{
    constructor(day){
        this.data=day.valid_date;
        this.description=day.weather.description;
    }
}

class Movie{
    constructor(movie){
        this.title = movie.title;
        this.overview =movie.overview;
        this.average_votes = movie.vote_average;
        this.total_votes = movie.vote_count;
        this.image_url = movie.poster_path;
        this.popularity = movie.popularity;
        this.release_date = movie.release_date;
    }
}
app.listen(PORT,()=>{
    console.log('Working Server!!!')
})