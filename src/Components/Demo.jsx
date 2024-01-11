import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Data = () => {
  let api = "https://sheet.best/api/sheets/faea516c-2d45-4587-9c73-eeea9dd5e13f";
  const [data, setdata] = useState({
    Name: '',
    action: '',
  });

  const [show, setshow] = useState([]);
  const [yesCount, setYesCount] = useState(0);
  const [noCount, setNoCount] = useState(0);
  const [question, setQuestion] = useState('');

  const getvalue = (action) => {
    setdata({ ...data, action });
  };

  const senddata = () => {

    const user = show.some((item) => item.Name === data.Name);

    if (!user) {
      fetch(api, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((r) => r.json())
        .then((data) => {
          console.log(data);
          if (data.action === 'yes') {
            setYesCount((prevCount) => prevCount + 1);
          } else if (data.action === 'no') {
            setNoCount((prevCount) => prevCount + 1);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert("You have already submitted a response.");
    }
  };

  const getdata = () => {
    axios.get(api).then((res) => {
      setshow(res.data);
      const yesCount = res.data.filter((item) => item.action === 'yes').length;
      const noCount = res.data.filter((item) => item.action === 'no').length;

      setYesCount(yesCount);
      setNoCount(noCount);
    });
  };

  const getQuestion = () => {
    axios.get(api + '?_sq=question').then((res) => {
      const question = res.data[0]?.question;
      setQuestion(question || 'Default Question');
    });
  };


  useEffect(() => {
    getdata();
    getQuestion();
  }, []);

  return (
    <>
      <div className="container">
        <div className="main">
          <div className="dropdown-container w-100">
            <select id="dropdown" className="btn w-100 bg-white" name="Name" onChange={(e) => setdata({ ...data, Name: e.target.value })}>
              <option value="N/A">N/A</option>
              <option value="jeel">jeel</option>
              <option value="raj">raj</option>
              <option value="meet">meet</option>
              <option value="divyesh">divyesh</option>
              <option value="jay">jay</option>
              <option value="ayush">ayush</option>
              <option value="ayush1">ayush1</option>
            </select>
          </div>
          <div className="card-container">
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{question}</h5>
                <button className="btn btn-outline-success w-50" onClick={() => getvalue('yes')}>
                  Yes
                </button>
                <button className="btn btn-outline-danger w-50" onClick={() => getvalue('no')}>
                  No
                </button>
                <br />
                <button className="btn btn-outline-primary w-100 my-2" onClick={senddata}>
                  Send data
                </button>
              </div>
            </div>
          </div>

          <div>
            <p>Yes count: {yesCount}</p>
            <div className="progress">
              <div className="progress-bar bg-success" role="progressbar" style={{ width: `${(yesCount / (yesCount + noCount)) * 100}%` }} aria-valuenow={yesCount} aria-valuemin="0" aria-valuemax={yesCount + noCount}></div>
            </div>
            <p>No count: {noCount}</p>
            <div className="progress">
              <div className="progress-bar bg-danger" role="progressbar" style={{ width: `${(noCount / (yesCount + noCount)) * 100}%` }} aria-valuenow={noCount} aria-valuemin="0" aria-valuemax={yesCount + noCount}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Data;
