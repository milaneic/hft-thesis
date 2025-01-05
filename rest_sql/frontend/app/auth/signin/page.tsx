import React from "react";
import LoginForm from "./form";

const SignInPage = () => {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-green-800">
      <h1 className="text-[3rem] font-normal mb-5 text-white tracking-[10px]">
        TRACE
      </h1>
      <div className="w-[400px] shadow-2xl rounded-xl p-8 bg-white">
        <h1 className="text-2xl font-semibold text-green-700 ">Log in</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
