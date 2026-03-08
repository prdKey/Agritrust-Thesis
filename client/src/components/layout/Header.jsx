import { useUserContext } from "../../context/UserContext";
import { useNavigate, useSearchParams} from "react-router-dom";
import { ShoppingCart, Search, Bell, BadgeQuestionMark } from "lucide-react";
import { useState, useEffect} from "react";

export default function Header() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || ""; 
  const [search, setSearch] = useState("");
  const {user} = useUserContext();
  const navigate = useNavigate();
  useEffect(()=>
  {
    setSearch(keyword)

  },[keyword])

  const handleSearch = () =>
  {
    if(!search) return;
    navigate(`/search?keyword=${search}`)
  }
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white shadow-md">
      <nav className="max-w-7xl w-full px-4 py-3 mx-auto flex flex-col sm:flex-col gap-2">

        {/* Top links - desktop only */}
        <div className="hidden sm:flex items-center justify-between mb-2">
          <ul className="flex gap-2 text-green-600 text-sm">
            <li onClick={() => navigate("/seller")} className="cursor-pointer hover:text-green-500">Seller Centre</li>
            <li>|</li>
            <li onClick={() => navigate("/seller")} className="cursor-pointer hover:text-green-500">Start Selling</li>
            <li>|</li>
            <li onClick={() => navigate("/logistic")} className="cursor-pointer hover:text-green-500">Logistic Centre</li>
          </ul>

          <div className="flex items-center gap-4">
            <ul className="flex gap-4 text-green-600 text-sm">
              <li onClick={() => navigate("/user/notifications")} className="cursor-pointer hover:text-green-500 flex items-center gap-1">
                <Bell size={15} /> Notifications
              </li>
              <li onClick={() => navigate("/about")} className="cursor-pointer hover:text-green-500 flex items-center gap-1">
                <BadgeQuestionMark size={15} /> About
              </li>
            </ul>
            <div >
              {user ? (
                <div onClick={() => navigate("/user")} className="flex items-center gap-2 cursor-pointer">
                  <img alt="Profile" className="bg-amber-300 rounded-full w-6 h-6" />
                  {/* Full name only on desktop */}
                  <span >{user.firstName + " " + user.lastName}</span>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="hidden sm:block bg-green-600 text-white px-4 py-1 rounded">
                  Login
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main row: Logo, Search, Profile+Cart */}
        <div className="flex items-center justify-between w-full">
          
          {/* Logo */}
          <div onClick={() => navigate("/")} className="flex items-center gap-2 cursor-pointer">
            <img className="w-8 h-8 object-contain" src="/icon/AgritrustIcon.png" alt="AgriTrust Logo" />
            {/* Logo text hidden on mobile */}
            <h1 className="hidden md:block text-xl font-bold text-green-600">AgriTrust</h1>
          </div>

          {/* Search bar */}
          <div className="flex max-w-xl w-full mx-4">
            <div className="flex w-full">
              <input
                value={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(); 
                  }
                }}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <button onClick={handleSearch} className="bg-green-600 hover:bg-green-500 cursor-pointer text-white rounded-r-lg px-4 flex items-center justify-center">
                <Search />
              </button>
            </div>
            <div onClick={() => navigate("/cart")} className="cursor-pointer hover:text-green-500 text-green-600 flex items-center sm:ml-10 ml-3">
                <ShoppingCart size={28} />
            </div>
          </div>

          {/* Profile/Login + Cart */}
          <div className="flex items-center gap-4">
            <div className="sm:hidden">
              {user ? (
                <div onClick={() => navigate("/user")} className="flex items-center gap-2 cursor-pointer">
                  <img alt="Profile" className="bg-amber-300 rounded-full w-6 h-6" />
                  {/* Full name only on desktop */}
                  <span className="hidden sm:block">{user.firstName + " " + user.lastName}</span>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="hidden sm:block bg-green-600 text-white px-4 py-1 rounded">
                  Login
                </button>
              )}
              
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
