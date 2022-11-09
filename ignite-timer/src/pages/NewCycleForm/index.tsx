import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// a biblioteca zod nao tem importacao default, entao importo tudo como zod
import * as zod from 'zod'

export function NewCycleForm() {
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

  // indicar ao useForm() um objeto de configuracoes de resolver, indicando qual sera meu resolver
  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
    // indicar ao meu zodResolver qual sera meu schema de validacao
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em:</label>
      <TaskInput
        type="text"
        id="task"
        placeholder="Dê um nome para o seu projeto"
        list="task-suggestions"
        disabled={!!activeCycle} // duas exclamacoes transofrma pra boolean
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
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}
      />
      <span>minutos.</span>
    </FormContainer>
  )
}
