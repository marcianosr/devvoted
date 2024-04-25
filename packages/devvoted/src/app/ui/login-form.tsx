import { Button } from "primereact/button";
import { providerMap } from "../../auth.config";
import { signIn } from "../../auth";

const LoginForm = () => {
  return (
    <div className="flex flex-col gap-2">
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async () => {
            "use server";
            await signIn(provider.id, { redirectTo: "/polls/vote" });
          }}
        >
          <Button type="submit" label={`Sign in with ${provider.name}`} />
        </form>
      ))}
    </div>
  );
};
export default LoginForm;
