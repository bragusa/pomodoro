import { useState } from 'react';
import './App.scss';
import Timer from './components/Timer/Timer';
import ReactDOM from 'react-dom';
import { showNotification } from './components/Notification/Notification';


function App() {
  const [focusSession, setFocusSession] = useState(1);

  const intervals = [ //total time per session is: 2:10
    {
      label: '1st focus',
      seconds: 1500 //25 mins
    },
    {
      label: '1st short break',

      seconds: 300 //5 mins
    },
    {
      label: '2nd focus',
      seconds: 1500 //25 mins
    },
    {
      label: '2nd short break',
      seconds: 300 //5 mins
    },
    {
      label: '3rd focus',
      seconds: 1500 //25 mins
    },
    {
      label: '3rd short break',
      seconds: 300 //5 mins
    },
    {
      label: '4th focus',
      seconds: 1500 //25 mins
    },
    {
      label: 'long break',
      seconds: 900 //15 mins
    }
  ];

  return (
    <>
      <div className="App">
          <Timer restart={()=>{
            showNotification('', `Reset all sessions`);
            window.location.reload();
          }} done={()=>{
            setFocusSession(prev=>prev+1);
          }} session={focusSession} intervals={intervals}/>
      </div>
    </>
  );
}


export default App;
