import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const { query } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedin, setLoggedin] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    let token=localStorage.getItem('token')
    if (query) {
      axios.post(`${window.location.origin}/myacc/signup/authenticateuser`, { query,token })
        .then((res) => {
          if (res.data.result === 'success') {
            localStorage.setItem("id", query);
            setUsername(res.data.username);
            setLoggedin(false);
          }
        });
    }
  }, [query]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  async function handlefp(){
    let x=prompt('Enter username', 'username');
    await axios.post(`${window.location.origin}/myacc/login/forgotpassword`,{x})
    .then(async (res)=>{
      if(res.data.result=='success'){
        let q=prompt('Enter New password', 'password');
        await axios.post(`${window.location.origin}/myacc/login/setnewpassword`,{username:x,password:q});
        alert('password set successfull');
      }
    })


  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
   let token= localStorage.getItem('token');
    axios.post(`${window.location.origin}/myacc`, { username, password,token })
      .then((res) => {
        if (res.data.result === 'success') {
          localStorage.setItem("id", res.data.id);
          setLikedSongs((prev) => [...prev, ...res.data.likedsongs]);
          setLoggedin(false);
        } else {
          alert('User does not exist or password incorrect, please sign up.');
          setLoggedin(true);
        }
      });
  };

  return (
    <>
      {loggedin ? (
        <>
          <div className="login-container">
            <div className="login-box">
              <h2 className="login-heading">Login</h2>
              <form onSubmit={handleSubmit} className="login-form">
                <label className="login-label">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="login-input"
                  required
                />
                <label className="login-label">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="login-input"
                  required
                />
                <button  className="login-button" onClick={handlefp}>Forgot password?</button>
                <br></br>
                <button
                  type="submit"
                  className="login-button"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
          <div className="signup-link">
            <span>Not Logged in? </span><Link to='/myacc/signup'>SignUp</Link>
          </div>
        </>
      ) : (
        <>
          <div className="username-div">
            <p className="username-pdiv">Hi {username}</p>
          </div>
          <div className="liked-songs-header">
            <p className="liked-songs-title">Your Liked Songs</p>
            <Link to='/music'>
              <button className="add-button">
                Add more <i className="fa-solid fa-plus"></i>
              </button>
            </Link>
          </div>
          {likedSongs.map((song, index) => (
            <div key={index} className="song-container">
              <div className="song-box">
                <h3 className="song-title">{song}</h3>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  );
};

export default LoginForm;
