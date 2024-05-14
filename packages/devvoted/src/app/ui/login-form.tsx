import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { providerMap } from "../../auth.config";
import { signIn } from "../../auth";

const LoginForm = () => {
  return (
    <div className="flex flex-col gap-4">
      {Object.values(providerMap).map((provider) => (
        <form
          key={provider.id}
          action={async (formData) => {
            "use server";
            await signIn(provider.id, formData, { redirectTo: "/polls/vote" });
          }}
          className="flex flex-col gap-1"
        >
          {provider.type === "email" && (
            <InputText
              type="email"
              name="email"
              placeholder="Email"
              className="p-inputtext-sm"
            />
          )}
          <Button type="submit" label={`Sign in with ${provider.name}`} />
        </form>
      ))}
    </div>
  );
};
export default LoginForm;
