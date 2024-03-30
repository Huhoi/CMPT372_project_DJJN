"use client";

import axios, { AxiosError } from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";


interface User {
  token: string;
  username: string;
  uid: number;
}

interface UserResponse {
  user: User | null;
  error: AxiosError | null;
}

export default function DashboardLayout({children,}: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const { push } = useRouter();

  useEffect(() => {
    (async () => {
      const { user, error } = await getUser();
      console.log("User: ", user);
      if (error) {
        push("/");
        return;
      }

      // if the error did not happen, if everything is alright
      setUser(user);
      setIsSuccess(true);
    })();
  }, [push]);

  if (!isSuccess) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {children}
    </main>
  );
}

async function getUser(): Promise<UserResponse> {
  try {
    const { data } = await axios.get("/api/me");

    return {
      user: data,
      error: null,
    };
  } catch (e) {
    const error = e as AxiosError;

    return {
      user: null,
      error,
    };
  }
}