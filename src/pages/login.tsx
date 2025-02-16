// import { useState } from "react"
// // import { useRouter } from ""
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Link, useNavigate } from "react-router-dom"
// import { useToast } from "@/hooks/use-toast"

// export default function LoginPage() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const { toast } = useToast()
//   const navigate = useNavigate()

//   const HOST = import.meta.env.VITE_SERVER_URL;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch(`${HOST}/auth/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//         credentials: "include",
//       })
//       if (response.ok) {
//         toast({
//           title: "Login successful",
//           description: "Welcome back to your account!",
//         })
//         navigate("/")
//       } else {
//         const data = await response.json()
//         throw new Error(data.message || "Login failed")
//       }
//     } catch (error) {
//       toast({
//         title: "Login failed",
//         description: error instanceof Error ? error.message : "An error occurred during login.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Login</CardTitle>
//           <CardDescription>Enter your credentials to access your account</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="password">Password</Label>
//               <Input
//                 id="password"
//                 type="password"
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full">
//               Login
//             </Button>
//             <p className="text-sm text-center text-gray-600">
//               Don't have an account?{" "}
//               <Link to="/signup" className="text-blue-600 hover:underline">
//                 Sign up
//               </Link>
//             </p>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
// import { apiClient } from "@/utils/api-client";
// import { LOGIN_ROUTE } from "@/utils/constants";
// import { useAppStore } from "@/store";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // const { setUserInfo } = useAppStore();

  const HOST = import.meta.env.VITE_SERVER_URL || "http://localhost:8747/api"; // Ensure fallback

  const validateLogin = () => {
    if (!email.length) {
      setError("Email is required.");
      return false;
    }
    if (!password.length) {
      setError("Password is required.");
      return false;
    }
    return true;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (validateLogin()) {
        const response = await axios.post(
          `${HOST}/auth/login`,
          { email, password },
          { withCredentials: true }
        );
        toast.success("Logged in successfully");

        if (response.data.user.id) {
          // setUserInfo(response.data.user);
          navigate("/"); // Navigate based on bio existence
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setError((error as any).response?.data?.message || error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false); // Enable the button after upload is complete
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-base/6 font-bold">Welcome back!</CardTitle>
          <CardDescription className="mt-1 text-sm/5 text-gray-600">
            Sign in to your account to continue.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="password"
              />
            </div>
            {error && (
              <div className="flex items-center space-x-2 text-red-500 bg-red-100 p-2 rounded-md">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Loading..." : "Login"}
            </Button>

            <div className=" w-full m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
              Not a member?{" "}
              <Link
                className="font-medium hover:font-bold"
                data-headlessui-state=""
                to="/signup"
              >
                Create an account
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
