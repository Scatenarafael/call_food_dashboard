
import { createRestaurant } from '@/api/create-restaurant'
import { RestaurantProfileProps } from '@/api/get-profile'
import { ProfileContext } from '@/contexts/profile-context'
import { queryClient } from "@/lib/react-query"
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from "sonner"
import { z } from 'zod'
import { ErrorForm } from './error-form'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { Button } from './ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Skeleton } from './ui/skeleton'
import { Textarea } from './ui/textarea'

const restaurantSaveSchema = z.object({
  manager: z.string().uuid(),
  name: z.string().min(1, "O nome deve conter pelo menos 1 caracter"),
  description: z.string().min(1, "A descrição deve conter pelo menos 1 caracter")
})

export type RestaurantSaveSchema = z.infer<typeof restaurantSaveSchema>

export function StoreProfileDialog() {
  const {profile, isLoadingProfile, activeRestaurant, setActiveRestaurant} = useContext(ProfileContext)

  const {
    register,
    handleSubmit,
    reset,
    formState: {isLoading: isLoadingSaveRestaurant, isSubmitting: isSubmittingSaveRestaurant, errors}
  } = useForm<RestaurantSaveSchema>({
    resolver: zodResolver(restaurantSaveSchema),
    values: {
      manager: profile?.id || '',
      name: '',
      description: ''
    }
  })

  console.log(errors.name)
  const mutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => { 
      toast.success("Restaurant criado com sucesso!")
      reset() 
      queryClient.refetchQueries({queryKey: ['profile']}) 
    },
    onError: () => { toast.error("Não foi possível criar restaurante") }
  })


  function createRestaurantFn(data: RestaurantSaveSchema) {
    mutation.mutate({ data })
  }

  function insertRestaurantInLocalStorage(restaurant: RestaurantProfileProps) {
    localStorage.setItem("activeRestaurant", JSON.stringify(restaurant))
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className='my-2 pe-3'>
          {
            isLoadingProfile ? (<Skeleton className='h-8 w-full' />) : (
              <p>Olá {profile?.username}, administre suas lojas</p>
            )
          }
          
        </DialogTitle>
        <DialogDescription className='pe-3'>
          {
            isLoadingProfile ? (<Skeleton className='h-16 w-full' />) : (
              <p>Caso não há nenhuma ainda... crie, edite e escolha com qual loja você quer trabalhar</p>
            )
          }
        </DialogDescription>
      </DialogHeader>
      {
        profile && profile.restaurants.length > 0 &&
            <Accordion type='single' collapsible>
              <AccordionItem value='restaurant-1'>
                <AccordionTrigger>
                  Restaurants
                </AccordionTrigger>
                  <AccordionContent className='max-h-[5rem] overflow-y-scroll no-scrollbar'>
                    {
                      profile &&
                        <RadioGroup 
                          className='space-y-2' 
                          defaultValue={activeRestaurant?.id} 
                          onValueChange={(value) => {
                            const restaurant = profile.restaurants.find((restaurant) => {return restaurant.id === value})
                            if (restaurant) {
                              setActiveRestaurant(restaurant)
                              insertRestaurantInLocalStorage(restaurant)
                            }
                          }}>
                          {
                            profile.restaurants.map(
                              (restaurant) => { 
                                return (
                                    <div key={restaurant.id} className='flex items-center gap-4'>
                                      <RadioGroupItem value={restaurant.id} />
                                      <Label>{restaurant.name}</Label>
                                    </div>
                                  ) })
                          }
                        </RadioGroup>
                    }
                  </AccordionContent>
              </AccordionItem>
            </Accordion>
      }
      <p className="font-bold">Crie um restaurante:</p>
      <form onSubmit={handleSubmit(createRestaurantFn)} className="flex flex-col items-center w-full gap-4">
        <div className="flex flex-col w-full gap-4">
          <Label>Nome:</Label>
          <Input {...register("name")} />
          <ErrorForm error={errors.name || null} />
        </div>
        <div className="flex flex-col w-full gap-4">
          <Label>Descrição:</Label>
          <Textarea className='min-h-[5rem] w-full' {...register("description")} />
          <ErrorForm error={errors.description || null} />
        </div>
        <Button
          disabled={isLoadingSaveRestaurant || isSubmittingSaveRestaurant} 
          className='text-xs w-full disabled:cursor-not-allowed flex gap-2'>
            Salvar
            {(isLoadingSaveRestaurant || isSubmittingSaveRestaurant) && <LoaderCircle className="animate-spin" />}
        </Button>
      </form>
    </DialogContent>
  )
}
