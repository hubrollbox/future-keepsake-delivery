import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CreateBlogPost from '@/pages/CreateBlogPost';
import { supabase } from '@/integrations/supabase/client';

const BlogAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState<any[]>([]);
  const params = new URLSearchParams(location.search);
  const showNew = params.get('new') === '1';
  const editId = params.get('edit');

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      setPosts((data || []) as any[]);
    };
    fetchAll();
  }, []);

  return (
    <AdminLayout activeSection="blog">
      {showNew || editId ? (
        <CreateBlogPost editId={editId ?? null} onSaved={() => {
          // refresh list after save
          (async () => {
            const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            setPosts((data || []) as any[]);
          })();
        }} />
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Blog (Admin)</h1>
            <div>
              <Button variant="brand" onClick={() => navigate('/admin/blog?new=1')}>Criar novo</Button>
            </div>
          </div>

          <div className="space-y-3">
            {posts.map((p) => (
              <div key={p.id} className="p-3 bg-white rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-medium">{p.title}</h2>
                    <p className="text-sm text-keepla-gray-light">{p.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => navigate(`/admin/blog?edit=${p.id}`)}>Editar</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BlogAdmin;
