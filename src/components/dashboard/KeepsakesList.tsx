// Melhoria 4: Paginação
import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Keepsake, useKeepsakes } from '@/hooks/useKeepsakes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Mail, Phone, Calendar } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

// Componente para exibir um card de keepsake
const KeepsakeCard = ({ keepsake, onEdit, onDelete }: { keepsake: Keepsake, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  const statusColors = {
    'pending': 'bg-yellow-100 text-yellow-800',
    'scheduled': 'bg-blue-100 text-blue-800',
    'delivered': 'bg-green-100 text-green-800',
    'failed': 'bg-red-100 text-red-800'
  };

  const statusText = {
    'pending': 'Pendente',
    'scheduled': 'Agendada',
    'delivered': 'Entregue',
    'failed': 'Falhou'
  };

  const typeText = {
    'digital': 'Digital',
    'physical': 'Física'
  };

  const formattedDate = keepsake.delivery_date ? 
    format(new Date(keepsake.delivery_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
    'Data não definida';

  return (
    <Card className="mb-4 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{keepsake.title}</CardTitle>
          <div className="flex space-x-2">
            <Badge variant="outline" className="capitalize">
              {typeText[keepsake.type]}
            </Badge>
            <Badge className={`${statusColors[keepsake.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
              {statusText[keepsake.status as keyof typeof statusText] || 'Desconhecido'}
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center mt-1">
          <Calendar className="h-4 w-4 mr-1" /> {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-700 line-clamp-2">
          {keepsake.content || 'Sem conteúdo'}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {keepsake.recipient_email && (
            <div className="flex items-center text-xs text-gray-500">
              <Mail className="h-3 w-3 mr-1" /> {keepsake.recipient_email}
            </div>
          )}
          {keepsake.recipient_phone && (
            <div className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-1" /> {keepsake.recipient_phone}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(keepsake.id)}>
          <Pencil className="h-4 w-4 mr-1" /> Editar
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" /> Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. Isso excluirá permanentemente sua cápsula do tempo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(keepsake.id)}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

// Componente de skeleton para carregamento
const KeepsakeCardSkeleton = () => (
  <Card className="mb-4 overflow-hidden">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <Skeleton className="h-6 w-48" />
        <div className="flex space-x-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-32 mt-2" />
    </CardHeader>
    <CardContent className="pb-2">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4" />
      <div className="mt-2 flex gap-2">
        <Skeleton className="h-3 w-32" />
      </div>
    </CardContent>
    <CardFooter className="pt-2 flex justify-end space-x-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </CardFooter>
  </Card>
);

// Componente principal da lista de keepsakes com paginação
export const KeepsakesList = () => {
  const { fetchKeepsakesPaginated, updateKeepsake, deleteKeepsake } = useKeepsakes();
  const [editingKeepsakeId, setEditingKeepsakeId] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery<Keepsake[], Error>({
    queryKey: ['keepsakes-paginated'],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchKeepsakesPaginated((pageParam as number) * ITEMS_PER_PAGE, ITEMS_PER_PAGE),
    getNextPageParam: (lastPage) =>
      lastPage.length === ITEMS_PER_PAGE ? (pageParam => (pageParam as number) + 1) : undefined
  });

  const handleEdit = (id: string) => {
    setEditingKeepsakeId(id);
    // Aqui você pode navegar para a página de edição ou abrir um modal
    console.log(`Editar keepsake ${id}`);
  };

  const handleDelete = async (id: string) => {
    await deleteKeepsake(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <KeepsakeCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.map(keepsake => (
            <KeepsakeCard 
              key={keepsake.id} 
              keepsake={keepsake} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ))}
      
      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            variant="outline"
            className="w-full sm:w-auto"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais cápsulas'}
          </Button>
        </div>
      )}
      
      {data?.pages[0]?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Você ainda não criou nenhuma cápsula do tempo.</p>
          <Button className="mt-4" variant="default">
            Criar minha primeira cápsula
          </Button>
        </div>
      )}
    </div>
  );
};