import styled from 'styled-components'

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${(props) => props.theme['gray-100']};
  font-size: 1.125rem;
  font-family: bold;
  flex-wrap: wrap;
`

const BaseInput = styled.input`
  background-color: transparent;
  height: 2.5rem;
  border: none;
  border-bottom: ${(props) => props.theme['gray-500']};
  font-weight: bold;
  font-size: 1.125rem;
  padding: 0 0.5rem;
  color: ${(props) => props.theme['gray-100']};

  &:focus {
    box-shadow: none;
    border-color: ${(props) => props.theme['green-500']};
  }

  &::placeholder {
    color: ${(props) => props.theme['gray-100']};
  }
`

export const TaskInput = styled(BaseInput)`
  //flex grow? y/n? y=1/n=0; flex-shrink, flex-basis(tamanho ideal)
  //em resumo, ocupar o espaço disponivel
  flex: 1;

  &::-webkit-calendar-picker-indicator {
    display: none !important;
  }
`

export const MinutesAmountInput = styled(BaseInput)`
  width: 4rem;
`
