"use client";
import { signIn } from "next-auth/react";
import { Button } from "primereact/button";

export const SigninButton = () => (
  <Button label="Login" onClick={() => signIn()} />
);
