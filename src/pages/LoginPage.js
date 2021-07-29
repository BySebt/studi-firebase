import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Label, Input } from "@windmill/react-ui";
import firebase from "firebase";
import { useToast } from "@chakra-ui/react";
const { isEmail } = require("../utils/validate");
const { processErrorCode } = require("../utils/utils");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      if (email && password && !loading) {
        handleSubmit(event);
      }
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!isEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please make sure your email is correct.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Invalid Password",
        description: "Passwords must be longer then 6 characters.",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        toast.closeAll();
        return true;
      })
      .catch((error) => {
        toast({
          title: processErrorCode(error.code),
          description: error.message,
          status: "error",
          duration: 5000,
        });
        setLoading(false);
      });
  }

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-md mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto">
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-auto">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login to Studyi
              </h1>

              <Label>
                <span>Email</span>
                <Input
                  className="mt-1"
                  type="email"
                  name="email"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Label>

              <Label className={"mt-4"}>
                <span>Password</span>
                <Input
                  className="mt-1"
                  type="password"
                  name="password"
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Label>

              <Button
                className="my-4"
                block
                onClick={handleSubmit}
                disabled={loading || !email || !password}
              >
                Log in
              </Button>

              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/create-account"
                >
                  No account? Signup here!
                </Link>
              </p>

              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/"
                >
                  Back to Homepage
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
