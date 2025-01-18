import { User } from "firebase/auth";

type UserProfileProps = {
	user: User;
};

const UserProfile = ({ user }: UserProfileProps) => (
	<div className="flex items-center space-x-4 p-4">
		{user.photoURL && (
			<img
				src={user.photoURL}
				alt={user.displayName || "User"}
				className="w-10 h-10 rounded-full"
			/>
		)}
		<div>
			<p className="font-medium">{user.displayName}</p>
			<p className="text-sm text-gray-500">{user.email}</p>
		</div>
	</div>
);

export default UserProfile;
