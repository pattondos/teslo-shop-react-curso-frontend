import AdminTitle from "@/admin/components/AdminTitle"
import { CustomFullScreenLoading } from "@/components/custom/CustomFullScreenLoading"
import CustomPagination from "@/components/custom/CustomPagination"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { currencyFormatter } from "@/lib/currency-formatter"
import { useProducts } from "@/shop/hooks/useProducts"
import { PencilIcon, PlusIcon } from "lucide-react"
import { Link } from "react-router"

export const AdminProductsPage = () => {
  const { data, isLoading } = useProducts();

  if(isLoading) return <CustomFullScreenLoading/>

  return (
    <>
      <div className="flex justify-between items-center">
        <AdminTitle
          title="Productos"
          subtitle="Resumen de tus productos."
        />
        <div className="flex justify-end mb-10 gap-4">
          <Link to={'/admin/products/new'}>
            <Button>
              <PlusIcon />
              Nuevo Producto
            </Button>
          </Link>
        </div>
      </div>
      <Table className="bg-white p-10 shadow-xs border border-gray-200 mb-10">
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">ID</TableHead>
            <TableHead>Imagen</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>In Stock</TableHead>
            <TableHead>Tallas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data!.products.map( (producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium">{producto.id}</TableCell>
                <TableCell>
                  <img
                    src={producto.images[0]}
                    alt={producto.title}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>
                    <Link 
                      className="hover:text-blue-500 underline"
                      to={`/admin/products/${producto.id}`}
                    >
                      {producto.title}
                    </Link>
                  </TableCell>
                <TableCell>{currencyFormatter(producto.price)} </TableCell>
                <TableCell>{producto.gender}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.sizes.join(', ')}</TableCell>
                <TableCell className="text-right">
                  <Link to={`/admin/products/${producto.id}`}> 
                    <PencilIcon className="w-4 h-4 text-orange-500"/>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <CustomPagination totalPages={data?.pages || 0} />
    </>
  )
}

export default AdminProductsPage
