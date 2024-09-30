import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import StarRating from './StarRating';
// import './StarRating.css'


//The consumer might need the state outside of the component
//We need to allow the consumer the ability to pass in a set function
// function Test(){
//   const [movieRating,setMovieRating] = useState(0)
//   return <div>
//   <StarRating color="green" maxRating={10} onSetRating = {setMovieRating}/>
//   <p>The movie was rated {movieRating} stars</p>
//   </div>
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} messages={['Terrible','Bad','Okay','Good','Amazing']}/>
    <StarRating maxRating={20} size={24} color="blue" className="test" defaultRating={3}/>
    <Test/> */}
  </React.StrictMode>
);


