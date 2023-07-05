'use client'
import styles from '../styles/page.module.css'
import { useState, useEffect } from 'react'
import boardColumnsLetters from '../utils/boardColumnsLetters'
export default function Home() {
  const [board, setBoard] = useState(
    Array(10)
      .fill()
      .map(() => Array(10).fill())
  )
  const [counter, setCounter] = useState(50)
  const [ships] = useState(placeShips())
  const [shipsPiecesInGame, setShipsPiecesInGame] = useState(ships)

  function placeShips() {
    var shipHead = [
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ]
    const shipDirection = Math.random() < 0.5 ? 'V' : 'H'
    let shipBody
    if (shipDirection === 'V') {
      if (shipHead[1] === 0) {
        shipBody = [shipHead[0], shipHead[1] + 1]
      } else if (shipHead[1] === 9) {
        shipBody = [shipHead[0], shipHead[1] - 1]
      } else {
        shipBody = [
          shipHead[0],
          Math.random() < 0.5 ? shipHead[1] - 1 : shipHead[1] + 1,
        ]
      }
    } else {
      if (shipHead[0] === 0) {
        shipBody = [shipHead[0] + 1, shipHead[1]]
      } else if (shipHead[0] === 9) {
        shipBody = [shipHead[0] - 1, shipHead[1]]
      } else {
        shipBody = [
          Math.random() < 0.5 ? shipHead[0] - 1 : shipHead[0] + 1,
          shipHead[1],
        ]
      }
    }

    return [shipHead, shipBody]
  }

  const checkWaters = (column, row) => {
    var copyBoard = board

    if (copyBoard[column][row] !== undefined) return

    if (ships.some(ship => ship[0] === column && ship[1] === row)) {
      var copyShipsPiecesInGame = shipsPiecesInGame.filter(
        piece => piece[0] !== column || piece[1] !== row
      )
      copyBoard[column][row] = true
      setShipsPiecesInGame(copyShipsPiecesInGame)
    } else {
      copyBoard[column][row] = false
    }

    setBoard(copyBoard)
    setCounter(counter => counter - 1)
  }

  useEffect(() => {
    if (counter === 0) {
      confirm('You ran out of cannon balls, try again ')
      window.location.reload()
    }
    if (shipsPiecesInGame.length === 0) {
      confirm('You Won')
      window.location.reload()
    }

    return () => {}
  }, [counter, shipsPiecesInGame])

  return (
    <div className={styles.wrapper}>
      <h1>Battleship </h1>
      <h5>You have {counter} cannon balls left</h5>
      <div className={styles.boardDiv}>
        {board.map((col, colIndex) => {
          return (
            <div style={{ textAlign: 'center' }} key={colIndex}>
              <p>{boardColumnsLetters[colIndex]}</p>
              {col.map((row, rowIndex) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {colIndex === 0 ? (
                    <span style={{ flex: 1 }}>{rowIndex + 1}</span>
                  ) : null}
                  <div
                    onClick={() => checkWaters(colIndex, rowIndex)}
                    key={rowIndex}
                    className={`${styles.tile} ${
                      row === undefined
                        ? null
                        : row === true
                        ? styles.ship
                        : styles.water
                    }`}></div>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
