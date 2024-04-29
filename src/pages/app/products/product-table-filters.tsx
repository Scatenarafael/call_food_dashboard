import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const productFilterSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
})

type ProductFilterSchema = z.infer<typeof productFilterSchema>

export function ProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const description = searchParams.get('description')

  const { register, handleSubmit, reset } = useForm<ProductFilterSchema>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      name: name ?? '',
      id: id ?? '',
      description: description ?? '',
    },
  })

  function handleFilter({ name, id, description }: ProductFilterSchema) {
    setSearchParams((state) => {
      if (id) {
        state.set('id', id)
      } else {
        state.delete('id')
      }

      if (name) {
        state.set('name', name)
      } else {
        state.delete('name')
      }

      if (description) {
        state.set('description', description)
      } else {
        state.delete('description')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams((state) => {
      state.delete('id')
      state.delete('name')
      state.delete('description')

      state.set('page', '1')

      return state
    })
    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros: </span>
      <Input
        placeholder="ID do produto"
        className="h-8 w-auto"
        {...register('id')}
      />
      <Input
        placeholder="Nome do produto"
        className="h-8 w-[320px]"
        {...register('name')}
      />
      <Input
        placeholder="Description"
        className="h-8 w-[320px]"
        {...register('description')}
      />
      {/* <Controller
        name="description"
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="processing">Em preparo</SelectItem>
                <SelectItem value="delivering">Em entrega</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      /> */}

      <Button type="submit" variant="secondary">
        <Search className="mr-2 h-4 w-4" /> Filtrar resultados
      </Button>

      <Button onClick={handleClearFilters} type="button" variant="outline">
        <X className="mr-2 h-4 w-4" /> Remover Filtros
      </Button>
    </form>
  )
}
