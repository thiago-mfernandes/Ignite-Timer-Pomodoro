import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// a biblioteca zod nao tem importacao default, entao importo tudo como zod
import * as zod from 'zod'

import {
  FormContainer,
  HomeContainer,
  CountdownContainer,
  Separator,
  StartCountdownButton,
  TaskInput,
  MinutesAmountInput,
} from './styles'
import { useState } from 'react'

// definicao de qual sera o formato de validacao
// qual formato dos dados que estou recebendo no meu formulario - parametro data - ??
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ter no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ter no máximo 60 minutos.'),
})

// interface NewCycleFormData {
//   task: string
//   minutesAmount: number
// }

// usar o type quando vou fazer referencia a outra variavel
// o zod percorre meu schema e verifica atraves de cada input seu tipo gerando uma interface
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  // indicar ao useForm() um objeto de configuracoes de resolver, indicando qual sera meu resolver
  const { register, handleSubmit, watch, reset, formState } =
    useForm<NewCycleFormData>({
      // indicar ao meu zodResolver qual sera meu schema de validacao
      resolver: zodResolver(newCycleFormValidationSchema),
      defaultValues: {
        task: '',
        minutesAmount: 0,
      },
    })

  // essa funcao vai receber os dados do handleSubmit
  function handleCreateNewCycle(data: any) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((oldCycles) => [...oldCycles, newCycle])
    setActiveCycleId(id)
    reset()
  }

  // procuro meu id no array de ciclos
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

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
  console.log(activeCycle)

  // observar meu input de task
  const task = watch('task')
  // variavel auxiliar para melhor leitura do codigo
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em:</label>
          <TaskInput
            type="text"
            id="task"
            placeholder="Dê um nome para o seu projeto"
            list="task-suggestions"
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante:</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            {...register('minutesAmount', { valueAsNumber: true })}
          />
          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        <StartCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
