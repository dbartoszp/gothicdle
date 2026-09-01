import { GoBackButton } from '@/modules/ui/GoBackButton/GoBackButton';

export default function NotFound() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-6'>
      <p
        className='font-gothic text-4xl'
        style={{ color: 'var(--default-text)' }}
      >
        Nic tu nie ma!
      </p>
      <GoBackButton />
    </div>
  );
}
