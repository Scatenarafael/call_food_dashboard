import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  // const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isLoading },
  } = useForm<SignInForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
    onError: ({ name, message }) => {
      console.log('onError >>> name >>>', name)
      console.log('onError >>> message >>>', message)
    },
    onSuccess: ({ data }) => {
      console.log('onSuccess >> data >> ', data)
      navigate('/', { replace: true })
    },
  })

  async function handleSignIn(data: SignInForm) {
    console.log(data)
    try {
      await authenticate(data)
      // toast.success('Enviamos um link de autenticação para seu e-mail')
    } catch {
      // toast.error('Credenciais inválidas')
    }
  }

  return (
    <>
      {/* <Helmet title="Login" /> */}
      <div className="p-8">
        <Button variant="ghost" asChild className="absolute right-8 top-8">
          <Link to="/sign-up">Novo Parceiro!</Link>
        </Button>

        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">SignIn</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe suas vendas pelo painel do parceiro!
            </p>
          </div>
          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Seu nome de usuário</Label>
              <Input id="email" type="email" {...register('email')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" {...register('password')} />
            </div>

            <Button className="w-full" disabled={isSubmitting || isLoading}>
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
