import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { RemoveProduct } from '@/api/remove-product'
import { queryClient } from '@/lib/react-query'

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'

interface RemoveProductDialogContentProps {
  id: string
}

export function RemoveProductDialogContent({
  id,
}: RemoveProductDialogContentProps) {
  const mutation = useMutation({
    mutationFn: RemoveProduct,
    onSuccess: () => {
      toast.success('Produto removido com sucesso!')
      queryClient.refetchQueries({ queryKey: ['products'] })
    },
    onError: () => {
      toast.error('Produto não pôde ser removido!')
    },
  })

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Remover produto</AlertDialogTitle>
        <AlertDialogDescription>
          Tem certeza que deseja remover o produto?
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => {
            mutation.mutate({ id })
          }}
        >
          Remover
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
