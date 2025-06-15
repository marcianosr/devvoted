"use client";

import { FC } from "react";
import Title from "@/components/ui/Title/Title";
import Text from "@/components/ui/Text/Text";

type ShopItem = {
	id: string;
	name: string;
	description: string;
	price: number;
};

type ShopProps = {
	onClose?: () => void;
};

const PLACEHOLDER_ITEMS: ShopItem[] = [
	{
		id: "item1",
		name: "XP Booster",
		description: "Boost your XP gain by 10% for the next poll",
		price: 100,
	},
	{
		id: "item2",
		name: "Streak Shield",
		description: "Protect your streak from one wrong answer",
		price: 250,
	},
	{
		id: "item3",
		name: "Knowledge Potion",
		description: "Increase your knowledge score by 5% for the next poll",
		price: 150,
	},
];

const Shop: FC<ShopProps> = ({ onClose }) => {
	return (
		<>
			{/* Backdrop with opacity */}
			<div
				className="fixed inset-0 bg-black opacity-50 z-40"
				onClick={onClose}
			/>
			{/* Content */}
			<div className="fixed inset-0 flex items-center justify-center z-50">
				<div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
					<div className="flex justify-between items-center mb-4">
						<Title>Shop</Title>
						{onClose && (
							<button
								onClick={onClose}
								className="text-gray-500 hover:text-gray-700"
							>
								✕
							</button>
						)}
					</div>

					<div className="space-y-4">
						<Text>Purchase items to help you on your journey!</Text>

						<ul className="space-y-3">
							{PLACEHOLDER_ITEMS.map((item) => (
								<li
									key={item.id}
									className="border p-3 rounded-md flex justify-between items-center"
								>
									<div>
										<h3 className="font-medium">
											{item.name}
										</h3>
										<p className="text-sm text-gray-600">
											{item.description}
										</p>
									</div>
									<button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">
										{item.price} XP
									</button>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	);
};

export default Shop;
