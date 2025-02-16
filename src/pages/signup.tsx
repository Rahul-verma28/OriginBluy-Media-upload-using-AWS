// "use client"

// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
// import { Link } from "react-router-dom"
// import { useToast } from "@/hooks/use-toast"

// export default function SignupPage() {
//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const navigate = useNavigate()
//   const { toast } = useToast()

//   const HOST = import.meta.env.VITE_SERVER_URL;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     try {
//       const response = await fetch(`${HOST}/auth/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//         credentials: "include",
//       })
//       if (response.ok) {
//         toast({
//           title: "Signup successful",
//           description: "Your account has been created. Please log in.",
//         })
//         navigate("/")
//       } else {
//         const data = await response.json()
//         throw new Error(data.message || "Signup failed")
//       }
//     } catch (error) {
//       toast({
//         title: "Signup failed",
//         description: error instanceof Error ? error.message : "An error occurred during signup.",
//         variant: "destructive",
//       })
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Sign Up</CardTitle>
//           <CardDescription>Create a new account to get started</CardDescription>
//         </CardHeader>
//         <form onSubmit={handleSubmit}>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 placeholder="Enter your name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//               />
//             </div>
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
//                 placeholder="Create a password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
//           </CardContent>
//           <CardFooter className="flex flex-col space-y-4">
//             <Button type="submit" className="w-full">
//               Sign Up
//             </Button>
//             <p className="text-sm text-center text-gray-600">
//               Already have an account?{" "}
//               <Link to="/login" className="text-blue-600 hover:underline">
//                 Log in
//               </Link>
//             </p>
//           </CardFooter>
//         </form>
//       </Card>
//     </div>
//   )
// }

"use client";

import { useState } from "react";
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
import { AlertCircle } from "lucide-react";
import { AlertDescription } from "@/components/ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
// import { useAppStore } from "@/store";
// import { apiClient } from "@/utils/api-client";
// import { SIGNUP_ROUTE } from "@/utils/constants";

export default function Signup() {
  // const { setUserInfo } = useAppStore();
  const [name, setname] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const HOST = import.meta.env.VITE_SERVER_URL;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const validateSignup = () => {
    if (!name?.length) {
      setError("name is required.");
      return false;
    }
    if (!email?.length) {
      setError("Email is required.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (!password?.length) {
      setError("Password is required.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters, including an uppercase letter, a lowercase letter, a number, and a special character."
      );
      return false;
    }
    if (password !== confirmPassword) {
      setError("Password and Confirm Password should match.");
      return false;
    }
    return true;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      if (validateSignup()) {
        const response = await axios.post(
          `${HOST}/auth/signup`,
          { name, email, password },
          { withCredentials: true }
        );
        toast.success("Successfully registered");

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
        <CardHeader>
          <CardTitle className="text-base/6 font-bold">Sign Up</CardTitle>
          <CardDescription className="text-sm/5 text-gray-600">
            Create a new account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-1">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                onChange={(e) => setname(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? "Loading..." : "Signup"}
            </Button>

            <div className=" w-full rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
              Already have an account?{" "}
              <Link
                className="font-medium hover:font-bold"
                data-headlessui-state=""
                to="/login"
              >
                Login now.
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
