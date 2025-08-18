// Melhoria 4: Paginação e Status Atualizado
import { useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Keepsake, useKeepsakes, KeepsakeStatus } from '@/hooks/useKeepsakes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, Mail, Phone, Calendar, CheckCircle, Clock, AlertCircle, Send } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

const ITEMS_PER_PAGE = 10;

interface KeepsakesListProps {
  statusFilter?: KeepsakeStatus;
}

// Componente para exibir um card de keepsake
const KeepsakeCard = ({ keepsake, onEdit, onDelete }: { keepsake: Keepsake, onEdit: (id: string) => void, onDelete: (id: string) => void }) => {
  const statusColors = {
    'pending': 'bg-orange-100 text-orange-800 border-orange-200',
    'scheduled': 'bg-blue-100 text-blue-800 border-blue-200',
    'sent': 'bg-green-100 text-green-800 border-green-200',
    'delivered': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'failed': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusText = {
    'pending': 'Pendente',
    'scheduled': 'Agendada',
    'sent': 'Enviada',
    'delivered': 'Entregue',
    'failed': 'Falhou'
  };

  const statusIcons = {
    'pending': Clock,
    'scheduled': Calendar,
    'sent': Send,
    'delivered': CheckCircle,
    'failed': AlertCircle
  };

  const typeText = {
    'digital': 'Digital',
    'physical': 'Física'
  };

  const formattedDate = keepsake.delivery_date ? 
    format(new Date(keepsake.delivery_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 
    'Data não definida';

  const formattedSentDate = keepsake.sent_at ? 
    format(new Date(keepsake.sent_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR }) : 
    null;

  const isSent = keepsake.status === 'sent' || keepsake.status === 'delivered';
  const isPending = keepsake.status === 'pending';
  const isFailed = keepsake.status === 'failed';
  const StatusIcon = statusIcons[keepsake.status as keyof typeof statusIcons] || Calendar;

  return (
    <Card className="keepsake-card responsive-card mb-4 overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="keepsake-card-header pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <CardTitle className="responsive-subtitle flex items-center gap-2 flex-1">
            {keepsake.title}
            {isSent && <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />}
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize text-xs">
              {typeText[keepsake.type]}
            </Badge>
            <Badge className={`text-xs border ${statusColors[keepsake.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusText[keepsake.status as keyof typeof statusText] || 'Desconhecido'}
            </Badge>
          </div>
        </div>
        <CardDescription className="space-y-1 mt-1">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Entrega programada: {formattedDate}</span>
          </div>
          {formattedSentDate && isSent && (
            <div className="flex items-center text-sm text-green-600">
              <Send className="h-4 w-4 mr-1" />
              <span>Enviada em: {formattedSentDate}</span>
            </div>
          )}
          {isPending && (
            <div className="flex items-center text-sm text-orange-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Aguardando processamento</span>
            </div>
          )}
          {isFailed && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>Falha no envio - Será tentado novamente</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="keepsake-card-content pb-2">
        <p className="text-sm text-gray-700 line-clamp-2 mb-3">
          {keepsake.content || 'Sem conteúdo'}
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
          {keepsake.recipient_email && (
            <div className="flex items-center text-xs text-gray-500 break-all">
              <Mail className="h-3 w-3 mr-1 flex-shrink-0" /> 
              <span className="truncate">{keepsake.recipient_email}</span>
            </div>
          )}
          {keepsake.recipient_phone && (
            <div className="flex items-center text-xs text-gray-500">
              <Phone className="h-3 w-3 mr-1 flex-shrink-0" /> {keepsake.recipient_phone}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="keepsake-card-footer pt-2 flex flex-col sm:flex-row sm:justify-end gap-2">
        {!isSent && (
          <Button variant="outline" size="sm" className="responsive-button touch-target" onClick={() => onEdit(keepsake.id)}>
            <Pencil className="h-4 w-4 mr-1" /> Editar
          </Button>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="responsive-button touch-target">
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
export const KeepsakesList = ({ statusFilter }: KeepsakesListProps) => {
  const { fetchKeepsakesPaginated, updateKeepsake, deleteKeepsake } = useKeepsakes();
  const [editingKeepsakeId, setEditingKeepsakeId] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery<any, Error, any, any, number>({
    queryKey: ['keepsakes-paginated', statusFilter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      fetchKeepsakesPaginated((pageParam as number) * ITEMS_PER_PAGE, ITEMS_PER_PAGE, statusFilter),
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      (lastPage?.length === ITEMS_PER_PAGE ? ((lastPageParam ?? 0) as number) + 1 : undefined),
  });

  const handleEdit = (id: string) => {
    setEditingKeepsakeId(id);
    // Navegar para a página de edição
    navigate(`/edit-keepsake/${id}`);
  };

  const handleDelete = async (id: string) => {
    const success = await deleteKeepsake(id);
    if (success) {
      // Invalidar e refetch das queries para atualizar a lista
      queryClient.invalidateQueries({ queryKey: ['keepsakes-paginated'] });
    }
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

  const getEmptyMessage = () => {
    switch (statusFilter) {
      case 'pending':
        return 'Você não tem cápsulas pendentes.';
      case 'sent':
        return 'Você ainda não tem cápsulas enviadas.';
      case 'delivered':
        return 'Você ainda não tem cápsulas entregues.';
      default:
        return 'Você ainda não criou nenhuma cápsula do tempo.';
    }
  };

  return (
    <div className="space-y-4 mobile-spacing">
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex} className="space-y-4">
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
        <div className="flex justify-center mt-6">
          <Button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            variant="outline"
            className="responsive-button touch-target w-full sm:w-auto"
          >
            {isFetchingNextPage ? 'Carregando...' : 'Carregar mais cápsulas'}
          </Button>
        </div>
      )}
      
      {data?.pages[0]?.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">{getEmptyMessage()}</p>
          {!statusFilter && (
            <Button 
              className="mt-4" 
              variant="default"
              onClick={() => navigate('/create-keepsake')}
            >
              Criar minha primeira cápsula
            </Button>
          )}
        </div>
      )}
    </div>
  );
};