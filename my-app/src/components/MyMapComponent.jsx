/* global google */
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";
import './MyMapComponent.css';
import PointsOfInterest from './PointsOfInterest';

class MyMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      directions: null,
      parks: [],
    }
    this.originInput = React.createRef();
    this.destinationInput = React.createRef();
    this.mapElt = React.createRef();
    this.origin = null
    this.destination = null
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
    if (!this.origin || !this.destination) {
      return;
    }
    var me = this;
    this.directionsService.route(
      {
        origin: { 'placeId': this.origin },
        destination: { 'placeId': this.destination },
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: this.props.waypoints,
        optimizeWaypoints: true,
        },
      function (response, status) {
        if (status === 'OK') {
          me.setState({
            directions: response,
          });
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      });
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
  render() {
    this.route()
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
            return (<Marker className="markers" Name={park.name} position={new google.maps.LatLng(park.lat, park.long)} />)
          })}
          {this.state.directions && <DirectionsRenderer directions={this.state.directions} />}
        </GoogleMap>
      </div>)
  }

}

export default withGoogleMap(MyMapComponent);