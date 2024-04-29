import { Search } from 'lucide-react'
import { useState } from 'react'

import { ProductProps } from '@/api/get-products'
import { OrderStatus } from '@/components/order-status'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'

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

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>
          {/* <OrderDetails orderId={order.orderId} opened={isDetailsOpen} /> */}
        </Dialog>
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
    </TableRow>
  )
}