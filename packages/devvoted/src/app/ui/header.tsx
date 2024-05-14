import { signOut } from "@/auth";
import Link from "next/link";
import { Button } from "primereact/button";

export const Header: React.FC<{
  profileId?: string;
  profileName?: string;
  profilePicture?: string;
}> = ({ profileId, profileName, profilePicture }) => {
  return (
    <header className="h-20">
      <div className="shadow flex flex-row gap-4 p-1">
        {profileId && (
          <>
            <div className="w-10 h-10 rounded-2 shadow-sm text-center bg-slate-200 text-2xl">
              <Link href={`/profile/${profileId}`}>
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={`Profile image of ${profileName}`}
                  />
                ) : (
                  "🤪"
                )}
              </Link>
            </div>
            <p>
              <Link href={`/profile/${profileId}`}>{profileName}</Link>
            </p>
            <p>Score: 1337</p>
            <p>Rating: 85%</p>
            <div className="flex-1"></div>
            <form
              action={async () => {
                "use server";

                await signOut();
              }}
            >
              <Button label="Logout" size="small"></Button>
            </form>
          </>
        )}
        {!profileId && (
          <>
            <div className="flex-1">
              <h1 className="text-center text-4xl uppercase font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                Devvoted
              </h1>
            </div>
            <Link className="p-button inline-block" href="/login">
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
};
