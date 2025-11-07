interface Affirmation {
    text: string;
    author: string;
}

const affirmations: Affirmation[] = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Well done is better than well said.", author: "Benjamin Franklin" },
    { text: "A year from now you may wish you had started today.", author: "Karen Lamb" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "With self-discipline most anything is possible.", author: "Theodore Roosevelt" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.", author: "Stephen Covey" },
    { text: "You don’t have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Act or accept.", author: "Anonymous" }
];

export const getRandomAffirmation = (): Affirmation => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    return affirmations[randomIndex];
};
