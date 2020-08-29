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
    };
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
      loadReservations();
    });
    if(window.location.hash.slice(1)){
      loadReservations();
    }
    else {
      this.setState({ userId: users[0].id });
    }
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
                    <li key = {restaurant.id} className={ restaurants.id }>{restaurant.name}</li>
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
                  <li key = {reservation.id} className = {reservations.id }>{reservation.name} ({reservation.createdAt}</li>
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
