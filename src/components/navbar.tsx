
// import { useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Link } from "react-router-dom"
// import { useToast } from "@/hooks/use-toast"

// export function Navbar() {
//   const navigate = useNavigate()
//   const { toast } = useToast()
//   const HOST = import.meta.env.VITE_SERVER_URL;

//   const handleLogout = async () => {
//     try {
//       const response = await fetch(`${HOST}/auth/logout`, { method: "POST" })
//       if (response.ok) {
//         toast({
//           title: "Logged out successfully",
//           description: "You have been logged out of your account.",
//         })
//         navigate("/login")
//       } else {
//         throw new Error("Logout failed")
//       }
//     } catch (error) {
//       toast({
//         title: "Logout failed",
//         description: "An error occurred while logging out. Please try again.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex">
//             <Link to="/" className="flex-shrink-0 flex items-center">
//               <span className="text-xl font-bold text-gray-800">Media App</span>
//             </Link>
//           </div>
//           <div className="flex items-center">
//             <Button onClick={handleLogout} variant="outline">
//               Logout
//             </Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }


import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function Navbar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:5000/api"; // Ensure fallback

  const handleLogout = async () => {
    try {
      const response = await fetch(`${HOST}/auth/logout`, {
        method: "POST",
        credentials: "include", // If using cookies for auth
      });

      if (response.ok) {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account.",
        });
        navigate("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.log("Logout error:", error);
      console.log(HOST)
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Media App</span>
            </Link>
          </div>
          <div className="flex items-center">
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
