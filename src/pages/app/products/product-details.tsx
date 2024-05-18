import { useQuery } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { getProductDetails } from '@/api/get-product-details'
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export interface OrderDetailsProps {
  productId: string
  opened: boolean
}

export function ProductDetails({ productId, opened }: OrderDetailsProps) {
  const { data: product } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductDetails({ productId }),
    enabled: opened,
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Produto: {product?.id}</DialogTitle>
        <DialogDescription>Detalhes do produto</DialogDescription>
      </DialogHeader>

      {product ? (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Nome</TableCell>
                <TableCell className="flex justify-end">
                  {product.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">
                  Descrição
                </TableCell>
                <TableCell className="flex justify-end">
                  {product.description}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Preço</TableCell>
                <TableCell className="flex justify-end">
                  <TableCell className="font-medium">
                    {(product.priceInCents / 100).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </TableCell>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-muted-foreground">Criado</TableCell>
                <TableCell className="flex justify-end">
                  {formatDistanceToNow(product.created_at, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <p>Product skeleton</p>
      )}
    </DialogContent>
  )
}
