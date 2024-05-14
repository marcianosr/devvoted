import { firestore } from "@/app/lib/firestore";
import Image from "next/image";

const ProfileIdPage: React.FC<{
  params: { id: string };
}> = async ({ params }) => {
  const user = (
    await firestore.collection("users").doc(params.id).get()
  ).data() as User;
  return (
    <>
      <h1>Profile of {user.name}</h1>
      <Image
        height={200}
        width={200}
        src={user.image}
        alt={`Profile picture of ${user.name}`}
      />
    </>
  );
};

export default ProfileIdPage;
