import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// const signUpForm = z.object({
//   restaurantName: z.string(),
//   managerName: z.string(),
//   phone: z.string(),
//   email: z.string().email(),
// })

// type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  // const navigate = useNavigate()

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { isSubmitting },
  // } = useForm<SignUpForm>()

  // const { mutateAsync: registerRestaurantFn } = useMutation({
  //   mutationFn: registerRestaurant,
  // })

  // async function handleSignUp(data: SignUpForm) {
  //   console.log(data)
  //   try {
  //     await registerRestaurantFn({
  //       email: data.email,
  //       managerName: data.managerName,
  //       phone: data.phone,
  //       restaurantName: data.restaurantName,
  //     })

  //     toast.success('Restaurante cadastrado com sucesso!', {
  //       action: {
  //         label: 'Login',
  //         onClick: () => navigate(`/sign-in?email=${data.email}`),
  //       },
  //     })
  //   } catch {
  //     toast.error('Erro ao cadastrar restaurante.')
  //   }
  // }

  return (
    <>
      {/* <Helmet title="Cadastro" /> */}
      <div className="p-8">
        <Button variant="ghost" asChild className="absolute right-8 top-8">
          <Link to="/sign-in">Login</Link>
        </Button>
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-sm text-muted-foreground">
              Seja um parceiro e começe suas vendas!
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Estabelecimento</Label>
              <Input
                placeholder="Nome"
                id="restaurantName"
                type="text"
                // {...register('restaurantName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="managerName">Responsável</Label>
              <Input
                placeholder="Nome"
                id="managerName"
                type="text"
                // {...register('managerName')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input
                placeholder="E-mail"
                id="email"
                type="email"
                // {...register('email')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contato</Label>
              <Input
                placeholder="Celular"
                id="phone"
                type="tel"
                // {...register('phone')}
              />
            </div>

            <Button type="submit" className="w-full">
              Finalizar cadastro
            </Button>

            <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
              Ao continuar, você concorda com nossos{' '}
              <a className="underline underline-offset-4" href="">
                termos de serviço
              </a>{' '}
              e{' '}
              <a className="underline underline-offset-4" href="">
                políticas de privacidade
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
