import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4 mt-auto">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🪞</span>
              <span className="text-white font-bold text-lg">Another Me</span>
            </div>
            <p className="text-sm leading-relaxed">
              Find your behavioral twin. Record daily activities and connect with people who share your lifestyle.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/en/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link href="/en/daily" className="hover:text-white transition-colors">Daily Log</Link></li>
              <li><Link href="/en/matches" className="hover:text-white transition-colors">Matches</Link></li>
              <li><Link href="/en/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/en/auth/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/en/auth/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/en/profile" className="hover:text-white transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Another Me / 另一个我. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>🌏 EN / 中文</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
