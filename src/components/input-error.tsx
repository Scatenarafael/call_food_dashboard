import { FieldError } from 'react-hook-form'

interface InputErrorProps {
  error: FieldError | undefined
}

export function InputError({ error }: InputErrorProps) {
  return <p className="p-1 text-rose-600">{error?.message}</p>
}
