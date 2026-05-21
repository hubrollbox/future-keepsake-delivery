
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload digital_files" ON storage.objects;
DROP POLICY IF EXISTS "digital_files_user_upload" ON storage.objects;
DROP POLICY IF EXISTS "blog_covers_authenticated_insert" ON storage.objects;
