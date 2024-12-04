import { useEffect, useState } from "react";
import './Timer.scss';
import { Restart, Skip } from '../../Resources/svg';
import AppNotification, { showNotification } from "../Notification/Notification";
import FocusDark from '../../Resources/images/dark/focus.svg';
import FocusLight from '../../Resources/images/light/focus.svg';
import BreakDark from '../../Resources/images/dark/break.svg';
import BreakLight from '../../Resources/images/light/break.svg';
import Alarm from '../../Resources/sounds/alarm.mp3';
import useSound from 'use-sound';

const Timer = ({ done, session, intervals, restart }) => {
  const [currentInterval, setCurrentInterval] = useState(0);
  const [remaining, setRemaining] = useState(intervals[currentInterval].seconds);
  const [isRunning, setIsRunning] = useState(false);
  const [timeInterval, setTimeInterval] = useState(null);
  const [intervalLabel, setIntervalLabel] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [play] = useSound(Alarm);

  const notify = (notification) => {
    showNotification(notification.title, notification.message);
    setNotifications((prev) => [
      ...prev,
      notification
    ]);
    setTimeout(() => {
      try {
        document.getElementById(notification.id).style.top='0px';
      }
      catch(error){
        //safety
        console.log(error);
      }
    }, 100);
    setTimeout(() => {
      try {
        document.getElementById(notification.id).style.top='-60px';
      }
      catch(error){
        //safety
        console.log(error);
      }
      setTimeout(() => {
        setNotifications((prev) => {
          const newNotifications = [...prev];
          newNotifications.shift();
          return newNotifications;
        });
      }, 200);
    }, 5000);
  }

  const next = () => {
    pauseTimer();
    if (currentInterval === intervals.length - 1) {
      done();
      return; 
    }
    setRemaining(intervals[currentInterval + 1].seconds);
    setCurrentInterval(prev => prev + 1);
  }

  const skip = () => {
    notify({id: `skip${new Date().getTime()}`, title: '', message: `${intervals[currentInterval].label} was skipped`})
    next();
  };


  useEffect(() => {
    clearInterval(timeInterval);
    setIsRunning(false);
    setIntervalLabel('');
    setCurrentInterval(0);
    setRemaining(intervals[0].seconds);
  }, [session, intervals]);


  useEffect(() => {
    if (remaining === 0) {
      play();
      const label = intervals[currentInterval+1] ? intervals[currentInterval+1].label: intervals[0].label;
      notify({id: `skip${new Date().getTime()}`, title: '', message: `${label} time!. Don't forget to start the timer.`})
      next();
    }
  }, [remaining]);  

  useEffect(() => {
    if (currentInterval === intervals.length) {
      done();
    }
    setIntervalLabel(intervals[currentInterval].label);
  }, [currentInterval]);

  const pauseTimer = () => {
    // Clear the interval to stop the timer from updating
    clearInterval(timeInterval);
    setIsRunning(false);
  }

  const startTimer = () => {
    // Use setInterval to update the timer every 1000 milliseconds (1 second)
    setIsRunning(true);
    setTimeInterval(setInterval(() => {
      setRemaining((prev) => prev - 1);
    }, 1000));
  }

  // Function to reset the timer
  const resetTimer = () => {
    // Reset the timer value to 0
    setRemaining(intervals[currentInterval].seconds);
    setIsRunning(false);
    // Clear the interval to stop the timer
    clearInterval(timeInterval);
    notify({id: `reset${new Date().getTime()}`, title: '', message: `Timer for session ${session || 1} - (${intervals[currentInterval].label} time) has been reset.`});
  }

  function isDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  const timerRunning = remaining < intervals[currentInterval].seconds;
  const label = 'focus time';

  let imageURL = isDarkMode() ? BreakLight : BreakDark;
  if(intervalLabel.includes('focus')){
    imageURL = isDarkMode() ? FocusLight : FocusDark;
  }
  
  const type = intervalLabel.includes('break')? 'break':'working';

  return <><div className='main-card'>
    <div>
      <div>Session {session || 1} ({intervalLabel} time)</div>
      <button title='Reset All' onClick={restart}><Restart width='20px' height='20px' /></button>
    </div>
    <div>
      <div className='main-card-image' style={{ 
         backgroundImage: `url(${imageURL})`
       }}></div>
      <div className='Timer'>
        {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, '0')}
        <div className='control-buttons'>
          <>
            {<button onClick={resetTimer} style={{visibility: !isRunning || !timerRunning ? 'hidden':'visible'}}><div style={{ transform: 'scaleX(-1)' }}><Restart width='20px' height='20px' /></div></button>}
            {isRunning ?
              <button className='main-button' onClick={() => pauseTimer()}>{`Pause ${type}`}</button> :
              <button className='main-button' onClick={() => { if (!isRunning) { startTimer() } }}>{timerRunning ? `Resume ${type}` : `Start ${type}`}</button>
            }
            {<button style={{visibility: (timerRunning || currentInterval > 0)? 'visible':'hidden'}} onClick={skip}><div><Skip /></div></button>}
          </>
        </div>
      </div>
    </div>
  </div>
  <div className='Notifications'>
    {notifications.map((notification, index) => {
      return <AppNotification
        index={index}
        key={notification.id}
        id={notification.id }
        title={notification.title}
        message={notification.message}
      />
    })}
  </div>
  </>
}

export default Timer;