import './Notification.scss';

function capitalize(s)
{
    if(!s){
        return '';
    }
    return String(s[0]).toUpperCase() + String(s).slice(1);
}

export const showNotification = (id, title, message) => {
  if (!("Notification" in window)) {
    console.error("This browser does not support desktop notification.");
    return;
  }

  // Check for permission
  if (Notification.permission === "granted") {
    // If granted, create the notification
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    // Request permission if not denied
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body: message });
      } else {
        console.error("Notification permission denied.");
      }
    });
  } else {
    console.error("Notifications are denied. Please enable them in your browser settings.");
  }
}

const AppNotification = ({id, title, message, index}) => {
  if(!title && !message){
    return null;
  }

  return <div style={{zIndex: `${200-index}`}} id={id} className='Notification'>
      {title?<h1>{title}</h1>:null}
      <p>{message}</p>
    </div>
};

export default AppNotification;