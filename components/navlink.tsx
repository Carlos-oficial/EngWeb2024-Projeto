import Link from 'next/link';

export default function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  const active_styling =
    'bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white';
  const inactive_styling = 'hover:bg-accent hover:text-accent-foreground';

  return (
    <Link
      href={href}
      className={`inline-flex items-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${active ? active_styling : inactive_styling} h-9 rounded-md px-3 justify-start space-x-3`}
    >
      {children}
    </Link>
  );
}
