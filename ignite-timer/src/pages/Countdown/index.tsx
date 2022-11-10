import { CountdownContainer, Separator } from './styles'
import { useContext, useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../Home'

export function Countdown() {

  const { activeCycle, activeCycleId } = useContext(CyclesContext)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  // obtenho o total de segundos
  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

  // subtraio o total de segundos - os segundos que ja passaram
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  // obtenho: quantos minutos eu tenho do total de segundos restantes e arredondo pra baixo (ex: 1499 segundos = 24,93 sendo que ainda tenho 24 minutos)
  const minutesAmount = Math.floor(currentSeconds / 60)
  // obtenho: quantos segundos tenho sobrando que nao cabem em um minuto, ou seja, os segundos restantes
  const secondsAmount = currentSeconds % 60
  // toda string precisa ter dois parametros, e nao tendo, preencho com zero
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  // console.log(formState.errors)
  // console.log(activeCycle)

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )
        if (secondsDifference >= totalSeconds) {
          setCycles((oldState) =>
            oldState.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            }),
          )

          setAmountSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setAmountSecondsPassed(secondsDifference)
        }
      }, 1000)
    }

    // funcao para deletar o ciclo, para o timer, e comecar outro timer
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle, totalSeconds, activeCycleId])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
