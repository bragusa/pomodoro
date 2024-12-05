import { useCallback, useEffect, useState } from "react";
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

  const notify = ({id,title,message,browser}) => {
    if(browser){
      showNotification(title, message);
    }
    
    setNotifications((prev) => [
      ...prev,
      {id: id, title: title, message: message}
    ]);
    setTimeout(() => {
      try {
        document.getElementById(id).style.top='0px';
      }
      catch(error){
        //safety
        console.log(error);
      }
    }, 100);
    setTimeout(() => {
      try {
        document.getElementById(id).style.top='-60px';
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

  const pauseTimer = useCallback(() => {
    // Clear the interval to stop the timer from updating
    clearInterval(timeInterval);
    setIsRunning(false);
  }, [timeInterval]);

  const next = useCallback(() => {
    // Clear the interval
    if (timeInterval) {
      clearInterval(timeInterval);
      setTimeInterval(null); // Reset the interval in state
    }

    pauseTimer(); // Pause the timer

    // Check if it's the last interval
    if (currentInterval === intervals.length - 1) {
      done(); // Call the done callback
      return;
    }

    // Move to the next interval
    setRemaining(intervals[currentInterval + 1]?.seconds || 0);
    setCurrentInterval((prev) => prev + 1);
  }, [timeInterval, currentInterval, intervals, done, pauseTimer]);

  const skip = () => {
    notify({outer: false, id: `skip${new Date().getTime()}`, title: '', message: `${intervals[currentInterval].label} was skipped`})
    next();
  };

  useEffect(() => {
    clearInterval(timeInterval);
    setIsRunning(false);
    setIntervalLabel('');
    setCurrentInterval(0);
    setRemaining(intervals[0].seconds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, intervals]);


  useEffect(() => {
    if (remaining === 0) {
      play();
      const label = intervals[currentInterval+1] ? intervals[currentInterval+1].label: intervals[0].label;
      notify({browser: true, id: `skip${new Date().getTime()}`, title: '', message: `${label} time!. Don't forget to start the timer.`})
      next();
    }
  }, [remaining, next, play, intervals, currentInterval]);  

  useEffect(() => {
    if (currentInterval === intervals.length) {
      done();
    }
    setIntervalLabel(intervals[currentInterval].label);
  }, [currentInterval, done, intervals]);

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