import { useAuth } from "../context/AuthContext.jsx"
import DisconnectWalletButton from "../components/common/DisconnectWalletButton.jsx"
import ConnectWalletButton from "../components/common/ConnectWalletButton.jsx"
import {Link} from "react-router-dom"

export default function Login() {
    const {user} = useAuth()
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-md text-center">
        
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
            alt="MetaMask"
            className="h-16 w-16"
          />
        </div>

        <h1 className="text-2xl font-bold mb-2">Welcome</h1>
        <p className="text-gray-500 mb-6">
            {user ? `Logged in as ${user.firstName}` : "Connect your wallet to continue."}
        </p>
        {user ? <DisconnectWalletButton/> : <ConnectWalletButton/>}
        <div className="flex justify-center mt-2">
            <Link
                to="/register"
                className="text-xs text-gray-400 font-light cursor-pointer hover:underline transition-colors hover:text-green-600"
            >
                New User? Register your wallet
            </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms & Conditions
        </p>
      </div>
    </div>
  )
}
