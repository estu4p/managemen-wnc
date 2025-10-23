import { LoginForm } from "@/components/form/LoginForm";
import { Input } from "@/components/ui/input";

function LoginPage() {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* <div className=" "> */}
      <LoginForm className="w-full max-w-sm" />
      {/* </div> */}
      <div className="flex items-center justify-between w-full max-w-[26rem] mt-2">
        <h1 className="text-3xl font-bold">
          Wash and Care <br />
          Dashboard
        </h1>
        <div className="bg-primary rounded-md h-16 w-16"></div>
      </div>
    </div>
  );
}

export default LoginPage;
