import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate} from "react-router-dom";

export default function Header() {
  
  const {user} = useAuth()
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <nav className="min-w-screen bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 onClick={() => navigate("/market")} className="text-xl font-bold text-green-600 hover:cursor-pointer">AgriTrust</h1>
          {user? <div onClick={() => navigate("/user")} className="flex items-center gap-2 hover:cursor-pointer">
            <img src="https://scontent.fmnl13-4.fna.fbcdn.net/v/t39.30808-6/473190189_2409978942668057_1153590623084014352_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEmfTFqz6sX-yeUw5KR5HgVJTGcrxECPCAlMZyvEQI8IKbs3-YBoHdiIQ7DQVpDE5DpoFvUM-aE2yPfdr1cbF4z&_nc_ohc=HQP0ahilk34Q7kNvwF-IFz9&_nc_oc=AdkeoNZGCwiQLJYTDm5dbcxAhzkdvftMGiVC1Be26Y-5mRQWzKLodSIBIwyZQxzuz67H__B07zhKpYJ1YK_heeKw&_nc_zt=23&_nc_ht=scontent.fmnl13-4.fna&_nc_gid=Mg7Z898MlPiZiNLQImYZgA&oh=00_AfoYcmrBRW5AUDtwM8nz3Blpnv_0YujwKDmS8NvkuoDqJg&oe=6972E1F4" alt="Example" className="bg-amber-300 rounded-full w-7 h-7"/>
            <span className="">{user.firstName + " " + user.lastName}</span>
          </div> : <button onClick={() => navigate("/login") } className="cursor-pointer bg-green-600 text-white px-4 py-1 rounded">Login</button>}
        </div>
      </nav>
    </header>
  );
}
