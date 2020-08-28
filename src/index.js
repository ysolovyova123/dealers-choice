import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import { makeMap } from './map';

class App extends Component{
  constructor(){
    super();
    this.state = {
      users: [],
      userId: ''
    };
  }
  async componentDidMount(){
    const users = (await axios.get('/api/users')).data;
    this.setState({ users });
    makeMap('map');
    const loadReservations = async()=> {
      const userId = window.location.hash.slice(1) * 1;
      this.setState({ userId });
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
    const { users, userId } = this.state;
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
            </ul>
          </section>
          <section>
            <ul id='reservationsList'>
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
