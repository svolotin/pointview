import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lat: 60.847698232804973,
      lng: 22.367672757355923,
      zoom: 13,
      queryarray: [],
      results: []

    }
  }

  addPointToQuery = (e) => {
    const { queryarray } = this.state
    var lat = e.latlng.lat;
    var long = e.latlng.lng;
    console.log([lat, long]);
    queryarray.push([long, lat])
    this.setState({ queryarray })

  }

  doQuery = (event) => {
    event.preventDefault()
    const queryObject = {
      coordinates: [this.state.queryarray],
      Type: "Polygon"
    }

    axios
      .post('http://localhost:18080/geospatial/rest/trunks/inarea ', queryObject)
      .then(response => {
        this.setState({
          results: this.state.results.concat(response.data)

        })
      })
  }

  reset = (event) => {
    event.preventDefault()
    const queryarray = []
    const results = []
    this.setState({ queryarray, results })
  }

  render() {
    const position = [this.state.lat, this.state.lng]
    const area = this.state.queryarray
    const pc = true
    return (
      <div>
        <Map center={position} onClick={this.addPointToQuery} zoom={this.state.zoom} preferCanvas={pc}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.results.map((object) =>
            <Resultmarker object={object} >
            </Resultmarker>
          )}
        </Map><br />
        <Button
          handleClick={this.doQuery}
          text="Fetch Data"
        /><br /><br />
        <Button
          handleClick={this.reset}
          text="Reset"
        /><br /><br />
        <Queryarea
          list={area}
        />
      </div>

    )
  }
}

const Resultmarker = ({ object }) => {
  const { x, y, area, height, species } = object

  var position = {
    lat: y,
    lng: x
  }

  return (
    <Marker position={position}>
      <Popup>
        <span>Trunk Area: {area} <br />Height: {height} <br />Species: {species}</span>
      </Popup>
    </Marker>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const Queryarea = ({ list }) => {
  const array = list
  return (
    array.map((row) =>
      <div>{row}</div>
    )
  )
}

export default App;
