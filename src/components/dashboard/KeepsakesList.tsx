// Melhoria 4: Paginação
import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

const ITEMS_PER_PAGE = 10;

export const KeepsakesList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['keepsakes'],
    queryFn: ({ pageParam = 0 }) => 
      fetchKeepsakes(pageParam * ITEMS_PER_PAGE, ITEMS_PER_PAGE),
    getNextPageParam: (lastPage, pages) => 
      lastPage.length === ITEMS_PER_PAGE ? pages.length : undefined
  });

  return (
    <div>
      {data?.pages.map(page => 
        page.map(keepsake => (
          <KeepsakeCard key={keepsake.id} keepsake={keepsake} />
        ))
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
        </button>
      )}
    </div>
  );
};