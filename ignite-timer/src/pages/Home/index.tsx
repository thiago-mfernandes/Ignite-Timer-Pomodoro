import { HandPalm, Play } from 'phosphor-react'
import { differenceInSeconds } from 'date-fns'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useEffect, useState } from 'react'
import { NewCycleForm } from '../NewCycleForm'
import { Countdown } from '../Countdown'

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  // procuro meu id no array de ciclos
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
  

  

  // essa funcao vai receber os dados do handleSubmit
  function handleCreateNewCycle(data: any) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((oldCycles) => [...oldCycles, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    reset()
  }

  function handleInterruptCycle() {
    setCycles((oldState) =>
      oldState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

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
  console.log(activeCycle)

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  // observar meu input de task
  const task = watch('task')
  // variavel auxiliar para melhor leitura do codigo
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <NewCycleForm />
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
