import React, {
  Component
} from 'react';
import './App.css';
import MyMapComponent from './components/MyMapComponent.jsx';
import NavBar from './components/NavBar';
import TripId from './components/TripId';
import ToDoList from './components/ToDoList';
import Footer from './components/Footer';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
       isLoggedIn: true,
       tripId: null,
       foundRoute: null
    }
    this.handleSearchForRoute = this.handleSearchForRoute.bind(this);
    this.handleState = this.handleState.bind(this);
  }
  handleState(id) {
    console.log("state", this.state)
    this.setState({isLoggedIn: true,
                  tripId: id
      })
    console.log("state", this.state)
  }
  addWaypoint =(waypoint)=>{
    const waypoints = this.state.waypoints
    waypoints.push(waypoint)
    this.setState({ waypoints })
  }
  handleSearchForRoute(ori, des, trip, list, latlong) {
    // console.log("origin", ori)
    // console.log("des", des)
    // console.log("trip", trip)
    // console.log("list", list)
    this.setState({
          isLoggedIn: true,
      foundRoute: [ori, des, trip, list, latlong]})
    console.log(this.state.foundRoute)
  }
  
  render() {
    if(!this.state.isLoggedIn) {
      return ( < TripId update = {
            this.handleState.bind(this)
          }
          search={this.handleSearchForRoute.bind(this)}
          />)
    } else {
    return (
      <div className="App">
        <NavBar/>
        <div className="main-container">
          <MyMapComponent
            waypoints={this.state.waypoints}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyADfvn7bqN8wTxIrPUpCZZMEoURzEsj5sU"
            containerElement={<div className="mapContainer"/>}
            loadingElement={<div className="loadingElement"/>}
            mapElement={<div className="mapElement" id="map"/>}
            id={this.state.tripId}         
            foundRoute={this.state.foundRoute}
         />
          <ToDoList />
        </div>

        <Footer/>
      </div>
    );
    }
 
  }
}

export default App;