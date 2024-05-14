import LoginForm from "@/app/ui/login-form";

const LoginPage = async () => {
  return (
    <div className="mt-8 m-auto w-80 p-4 border-2 rounded-md flex flex-col gap-2">
      <h1>Login!</h1>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
