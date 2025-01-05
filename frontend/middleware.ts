export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/((?!auth/signin|auth/register).*)"],
  // matcher: ["/"],
};
