/*global chrome*/
import './App.css';
import React from 'react';
import logo from './logo.svg';
import {Fragment, useEffect, useState} from 'react';

function App() {
  const [site, setSite] = useState("");
  const [breach, setBreach] = useState([]);
  
  // function to set the current tab's website to site
  const getCurrentTab = async () => {
    try {
      let queryOptions = {active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      var url = new URL(tab.url)
      var domain = url.hostname
      if (domain.startsWith('www')) {
        domain = domain.substring(4, domain.length); 
      }
      setSite(domain);
      return domain;
    } catch(err) {
      console.log(err.message);
    }
  }

  const baseURL = "https://haveibeenpwned.com/api/v3/breaches/?domain=";

  // function to find if the website found in a data breach
  // in Have I Been Pwned database.
  const findBreach = async () => {
    let domainName = await getCurrentTab();
    const url = baseURL + domainName; 
    try {
        const response = await fetch(url); 
        const jsonData = await response.json();
        setBreach(jsonData);
    } catch(err) {
        console.log(err.message);
    }
  }

  useEffect(() => {
    findBreach();
  }, []);

  return (
    <Fragment>
      <div className="App">
        <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <h2>Pwned Notifier</h2>
        </div>
        <h2>{breach.length > 0 && `${site} was found in a data breach. :( `}</h2>
        <h2>{breach.length === 0 && `${site} was NOT found in a data breach. :) `}</h2>
      </div>
    </Fragment>
  );
}

export default App;
