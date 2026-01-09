export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="min-w-screen bg-white shadow-inner py-6 mt-6">
      <div className="max-w-7xl mx-auto px-6 text-center text-gray-500">
        © {currentYear} AgriTrust. All rights reserved.
      </div>
    </footer>
  );
}
