import { Image, Pencil, Search } from 'lucide-react'
import { useState } from 'react'

import { ProductProps } from '@/api/get-products'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

import { ProductDetails } from './product-details'
import { ProductForm } from './product-form'

export const ORDER_STATUS: Record<number, OrderStatus> = {
  0: 'pending',
  1: 'canceled',
  2: 'processing',
  3: 'delivering',
  4: 'delivered',
}
export const REVERT_ORDER_STATUS: Record<OrderStatus, number> = {
  pending: 0,
  canceled: 1,
  processing: 2,
  delivering: 3,
  delivered: 4,
}

interface ProductTableRowProps {
  product: ProductProps
}

export function ProductTableRow({ product }: ProductTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isCreationOpen, setIsCreationOpen] = useState(false)

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do produto</span>
            </Button>
          </DialogTrigger>
          <ProductDetails productId={product.id} opened={isDetailsOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="flex items-center justify-center">
        {product && product.image ? (
          <img
            src={product.image}
            width={50}
            height={50}
            alt="SiteTypeIcon"
            className="mx-auto content-evenly rounded-lg"
          />
        ) : (
          <Image className="h-5 w-5" />
        )}
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        ...{product.id.split('-')[product.id.split('-').length - 1]}
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell className="font-medium">{product.description}</TableCell>
      <TableCell className="font-medium">
        {(product.priceInCents / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        })}
      </TableCell>
      <TableCell />
      <TableCell className="font-medium">
        <Dialog open={isCreationOpen} onOpenChange={setIsCreationOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Pencil className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <ProductForm product={product} openCallback={setIsCreationOpen} />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
