'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { QueueListIcon, CircleStackIcon, UserGroupIcon, UserIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const links = [
  { name: 'Recipes', href: '/protected/signedIn/recipes', icon: QueueListIcon },
  { name: 'Inventory', href: '/protected/signedIn/inventory', icon: CircleStackIcon },
  { name: 'Find Recipes', href: '/protected/signedIn/community', icon: MagnifyingGlassIcon },
  { name: 'Account', href: '/protected/signedIn/account', icon: UserIcon },
];

function Navlinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[64px] grow items-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 flex-none justify-start',
              {
                'bg-sky-100 text-blue-600': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="font-dm_mono tracking-tighter text-sm font-medium">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

export default Navlinks