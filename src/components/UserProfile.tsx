import { User } from "firebase/auth";
import Text, { SmallText } from "@/components/ui/Text";

type UserProfileProps = {
	user: User;
};

const UserProfile = ({ user }: UserProfileProps) => (
	<div className="flex items-center gap-4">
		{user.photoURL && (
			<img
				src={user.photoURL}
				alt={user.displayName || "User"}
				className="w-10 h-10 rounded-full"
			/>
		)}
		<div className="flex-col flex">
			<Text as="span">{user.displayName}</Text>
			<SmallText>{user.email}</SmallText>
		</div>
	</div>
);

export default UserProfile;
