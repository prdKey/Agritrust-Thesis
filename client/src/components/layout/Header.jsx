import { useUserContext } from "../../context/UserContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getBalance } from "../../services/userService.js";
import { ShoppingCart, Search, Bell, BadgeQuestionMark, Wallet, Store, Truck } from "lucide-react";
import { useState, useEffect } from "react";


export default function Header() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [search, setSearch]   = useState("");
  const [balance, setBalance] = useState(null);
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => { setSearch(keyword); }, [keyword]);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!user?.walletAddress || !window.ethereum) return;
      try {
        const data = await getBalance();
        setBalance(data.balance);
      } catch (e) {
        console.error("Failed to fetch AGT balance:", e);
      }
    };
    fetchBalance();
  }, [user]);

  const handleSearch = () => {
    if (!search.trim()) return;
    navigate(`/search?keyword=${search}`);
  };

  const fmtBalance = (b) => {
    if (b === null) return "—";
    if (b >= 1000000) return `${(b / 1000000).toFixed(1)}M`;
    if (b >= 1000)    return `${(b / 1000).toFixed(1)}K`;
    return b.toFixed(2);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm border-b border-gray-100">

      {/* ── Single green bar ─────────────────────────────────────────── */}
      <div className="bg-green-600 px-3 py-0 h-9 flex items-center">
        <div className="max-w-7xl w-full mx-auto flex items-center justify-between">

          {/* Left: Seller + Logistic — one line */}
          <div className="flex items-center divide-x divide-green-500">
            <button
              onClick={() => navigate("/seller")}
              className="flex items-center gap-1 text-white text-xs hover:text-green-200 transition-colors pr-3"
            >
              <Store size={12} />
              <span>Seller Centre</span>
            </button>
            <button
              onClick={() => navigate("/logistic")}
              className="flex items-center gap-1 text-white text-xs hover:text-green-200 transition-colors pl-3"
            >
              <Truck size={12} />
              <span>Logistic Centre</span>
            </button>
          </div>

          {/* Right: Bell · About · Balance · Profile */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/user/notifications")}
              className="text-white hover:text-green-200 transition-colors"
              title="Notifications"
            >
              <Bell size={15} />
            </button>

            <button
              onClick={() => navigate("/about")}
              className="text-white hover:text-green-200 transition-colors"
              title="About"
            >
              <BadgeQuestionMark size={15} />
            </button>

            {/* AGT Balance */}
            {user && (
              <div className="flex items-center gap-1 bg-green-500 border border-green-400 rounded-full px-2.5 py-0.5">
                <Wallet size={11} className="text-green-200 flex-shrink-0" />
                <span className="text-xs font-bold text-white whitespace-nowrap">
                  {fmtBalance(balance)} AGT
                </span>
              </div>
            )}

            {/* Divider */}
            {user && <div className="w-px h-4 bg-green-500" />}

            {/* Profile / Login */}
            {user ? (
              <button
                onClick={() => navigate("/user")}
                className="flex items-center gap-1.5 hover:text-green-200 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.firstName?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="text-white text-xs font-medium max-w-[100px] truncate hidden sm:block">
                  {user.firstName} {user.lastName}
                </span>
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="text-xs bg-white text-green-600 font-semibold px-3 py-1 rounded-full hover:bg-green-50 transition-colors"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main row: Logo · Search · Cart ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 py-2.5 flex items-center gap-3">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 flex-shrink-0 group"
        >
          <img
            className="w-8 h-8 object-contain"
            src="/icon/AgritrustIcon.png"
            alt="AgriTrust Logo"
          />
          <span className="hidden md:block text-lg font-black text-green-600 tracking-tight group-hover:text-green-500 transition-colors">
            AgriTrust
          </span>
        </button>

        {/* Search — centered, constrained */}
        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-md rounded-full overflow-hidden border-2 border-green-600 focus-within:border-green-500 focus-within:shadow-md transition-all">
            <input
              value={search}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search products..."
              className="flex-1 min-w-0 px-4 py-2 text-sm bg-white text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-4 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="flex-shrink-0 text-green-600 hover:text-green-500 transition-colors p-1"
        >
          <ShoppingCart size={24} />
        </button>

      </div>
    </header>
  );
}