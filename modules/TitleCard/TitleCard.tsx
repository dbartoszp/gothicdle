import { Card } from '../ui/Card/Card';
import { Text } from '../ui/Text/Text';
import localFont from '@next/font/local';

const gothicTitleFont = localFont({
  src: [{ path: '../../public/fonts/Gothic2Nacht.ttf', weight: '400' }],
  variable: '--font-gothic-title',
});

export const TitleCard = () => {
  return (
    <Card>
      <Text variant='title'>
        <span className={`${gothicTitleFont.variable} font-sans`}>
          Gothicdle
        </span>
      </Text>
      <Text variant='danger'>Tu jakies instrukcje beda</Text>
    </Card>
  );
};
