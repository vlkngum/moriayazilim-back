import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full bg-gray-900 shadow-md py-4 mb-8">
      <nav className="container mx-auto flex justify-between items-center px-4">
        <div className="text-xl font-bold text-white tracking-wide">Admin Paneli</div>
        <ul className="flex space-x-6">
          <li>
            <Link href="/blog" className="text-gray-200 hover:text-blue-400 font-medium transition-colors">Blog</Link>
          </li>
          <li>
            <Link href="/portfolio" className="text-gray-200 hover:text-blue-400 font-medium transition-colors">Portfolio</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 