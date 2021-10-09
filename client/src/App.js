import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { useEffect, useState } from 'react';
import { Room, Star } from '@material-ui/icons';
import './App.css';
import axios from 'axios';
import { format } from 'timeago.js';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  const myStorage = window.localStorage;
  let [currentUser, setCurrentUser] = useState(null);
  const [pins, setPins] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
  });
  const [showPopup, togglePopup] = useState(null);
  const [place, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 28.7041,
    longitude: 77.1025,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const getPins = async () => {
      try {
        const res = await axios.get('/pins');
        setPins(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPins();
  }, []);

  const handleMarkerClick = (id, lat, long) => {
    togglePopup(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };
  const handleDbClick = (e) => {
    const [long, lat] = e.lngLat;
    setNewPlace({
      lat,
      long,
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      ...formData,
      username: 'vishal',
      lat: place.lat,
      long: place.long,
    };
    try {
      const res = axios.post('/pins', newPin);
      setPins([...pins, (await res).data]);
      setNewPlace(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };


  return (
    <div className="App">
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapStyle="mapbox://styles/vishalbhoriwal/ckujojh85btaf18s0iiyc4vpk"
        onDblClick={currentUser && handleDbClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Room
                style={{ fontSize: viewport.zoom * 7, color: 'slateblue' }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
              />
            </Marker>
            {p._id === showPopup && (
              <Popup
                latitude={p.lat}
                longitude={p.long}
                closeButton={true}
                closeOnClick={false}
                onClose={() => togglePopup(false)}
                anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4>{p.title}</h4>
                  <label>Review</label>
                  <p>{p.description}</p>
                  <label>Rating</label>
                  <div>{Array(p.rating).fill(<Star className="star" />)}</div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>
                </div>
              </Popup>
            )}
          </>
        ))}
        {place && (
          <Popup
            latitude={place.lat}
            longitude={place.long}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
            anchor="left"
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  name="title"
                  placeholder="Enter Title"
                  value={formData.title}
                  onChange={handleChange}
                />
                <label>Review</label>
                <textarea
                  name="description"
                  onChange={handleChange}
                  placeholder="say something about this place"
                  value={formData.description}
                />
                <label>Rating</label>
                <select
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button className="submitButton" type="submit">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}
        {currentUser ? (
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUsername={setCurrentUser}
            myStorage={myStorage}
          />
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
