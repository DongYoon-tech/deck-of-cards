import { React, useEffect, useRef, useState } from "react"
import axios from "axios";
import './App.css';

function App() {

  const deckId = `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
  const [newDeckId, setNewDeckId] = useState();
  const [imageUrl, setImageUrl] = useState()
  const [autoDraw, setAutoDraw] = useState(false)
  const timer = useRef()

  useEffect(() => {
    async function cards() {
      const res = await axios.get(`${deckId}`)
      const r = res.data.deck_id;
      setNewDeckId(r);
    }
    cards();
  }, [setNewDeckId])

  useEffect(() => {
    async function cardsData() {
      let id = await newDeckId
      const response = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)

      if (response.data.remaining === 0) {
        setAutoDraw(false);
        alert("Error: no cards remaining!");
      } else {

        setImageUrl(response.data.cards[0].image)
      }
    }

    if (autoDraw && !timer.current) {
      timer.current = setInterval(async () => {
        await cardsData();
      }, 1000);
    }

    return () => {
      clearInterval(timer.current);
      timer.current = null;
    };

  }, [setAutoDraw, newDeckId, autoDraw])



  const handleClick = () => {
    setAutoDraw(auto => !auto)
  }

  return (
    <div className="App">
      <button onClick={handleClick}>{autoDraw ? "Stop drawing" : "Start drawing"}</button>
      <div>
        <img src={imageUrl} ></img>
      </div>
    </div>
  );
}

export default App;
