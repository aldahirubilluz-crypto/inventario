//src/app/auth/error/page.tsx
import { Suspense } from "react";
import AuthError from "./error-content";

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  );
}