/* global google */
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import '../App.css';
import ModalWindow from './ModalWindow.jsx';

class MyMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isloggedIn: true,
      directions: null,
      parks: [],
      modal: false,
      currentPark: null,
      waypoints: [],
      savedParks: []
    }
    this.originInput = React.createRef();
    this.destinationInput = React.createRef();
    this.mapElt = React.createRef();
    this.origin = null
    this.destination = null
    // this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetchData();
    this.directionsService = new google.maps.DirectionsService();
    let originAutocomplete = new google.maps.places.Autocomplete(this.originInput.current);
    let destinationAutocomplete = new google.maps.places.Autocomplete(this.destinationInput.current);
    originAutocomplete.setFields(['place_id']);
    destinationAutocomplete.setFields(['place_id']);
    this.placeChanged(originAutocomplete, 'ORIG')
    this.placeChanged(destinationAutocomplete, 'DEST');

    this.map = this.mapElt.current.context['__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'];
    this.map.disableDefaultUI = true;
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.originInput.current);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(this.destinationInput.current);

  }

  placeChanged(autocomplete, mode) {
    var me = this;
    autocomplete.addListener('place_changed', function () {
      var place = autocomplete.getPlace();

      if (!place.place_id) {
        window.alert('');
        return;
      }
      if (mode === 'ORIG') {
        me.origin = place.place_id;
      } else {
        me.destination = place.place_id;
      }
      me.route();
    });
  }

  route() {
    console.log('route')
    if (!this.origin || !this.destination) {

      return;
    }

    console.log('route 2 hit')
    var me = this;
    this.directionsService.route(
      {
        origin: { 'placeId': this.origin },
        destination: { 'placeId': this.destination },
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: this.state.waypoints,
        optimizeWaypoints: true,
      },
      function (response, status) {
        if (status === 'OK') {
          console.log('hit if')
          me.setState({
            directions: response,
          });
        } else {
          window.alert('Oh no! It looks like our map cannot generate a route to this park. Please choose another.');
          me.removeLastWaypoint();
        }
      });
  }

     removeLastWaypoint =(waypoint)=>{
      const waypoints = this.state.waypoints
      waypoints.pop()
      this.setState({ waypoints: waypoints }, () => {
        this.route();
    })
  }

  saveParkName = (name) => {
    const saved = this.state.savedParks
    saved.push(name)
    this.setState({ 
      savedParks: saved
    })
    console.log("yoyo", this.state.savedParks)
  }
  fetchData() {
    fetch('/parks/index')
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            this.setState({ parks: data })
          })

        }
      })
      .catch(err => console.log('parsing failed', err))

  }
  handleModal(park) {
    this.setState({ modal: false, currentPark: park });
    console.log(park);

    this.setState({ modal: true });

  }
  addWaypoint = (waypoint) => {
    const waypoints = this.state.waypoints
    waypoints.push(waypoint)
    this.setState({ waypoints: waypoints }, () => {
      this.route();
    })
  }
  handleSave = (event) => {
    event.preventDefault();
     window.fetch('/users/save_route', {
      method: 'POST',
      body: JSON.stringify({
          origin: this.origin,
          destination: this.destination,
          waypoints: this.state.savedParks
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(async resp => await resp.json())
        .then((json) => {

          console.log(json)


        })
        .catch(err => console.log(err))

    
  } 
  render() {
      console.log("saviing", this.state.savedParks)
    return (
      <div>
        <input ref={this.originInput} type="text" placeholder="Enter a start location"
          style={{ position: "absolute", top: 0 }} />
        <input ref={this.destinationInput} type="text" placeholder="Enter an end location"
          style={{ position: "absolute", top: 0 }} />
        <GoogleMap
          ref={this.mapElt}
          defaultZoom={4}
          defaultCenter={{ lat: 47.9253, lng: -97.03294 }}
        >
          {this.state.parks.map(park => {
            return (<Marker className="markers" Name={park.name} position={new google.maps.LatLng(park.lat, park.long)}
              onClick={this.handleModal.bind(this, park)}
            />)
          })}
          {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
        </GoogleMap>
        {this.state.modal ? (
          <ModalWindow park={this.state.currentPark}
            addWaypoint={this.addWaypoint} 
            save={this.saveParkName}
            />
        ) : (
            <h1> </h1>
          )}
        <form onSubmit={this.handleSave.bind(this)}>
      <button>Save Route</button>
     </form>
      </div>)
  }

}

export default withGoogleMap(MyMapComponent);


// icon={park.img}
