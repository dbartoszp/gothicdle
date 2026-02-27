import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getLatestScreenshots = async (limit = 3) => {
  const supabase = createClientComponentClient();

  // 1️⃣ Pobieramy listę wszystkich plików w bucket
  const { data: files, error } = await supabase.storage
    .from('screenshots')
    .list('', {
      sortBy: { column: 'created_at', order: 'desc' }, // najnowsze na górze
    });

  console.log('Supabase list result:', { files, error }); // DEBUG

  if (error) throw new Error(`Storage list error: ${error.message}`);
  if (!files || files.length === 0)
    throw new Error('No screenshots found in bucket');

  // 2️⃣ Bierzemy tylko najnowsze 'limit' plików
  const latestFiles = files.slice(0, limit);

  // 3️⃣ Generujemy publiczny URL dla każdego
  const urls = latestFiles.map((file) => {
    const { data: publicUrlData } = supabase.storage
      .from('screenshots')
      .getPublicUrl(file.name);

    console.log('Public URL for', file.name, publicUrlData); // DEBUG

    if (!publicUrlData.publicUrl) {
      throw new Error(`Failed to get public URL for ${file.name}`);
    }

    return publicUrlData.publicUrl;
  });

  return urls;
};
