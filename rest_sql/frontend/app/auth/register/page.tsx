import { RegisterForm } from "./form";

const RegisterPage = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center bg-green-800">
      <div className="shadow-xl px-10 py-4  rounded-xl w-[500px] bg-white">
        <h1 className="font-semibold text-2xl pt-3 pb-3 text-green-700">
          Create your account
        </h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
