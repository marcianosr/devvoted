"use client";

import Text, { SmallText } from "@/components/ui/Text";
import { getClientUser } from "@/services/clientUser";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";

const UserProfile = () => {
	const { data: user, isLoading } = useQuery({
		queryKey: ["clientUser"],
		queryFn: getClientUser,
	});

	if (isLoading || !user) {
		return null;
	}

	const isGoogleUser = user.app_metadata?.provider === "google";
	const userEmail = user.email;
	const userName = isGoogleUser
		? user.user_metadata?.full_name
		: userEmail?.split("@")[0];
	const userAvatar = isGoogleUser ? user.user_metadata?.avatar_url : null;

	return (
		<div className="flex items-center gap-4">
			{userAvatar && (
				<Image
					src={userAvatar}
					alt={`${userName}'s avatar`}
					width={32}
					height={32}
					className="rounded-full"
				/>
			)}
			<div className="flex-col flex">
				<Text as="span">{userName}</Text>
				<SmallText>{userEmail}</SmallText>
			</div>
		</div>
	);
};

export default UserProfile;
