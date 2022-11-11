import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { useContext } from 'react'
import { NewCycleForm } from '../NewCycleForm'
import { Countdown } from '../Countdown'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// a biblioteca zod nao tem importacao default, entao importo tudo como zod
import * as zod from 'zod'
import { CyclesContext } from '../../contexts/CyclesContext'

// definicao de qual sera o formato de validacao
// qual formato dos dados que estou recebendo no meu formulario - parametro data - ??
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'O ciclo precisa ter no mínimo 5 minutos.')
    .max(60, 'O ciclo precisa ter no máximo 60 minutos.'),
})

// usar o type quando vou fazer referencia a outra variavel
// o zod percorre meu schema e verifica atraves de cada input seu tipo gerando uma interface
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCycle } =
    useContext(CyclesContext)

  // indicar ao useForm() um objeto de configuracoes de resolver, indicando qual sera meu resolver
  // aqui eu tenho na variavel newCycleForm uma instancia com todas as funcionalidaes que vou usar, o register que sera passado via props e o FormProvider que sera o contexto nativo
  const newCycleForm = useForm<NewCycleFormData>({
    // indicar ao meu zodResolver qual sera meu schema de validacao
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  // observar meu input de task
  const task = watch('task')
  // variavel auxiliar para melhor leitura do codigo
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form action="" onSubmit={handleSubmit(handleCreateNewCycle)}>
        {/** FormProvider é um contexto do react hook forms, onde eu posso passar props */}
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCycle} type="button">
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
