import './Country.css';
import React, { Component } from 'react';
import axios from 'axios';
import ReactAudioPlayer from 'react-audio-player';
import { Link } from 'react-router-dom';
import UserVisit from '../UserVisit/UserVisit';

class Country extends Component {
  constructor(props){
    super(props)
    this.state = {
      country: [],
      currencies: [],
      languages: [],
      borders: [],
      countryApi: {},
      countryId:  '',
      countryNames: {},
      pictures: [] 
    }
  }

  fetchData = async (abbr) => {
    const country = await axios(`https://restcountries.eu/rest/v2/alpha/${this.props.match.params.abbr}`)
    this.setState({
      country: country.data,
      currencies: country.data.currencies,
      languages: country.data.languages,
      borders: country.data.borders,
    })
    this.fetchWorldData()
  }

  fetchWorldData = async () => {
    const world = await axios(`http://localhost:8000/world/`)
    const country = world.data.filter(country => {
      if(country.fields.country_code === this.props.match.params.abbr){
      return country
      }
    })
    const allCountryNames = {}
    world.data.forEach(country => {
      allCountryNames[country.fields.country_code] = country.fields.country_name
    })
    this.setState(prevState=>({
      ...prevState,
      countryApi: country[0].fields,
      countryId:  country[0].pk,
      countryNames: allCountryNames
    }))
    this.fetchCountryData()
  }

  fetchCountryData = async () => {
    const countryPhotos = await axios(`http://localhost:8000/country/${this.state.countryId}/photos/`)
    this.setState(prevState=>({
      ...prevState,
      pictures: countryPhotos.data
    }))
  }

  async componentDidMount() {
    this.fetchData(this.props.match.params.abbr)
  }

  componentDidUpdate(prevProps){
    if(this.props.match.params.abbr !== prevProps.match.params.abbr){this.fetchData()}
  }

  render() {
    const country = this.state.country
    const countryApi = this.state.countryApi
    const pictures = this.state.pictures
    return (
      <div id='countryDisplay'>
        <h2>Country</h2>
        <h2>{country.name} ({country.alpha3Code})</h2>
        <UserVisit countryId={this.state.countryId}/>
        <div className='countryInfo'>
          <img className='flag' src={country.flag} alt='flag'/>
          <div className='countryFacts'>
            <p>Capital: {country.capital}</p>
            <p>Currency: {this.state.currencies.map(currency => {
              return (`${currency.symbol} = ${currency.code} (${currency.name}) `)
            })}</p>
            <p>Language(s): {this.state.languages.map(language => {
              return (`${language.name}  `)
            })}</p>
            <p>Population: {parseInt(country.population).toLocaleString()}</p>
            <div className='border'>
              <p>Bordering Countries:</p>
              {this.state.borders && 
                <div className='border'> {this.state.borders.map(border => {
                  return <p>
                    <Link to={`/country/${border}`}>
                      {border} - {this.state.countryNames[border]}
                      </Link>
                      </p> })}
                </div>
              }
            </div>
          </div>
          <div className='countryMap'>
            <img className='globe' src={countryApi.globe_map}/>
            {countryApi.anthem && 
              <>
                <a href={countryApi.wiki_link}>Anthem</a>
                <ReactAudioPlayer
                  src={countryApi.anthem}
                  // autoPlay
                  controls
                />
              </>
            }
          </div>
        </div>
        <p>Wikipedia <a href={countryApi.wiki_link}>Link</a> </p>
        <div id='pictures'>
          {pictures && pictures.map(picture => {
            return (
              <div className='countryPicture'>
                <img src={picture.fields.picture_url}/>
                <p>{picture.fields.picture_location}</p>
                <p><a href={picture.fields.picture_photographer_link}>{picture.fields.picture_photographer}</a> </p>
                <p>Picture <a href={picture.fields.picture_source}>source</a> </p>
              </div>
            )})}
        </div>
      </div>
    );
  }
}

export default Country;