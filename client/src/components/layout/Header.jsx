import ConnectButton from "../common/ConnectButton.jsx";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <nav className="min-w-screen bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">AgriTrust</h1>
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
