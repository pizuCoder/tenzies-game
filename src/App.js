import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    const [highScore, setHighScore] = React.useState(null)
    
    


    


    

    const updateHighScore = React.useCallback(() => {
      const currentRollCount = Number(localStorage.getItem("highScore")) || 0;
      const newRollCount = rolls + 1;
      if (newRollCount < currentRollCount || currentRollCount === 0) {
        localStorage.setItem("highScore", newRollCount);
        setHighScore(newRollCount);
      }
    }, [rolls, setHighScore]);

    
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
            updateHighScore()
            
        }
    }, [ dice, updateHighScore])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }

    // function updateHighScore() {
    //     const newRolls = rolls + 1
    //     setRolls(newRolls)
    //     const prevHighScore = localStorage.getItem("highScore")
    //     if (prevHighScore === null || newRolls < prevHighScore) {
    //         localStorage.setItem("highScore", newRolls)
    //         setHighScore(newRolls)
    //     }
    // }
    
    function rollDice() {
        if(!tenzies) {
            setRolls(rolls + 1)
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    

    React.useEffect(() => {
        const prevHighScore = localStorage.getItem("highScore")
        if (prevHighScore !== null) {
            setHighScore(parseInt(prevHighScore))
        }
        
    }, [])

    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))

    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
           
            <p className="instructions" style={{whiteSpace: 'pre-wrap'}}>
              { tenzies ? 'Congratuations! You Won! \nStart a new game to beat the best score!'
              :'Roll until all dice are the same.\n Click each die to freeze it at its current value between rolls.\nThe best score is the lowest number of rolls taken to win'}
            </p>
            
            <div className="dice-container">
                {diceElements}
            </div>
            <h3>Best Score: {highScore-1}</h3>
            <h3>Roll Count: {rolls}</h3>
            
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}