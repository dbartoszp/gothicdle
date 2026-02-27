import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getFirstScreenshotTesting = async () => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase.storage.from('screenshots').list('', {
    limit: 1,
    sortBy: { column: 'created_at', order: 'asc' },
  });

  if (error) {
    throw new Error(`Storage list error: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No screenshots found in bucket');
  }

  const fileName = data[0].name;

  const { data: publicUrlData } = supabase.storage
    .from('screenshots')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};
