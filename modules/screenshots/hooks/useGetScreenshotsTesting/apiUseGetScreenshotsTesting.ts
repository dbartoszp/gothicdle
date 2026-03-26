import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const getScreenshots = async () => {
  const supabase = createClientComponentClient();

  const { data: currentData, error: currentError } = await supabase
    .from('currentScreenshotsTesting')
    .select('firstScreenshotId')
    .single();

  if (currentError) {
    throw new Error(
      `Failed to fetch currentScreenshotsTesting: ${currentError.message}`
    );
  }

  if (!currentData?.firstScreenshotId) {
    throw new Error('firstScreenshotId not found');
  }

  const firstId = currentData.firstScreenshotId;

  const { data, error } = await supabase
    .from('screenshotTesting')
    .select('id, filename, coord_x, coord_y, map_id')
    .gte('id', firstId)
    .lt('id', firstId + 5)
    .order('id', { ascending: true });

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
      map_id: row.map_id,
    };
  });

  return screenshots;
};
