import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import { z } from 'zod'

import { getProducts } from '@/api/get-products'
import { Pagination } from '@/components/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { ProductForm } from './product-form'
import { ProductTableFilters } from './product-table-filters'
import { ProductTableRow } from './product-table-row'

export function Products() {
  const [isCreationOpen, setIsCreationOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  const id = searchParams.get('id')
  const name = searchParams.get('name')
  const description = searchParams.get('description')

  const { data: result, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => {
      return getProducts({
        pageIndex,
        id,
        name,
        description,
      })
    },
  })

  console.log('product >>> result >>> ', result)

  console.log('isLoadingProducts >>> ', isLoadingProducts)

  function handlePaginate(pageIndex: number) {
    setSearchParams((state) => {
      state.set('page', (pageIndex + 1).toString())
      return state
    })
  }
  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        <div className="space-y-2.5">
          <div className="flex justify-between">
            <ProductTableFilters />
            <Dialog open={isCreationOpen} onOpenChange={setIsCreationOpen}>
              <DialogTrigger asChild>
                <Button className="font-bold" size="lg">
                  Criar
                </Button>
              </DialogTrigger>
              <ProductForm openCallback={setIsCreationOpen} />
            </Dialog>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[64px]"></TableHead>
                  <TableHead className="w-[180px]">Identificador</TableHead>
                  <TableHead className="w-[180px]">Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[140px]">Preço</TableHead>
                  <TableHead></TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* {isLoadingOrders && <OrderTableSkeleton />} */}
                {result &&
                  result.results &&
                  result.results.length > 0 &&
                  result.results.map((product) => {
                    return (
                      <ProductTableRow key={product.id} product={product} />
                    )
                  })}
                {/* {Array.from({ length: 10 }).map((_, i) => {
                  return <OrderTableRow key={i} />
                })} */}
              </TableBody>
            </Table>
          </div>
          {result && result.meta && (
            <Pagination
              onPageChange={handlePaginate}
              pageIndex={result.meta.pageIndex || 0}
              totalCount={result.meta.totalCount || 100}
              perPage={result.meta.perPage || 15}
            />
          )}
        </div>
      </div>
    </>
  )
}
