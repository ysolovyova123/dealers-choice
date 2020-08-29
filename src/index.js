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
    this.makeReservation = this.makeReservation.bind(this)
    this.destroyReservation = this.destroyReservation.bind(this)
  }

  async componentDidMount(){
    const users = (await axios.get('/api/users')).data;
    this.setState({ users });
    const restaurants = (await axios.get('/api/restaurants')).data
    this.setState({restaurants});
    makeMap('map');

    const loadReservations = async()=> {
      const userId = window.location.hash.slice(1) * 1;
      const reservations = (await axios.get(`/api/users/${userId}/reservations`)).data
      const restaurantNames = reservations.map(reservation => {
        return this.state.restaurants.find(restaurant => {
          return restaurant.id === reservation.restaurantId
        })
      })
      this.setState({ reservations: restaurantNames, userId})
    };
    window.addEventListener('hashchange', async()=> {
      //console.log(this.state.reservations)
      loadReservations();
    });
    if(window.location.hash.slice(1)){
      loadReservations();
    }
    else {
      this.setState({ userId: users[0].id });
    }
  }

  reservationCount (restaurantName) {
    let count = 0
    for (let i=0; i<this.state.reservations.length; i++) {
      let currObject = this.state.reservations[i]
      let currRestaurantName = currObject.name
      if (restaurantName === currRestaurantName) {
        count++
      }
    }
    return count
  }

  async makeReservation (userId,restaurantId) {
    await axios.post(`/api/users/${userId}/reservations`,{restaurantId: restaurantId})
    const reservations = (await axios.get(`/api/users/${userId}/reservations`)).data
      const restaurantNames = reservations.map(reservation => {
        return this.state.restaurants.find(restaurant => {
          return restaurant.id === reservation.restaurantId
        })
      })
    this.setState({ reservations: restaurantNames, userId})
  }

  async destroyReservation (reservationId) {
    await axios.delete(`/api/reservations/${reservationId}`)
    const reservations = (await axios.get(`/api/users/${this.state.userId}/reservations`)).data
      const restaurantNames = reservations.map(reservation => {
        return this.state.restaurants.find(restaurant => {
          return restaurant.id === reservation.restaurantId
        })
      })
    this.setState({ reservations: restaurantNames, userId: this.state.userId})
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
                    <a onClick = {() => this.makeReservation(this.state.userId,restaurant.id)}>
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
                  <li key = {reservation.id} className = {reservations.id }>
                    <a onClick = {() => this.destroyReservation(reservation.id)}>{reservation.name} ({reservation.createdAt})</a>
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
