import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getFirstThreeScreenshots = async () => {
  const supabase = createClientComponentClient();

  const { data, error } = await supabase
    .from('screenshotTesting')
    .select('id, filename, coord_x, coord_y, map_id')
    .order('id', { ascending: true })
    .limit(3);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  if (!data || data.length === 0) {
    throw new Error('No screenshots found');
  }

  const screenshots = data.map((row) => {
    const { data: publicUrlData } = supabase.storage
      .from('screenshots')
      .getPublicUrl(row.filename);

    if (!publicUrlData.publicUrl) {
      throw new Error(`Failed to generate URL for ${row.filename}`);
    }

    return {
      id: row.id,
      url: publicUrlData.publicUrl,
      coordX: row.coord_x,
      coordY: row.coord_y,
    };
  });

  return screenshots;
};
