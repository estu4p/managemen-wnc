import HeaderPage from "@/components/HeaderPage";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SecurityPage = () => {
  return (
    <div className="p-4 sm:px-7">
      <HeaderPage
        title="Security"
        desc="Manage your acount security settings."
        calendar={false}
      />
      <div className="gap-4 mt-6 flex flex-col sm:flex-row">
        <div className="w-fit space-y-2">
          <Label htmlFor="username" className="font-medium">
            Username
          </Label>
          <Input id="username" value="Admin" className="w-[250px]" />
          <p className="text-sm text-muted-foreground">
            This username is used to login to your account.
          </p>
        </div>
        <div className="w-fit space-y-2">
          <Label htmlFor="name" className="font-medium">
            Name
          </Label>
          <Input id="name" value="Admin" className="w-[250px]" />
          <p className="text-sm text-muted-foreground">
            This name is used to display on your profile.
          </p>
        </div>
      </div>
      <div className="w-fit space-y-2 mt-6">
        <Label htmlFor="password" className="font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value="Admin"
          className="w-[250px]"
        />
        <p className="text-sm text-muted-foreground">Current password</p>
        <Input
          id="newPassword"
          type="password"
          value="Admin"
          className="w-[250px]"
        />
        <p className="text-sm text-muted-foreground">New password</p>
        <Input
          id="confirmNewPassword"
          type="password"
          value="Admin"
          className="w-[250px]"
        />
        <p className="text-sm text-muted-foreground">Confirm new password</p>
      </div>
    </div>
  );
};

export default SecurityPage;
