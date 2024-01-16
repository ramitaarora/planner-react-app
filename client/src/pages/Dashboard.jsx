import { useEffect, useState } from 'react';

import Header from '../components/Header.jsx'
import YearlyGoals from '../components/YearlyGoals.jsx';
import MonthlyGoals from '../components/MonthlyGoals.jsx';
import WeeklyGoals from '../components/WeeklyGoals.jsx';
import DailyChecks from '../components/DailyChecks.jsx';
import Notes from '../components/Notes.jsx';
import Schedule from '../components/Schedule.jsx';
import CalendarCard from '../components/CalendarCard.jsx';

export default function Dashboard() {
    const [yearGoals, setYearGoals] = useState([]);
    const [monthGoals, setMonthGoals] = useState([]);
    const [weekGoals, setWeekGoals] = useState([]);
    const [notes, setNotes] = useState([]);
    const [checks, setChecks] = useState([]);
    const [events, setEvents] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const auth = () => {
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
              return;
          } else {
              window.location.replace('/login')
          }
      })
      .catch((error) => {
          console.error(error)
      });
  }
   
    useEffect(() => {
      auth();

      fetch('/api/data/allData')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          // console.log(response);
          return response.json(); // or response.text() for text data
        })
        .then((data) => {
          // console.log(data);
          setYearGoals(data.yearlyGoals.map(goal => goal));
          setMonthGoals(data.monthlyGoals.map(goal => goal));
          setWeekGoals(data.weeklyGoals.map(goal => goal));
          setNotes(data.notes.map(note => note));
          setChecks(data.dailyChecks.map(check => check.daily_check));
          setEvents(data.events.map(event => event));
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }, []);
  
    return (
      <div>
        <Header />
  
        <main>
          <section id="left">
            <YearlyGoals yearGoals={yearGoals} setYearGoals={setYearGoals} inputValue={inputValue} setInputValue={setInputValue} />
            <MonthlyGoals monthGoals={monthGoals} setMonthGoals={setMonthGoals} inputValue={inputValue} setInputValue={setInputValue} />
            <WeeklyGoals weekGoals={weekGoals} setWeekGoals={setWeekGoals} inputValue={inputValue} setInputValue={setInputValue} />
          </section>
  
          <section id="middle">
            <Schedule events={events} setEvents={setEvents}/>
            <DailyChecks checks={checks} setChecks={setChecks} />
          </section>
  
          <section id="right">
            <Notes notes={notes} setNotes={setNotes} inputValue={inputValue} setInputValue={setInputValue} />
            <CalendarCard />
          </section>
        </main>
  
      </div>
    )
}