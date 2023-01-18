import Link from 'next/link';

const NavLink = ({ href, children }) => {
  return (
    <Link href={href} className="mr-6 text-white">
      {children}
    </Link>
  );
};

export default NavLink;