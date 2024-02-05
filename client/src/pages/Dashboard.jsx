import { useEffect, useState } from 'react';
import { css } from '@emotion/css'

import Header from '../components/Header.jsx';
import Goals from '../components/Goals.jsx';
import DailyChecks from '../components/DailyChecks.jsx';
import Notes from '../components/Notes.jsx';
import Schedule from '../components/Schedule.jsx';
import ProfileForm from '../components/ProfileForm.jsx';

export default function Dashboard() {
  const [yearGoals, setYearGoals] = useState([]);
  const [monthGoals, setMonthGoals] = useState([]);
  const [weekGoals, setWeekGoals] = useState([]);
  const [notes, setNotes] = useState([]);
  const [checks, setChecks] = useState([]);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('name')
  const [location, setLocation] = useState('Pasadena')
  const [visibility, setVisibility] = useState('hidden');

  const getData = () => {
    fetch('/api/data/allData')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response);
        return response.json(); // or response.text() for text data
      })
      .then((data) => {
        // console.log(data.events);
        setYearGoals(data.goals.filter(goal => goal.goal_type === 'Yearly'));
        setMonthGoals(data.goals.filter(goal => goal.goal_type === 'Monthly'));
        setWeekGoals(data.goals.filter(goal => goal.goal_type === 'Weekly'));
        setNotes(data.notes.map(note => note));
        setChecks(data.dailyChecks.map(check => check));
        setName(data.user.map(user => user.name));
        setLocation(data.user.map(user => user.location));
        setEvents(data.events.map(event => event));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  useEffect(() => {
    fetch('/api/home')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        // console.log(response);
        return response.json();
      })
      .then((data) => {
        if (data.loggedIn) {
          // console.log(data);
          getData();
        } else {
          window.location.replace('/login')
        }
      })
      .catch((error) => {
        console.error(error)
      });
  }, []);

  return (
    <div>

      <Header name={name} location={location} visibility={visibility} setVisibility={setVisibility} />
      <ProfileForm visibility={visibility} setVisibility={setVisibility} />

      <main className={css`display: flex;`}>
        <section id="left" className={css`width: 33%; height: 100vh; display: flex; flex-direction: column;`}>
          <DailyChecks checks={checks} setChecks={setChecks} getData={getData}/>
          <Goals goals={weekGoals} setGoals={setWeekGoals} goalType="Weekly" getData={getData}/>
        </section>

        <section id="middle" className={css`width: 34%; height: 100vh; display: flex; flex-direction: column;`}>
          <Schedule events={events} setEvents={setEvents} getData={getData}/>
          <Goals goals={monthGoals} setGoals={setMonthGoals} goalType="Monthly" getData={getData}/>
        </section>

        <section id="right" className={css`width: 33%; height: 100vh; display: flex; flex-direction: column;`}>
          <Notes notes={notes} setNotes={setNotes} getData={getData}/>
          <Goals goals={yearGoals} setGoals={setYearGoals} goalType="Yearly" getData={getData}/>
        </section>
      </main>

    </div>
  )
}