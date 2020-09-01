import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';

class App extends Component{
  constructor(){
    super();
    this.state = {
      groups: [],
      tables: [],
      guests: [],
      groupSelection: '' // 1, 2 or 3
    }
    //this.setSelection = this.setSelection.bind(this)
    this.displayTables = this.displayTables.bind(this)
    this.displayGuests = this.displayGuests.bind(this)
    this.tableCount = this.tableCount.bind(this)
  }

  async componentDidMount(){
    const groups = (await axios.get('/api/groups')).data;
    this.setState({ groups });
    //const tables = (await axios.get('/api/tables')).data
    //this.setState({tables});

    const setSelection = async()=> {
      const groupSelection = window.location.hash.slice(1);
      console.log(groupSelection)
      //const guests = (await axios.get(`/api/guests/${groupSelection}`)).data
      const tables = (await axios.get(`/api/tables/${groupSelection}`)).data
      this.setState({
        tables: tables,
        groupSelection: groupSelection,
        guests: []})
    };

    window.addEventListener('hashchange', async()=> {
      //console.log(this.state.reservations)
      setSelection();
    });
    if(window.location.hash.slice(1)){
      this.displayTables();
    }
    else {
      this.setState({ groupSelection: groups[0].group });
    }
  }

  async displayTables () {
    const tables = (await axios.get(`/api/tables/${this.state.groupSelection}`)).data
    this.setState({ tables: tables})
  }

  tableCount () {
    let count = this.state.guests.length
    return count
  }

  async displayGuests () {
    const guests = (await axios.get(`/api/guests/${this.state.groupSelection}`)).data
    this.setState({ guests: guests})
  }

  render(){
    const { groups, tables , guests, groupSelection} = this.state;
    return (
      <div>
        <h1>Guest List</h1>
        <main>
          <section>
          <h3>Groups (Select One)</h3>
            <ul id='groupList'>
                {groups.map( group => {
                  return (
                    <li key={ group.id } className={ groupSelection === group.id ? 'selected': ''}>
                      <a href={ `#${group.name}`}>
                      { group.name }
                      </a>
                    </li>
                  );
                })}
            </ul>
          </section>
          <section>
          <h3>Tables (Select One)</h3>
            <ul id='tableList'>
              {
                tables.map(table => {
                  return (
                  <li key = {table.id} className={ table.id }>
                    <a onClick = {() => this.displayGuests()}>
                      {table.table}
                    </a>
                  </li>
                  )
                })
              }
            </ul>
          </section>
          <section>
          <h3>Guests At The Table</h3>
            <ul id='guestList'>
              {
                guests.map(guest => {
                  return (
                  <li key = {guest.id} className = {guest.id }>
                    {guest.name}
                  </li>
                  )
                })
              }
            </ul>
          </section>
        </main>
      </div>
    );
  }
}

render(<App />, document.querySelector('#root'));
