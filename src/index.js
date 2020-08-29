import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { makeMap } from './map';

class App extends Component{
  constructor(){
    super();
    this.state = {
      users: [],
      userId: '', // 1, 2 or 3
      restaurants: [],
      reservations: []
    }
    this.reservationCount = this.reservationCount.bind(this)
    this.loadReservations = this.loadReservations.bind(this)
    this.makeReservation = this.makeReservation.bind(this)
    this.destroyReservation = this.destroyReservation.bind(this)
  }

  async componentDidMount(){
    const users = (await axios.get('/api/users')).data;
    this.setState({ users });
    const restaurants = (await axios.get('/api/restaurants')).data
    this.setState({restaurants});
    makeMap('map');

    const loadInitialReservations = async()=> {
      const userId = window.location.hash.slice(1) * 1;
      const reservations = (await axios.get(`/api/users/${userId}/reservations`)).data
      this.setState({ reservations: reservations, userId: userId})
    };

    window.addEventListener('hashchange', async()=> {
      console.log(this.state.reservations)
      loadInitialReservations();
    });
    if(window.location.hash.slice(1)){
      loadInitialReservations();
    }
    else {
      this.setState({ userId: users[0].id });
    }
  }

  reservationCount (restaurantName) {
    let count = 0
    for (let i=0; i<this.state.reservations.length; i++) {
      let currObject = this.state.reservations[i]
      let currRestaurantName = currObject.restaurant.name
      if (restaurantName === currRestaurantName) {
        count++
      }
    }
    return count
  }

  async loadReservations () {
    const userReservations = (await axios.get(`/api/users/${this.state.userId}/reservations`)).data
    this.setState({ reservations: userReservations})
  }

  async makeReservation (userId,restaurantId) {
    await axios.post(`/api/users/${userId}/reservations`,{restaurantId: restaurantId})
    this.loadReservations()
  }

  async destroyReservation (userId, reservationId) {
    await axios.delete(`/api/reservations/${reservationId}`)
    this.loadReservations()
  }

  render(){
    const { users, userId , restaurants, reservations} = this.state;
    return (
      <div>
        <h1>Reservation Planner</h1>
        <main>
          <section>
            <ul id='userList'>
              {
                users.map( user => {
                  return (
                    <li key={ user.id } className={ userId === user.id ? 'selected': ''}>
                      <a href={ `#${user.id}`}>
                      { user.name }
                      </a>
                    </li>
                  );
                })
              }
            </ul>
          </section>
          <section>
            <ul id='restaurantsList'>
              {
                restaurants.map(restaurant => {
                  return (
                  <li key = {restaurant.id} className={ restaurants.id }>
                    <a onClick = {() => this.makeReservation(userId,restaurant.id)}>
                      {restaurant.name} {this.reservationCount(restaurant.name)}
                    </a>
                  </li>
                  )
                })
              }
            </ul>
          </section>
          <section>
            <ul id='reservationsList'>
              {
                reservations.map(reservation => {
                  return (
                  <li key = {reservation.id} className = {reservation.id }>
                    <a onClick = {() => this.destroyReservation(userId, reservation.id)}>
                      {reservation.restaurant.name} ({reservation.createdAt})
                    </a>
                  </li>
                  )
                })
              }
            </ul>
          </section>
          <section>
            <div id='map'></div>
          </section>
        </main>
      </div>
    );
  }
}

render(<App />, document.querySelector('#root'));
