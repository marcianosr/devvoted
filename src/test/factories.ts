import type { User } from "@supabase/supabase-js";
import type { Poll, PollOption } from "@/types/db";

type DeepPartial<T> = T extends Date
	? T
	: {
			[P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
	  };

// Fun Nintendo/gaming-themed questions for tests
const funQuestions = [
	"Which programming language would be Yoshi's favorite?",
	"If Mario was a web framework, which one would he be?",
	"What's Link's preferred testing library?",
	"Choose Kirby's favorite code editor!",
	"Which database would Princess Peach deploy?",
];

// Gaming-themed options
const funOptions = {
	languages: [
		"Python (It's-a me, Pythonio!)",
		"Ruby (Star Power)",
		"TypeScript (Master Sword)",
		"Rust (Golden Hammer)",
	],
	frameworks: [
		"Next.js (Power Star)",
		"Express (Fire Flower)",
		"Django (Green Shell)",
		"Rails (Super Leaf)",
	],
	editors: [
		"VS Code (Shine Sprite)",
		"Vim (Blue Shell)",
		"Emacs (Star Rod)",
		"Sublime (1-Up Mushroom)",
	],
};

export const createMockUser = (overrides?: DeepPartial<User>): User => ({
	id: "test-toad-1",
	email: "toad@mushroom-kingdom.com",
	app_metadata: {},
	user_metadata: {},
	aud: "authenticated",
	created_at: new Date().toISOString(),
	role: "authenticated",
	updated_at: new Date().toISOString(),
	phone: "",
	confirmation_sent_at: "",
	confirmed_at: new Date().toISOString(),
	last_sign_in_at: new Date().toISOString(),
	email_confirmed_at: new Date().toISOString(),
	phone_confirmed_at: "",
	recovery_sent_at: "",
	identities: [],
	factors: [],
	...overrides,
});

export const createMockPoll = (overrides?: DeepPartial<Poll>): Poll => ({
	id: 1,
	question: funQuestions[Math.floor(Math.random() * funQuestions.length)],
	status: "open",
	created_by: 1,
	updated_at: new Date(),
	created_at: new Date(),
	opening_time: new Date(),
	closing_time: new Date(Date.now() + 86400000), // 24 hours from now
	...overrides,
});

export const createMockPollOption = (
	overrides?: DeepPartial<PollOption>
): PollOption => ({
	id: 1,
	poll_id: 1,
	option: funOptions.languages[0],
	is_correct: false,
	...overrides,
});

export const createMockPollOptions = (
	count: number = 4,
	category: keyof typeof funOptions = "languages",
	baseOverrides?: DeepPartial<PollOption>
): PollOption[] => {
	const options = funOptions[category];
	return Array.from({ length: Math.min(count, options.length) }, (_, index) =>
		createMockPollOption({
			id: index + 1,
			poll_id: 1,
			option: options[index],
			is_correct: index === 0,
			...baseOverrides,
		})
	);
};
