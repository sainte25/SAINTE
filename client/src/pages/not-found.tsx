import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="apple-card w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex items-center mb-4 gap-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-white/70">
            We couldn't find the page you were looking for.
          </p>
          
          <div className="mt-6">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
