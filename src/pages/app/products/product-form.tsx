import { zodResolver } from '@hookform/resolvers/zod'
import { InputNumberFormat } from '@react-input/number-format'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Image } from 'lucide-react'
import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { createProduct } from '@/api/create-product'
import { ProductProps } from '@/api/get-products'
import { getProfile } from '@/api/get-profile'
import { updateProduct } from '@/api/update-product'
import { InputError } from '@/components/input-error'
import { Button } from '@/components/ui/button'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'

const productSaveSchema = z.object({
  restaurant: z.string(),
  name: z.string().refine(
    (name: string) => {
      return name !== ''
    },
    {
      message: 'Nome não pode ser vazio',
    },
  ),
  description: z.string().refine(
    (description: string) => {
      return description !== ''
    },
    {
      message: 'Descrição não pode ser vazia',
    },
  ),
  priceInCents: z.number().nonnegative(),
  image: z.any().optional(),
})

export type ProductSaveSchema = z.infer<typeof productSaveSchema>

interface ProductFormProps {
  openCallback: (value: boolean) => void
  product?: ProductProps
}

export function ProductForm({ openCallback, product }: ProductFormProps) {
  const [price, setPrice] = useState(
    product && product.priceInCents
      ? `R$${(product.priceInCents / 100).toFixed(2)}`
      : '',
  )
  const [imageURL, setImageURL] = useState<string | null>(null)

  const { toast } = useToast()

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  console.log('price >>> ', price)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductSaveSchema>({
    resolver: zodResolver(productSaveSchema),
    values: {
      description: product?.description || '',
      name: product?.name || '',
      priceInCents: product?.priceInCents || 0,
      restaurant: product?.restaurant || profile?.restaurants[0].id || '',
      image: product?.image || null,
    },
  })

  const mutation = useMutation({
    mutationFn: async (data: ProductSaveSchema) => {
      if (!product) {
        createProduct({ data })
      } else {
        updateProduct({ productId: product.id, data })
      }
    },
    onError: () => {
      toast({
        title: `Could not save product!`,
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      toast({
        title: `Product successfully saved!`,
        variant: 'success',
      })
      reset()
      setPrice('')
      queryClient.refetchQueries({ queryKey: ['products'] })
      openCallback(false)
    },
  })

  function createProductFn(data: ProductSaveSchema) {
    const formData = new FormData()

    data.priceInCents = Math.round(Number(price.split('$')[1]) * 100)

    formData.append('name', data.name)
    formData.append('priceInCents', data.priceInCents)
    formData.append('restaurant', data.restaurant)
    formData.append('description', data.description)
    formData.append('image', data.image)

    mutation.mutateAsync(data)
  }

  function handleChooseIcon(e: ChangeEvent<HTMLInputElement>) {
    const files = (e.target as HTMLInputElement).files
    if (files && files[0]) setImageURL(URL.createObjectURL(files[0]))
    if (files && files[0]) setValue('image', files[0])
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto:</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <form onSubmit={handleSubmit(createProductFn)}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Image</TableCell>
                <TableCell className="flex items-center justify-end text-muted-foreground">
                  <label htmlFor="iconImage">
                    {!imageURL ? (
                      // eslint-disable-next-line jsx-a11y/alt-text
                      <Image className="h-5 w-5" />
                    ) : (
                      <img
                        src={imageURL}
                        width={100}
                        height={100}
                        alt="SiteTypeIcon"
                        className="mx-auto content-evenly"
                      />
                    )}
                  </label>
                  <input
                    id="iconImage"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleChooseIcon}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Restaurante
                </TableCell>
                <TableCell className="flex justify-end">
                  {profile?.restaurants[0].name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  <Label htmlFor="name">Nome</Label>
                </TableCell>
                <TableCell className="flex flex-col justify-end">
                  <Input id="name" {...register('name')} />
                  {errors.name && <InputError error={errors.name} />}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  <Label htmlFor="description">Description</Label>
                </TableCell>
                <TableCell className="flex flex-col justify-end">
                  <Input id="description" {...register('description')} />
                  {errors.description && (
                    <InputError error={errors.description} />
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  <Label htmlFor="priceInCents">Preço</Label>
                </TableCell>
                <TableCell className="flex flex-col justify-end">
                  <InputNumberFormat
                    // locales="pt-PT"
                    format="currency"
                    currency="BRL"
                    maximumFractionDigits={2}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)} // "123 456,789 km/h"
                  />
                  {/* <Input
                    id="priceInCents"
                    type="number"
                    step={0.01}
                    {...register('priceInCents', { valueAsNumber: true })}
                  /> */}
                  {errors.priceInCents && (
                    <InputError error={errors.priceInCents} />
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex w-full justify-end">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
