export interface ScheduledEvent {
    id: number;
    title: string;
    date: Date;
    time: string;
    location: string;
    description: string;
    category: string;
    poc: string;
}

const pocLeads = [
    "Geetansh Goyal", "Vikas Sharma", "Shrishti Kumari", "Nishta Agarwal", "Dhruv Mehta",
    "Bhavesh Sharma", "Sujan YD", "Sahitya Singh", "Luvya Rana", "Izaz",
];

const startDate = new Date(2026, 6, 20); // July 20, 2026

const specialEvents: Record<number, { type: "Masterclass" | "Hackathon" | "BigEvent"; name: string }> = {
    1: { type: "Masterclass", name: "Masterclass" },
    2: { type: "Hackathon", name: "Monthly Hackathon" },
    5: { type: "Masterclass", name: "Masterclass" },
    7: { type: "Hackathon", name: "Monthly Hackathon" },
    8: { type: "BigEvent", name: "DevForge Big Event" },
    10: { type: "Masterclass", name: "Masterclass" },
    11: { type: "Hackathon", name: "Monthly Hackathon" },
    14: { type: "Masterclass", name: "Masterclass" },
    15: { type: "Hackathon", name: "Monthly Hackathon" },
    16: { type: "BigEvent", name: "DevForge Big Event" },
    18: { type: "Masterclass", name: "Masterclass" },
    20: { type: "Hackathon", name: "Monthly Hackathon" },
    23: { type: "Masterclass", name: "Masterclass" },
    24: { type: "Hackathon", name: "Monthly Hackathon" },
    25: { type: "BigEvent", name: "DevForge Big Event" },
    27: { type: "Masterclass", name: "Masterclass" },
    28: { type: "Hackathon", name: "Monthly Hackathon" },
    31: { type: "Masterclass", name: "Masterclass" },
    32: { type: "Hackathon", name: "Monthly Hackathon" },
    33: { type: "BigEvent", name: "DevForge Big Event" },
    35: { type: "Masterclass", name: "Masterclass" },
    37: { type: "Hackathon", name: "Monthly Hackathon" },
    40: { type: "Masterclass", name: "Masterclass" },
    41: { type: "Hackathon", name: "Monthly Hackathon" },
    42: { type: "BigEvent", name: "DevForge Big Event" },
    44: { type: "Masterclass", name: "Masterclass" },
    46: { type: "Hackathon", name: "Monthly Hackathon" },
    49: { type: "Masterclass", name: "Masterclass" },
    50: { type: "Hackathon", name: "Monthly Hackathon" },
};

function buildSchedule(): ScheduledEvent[] {
    const events: ScheduledEvent[] = [];

    for (let i = 0; i < 50; i++) {
        const sessionNumber = i + 1;
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i * 7);

        const poc = pocLeads[i % pocLeads.length];
        const special = specialEvents[sessionNumber];

        let title = `Session #${sessionNumber}`;
        let category = "Weekly Session";

        if (special?.type === "Masterclass") {
            title = `Masterclass & Session #${sessionNumber}`;
            category = "Masterclass";
        } else if (special?.type === "Hackathon") {
            title = `Monthly Hackathon & Session #${sessionNumber}`;
            category = "Hackathon";
        } else if (special?.type === "BigEvent") {
            title = `DevForge Big Event & Session #${sessionNumber}`;
            category = "Big Event";
        }

        events.push({
            id: sessionNumber,
            title,
            date,
            time: "6:00 PM - 8:00 PM IST",
            location: "DevForge Hub",
            description: `Led by ${poc}. Join us for Session #${sessionNumber} of the annual DevForge calendar.`,
            category,
            poc,
        });
    }

    return events;
}

export const scheduledEvents = buildSchedule();

export function getNextEvent(from: Date = new Date()): ScheduledEvent | null {
    return scheduledEvents.find((e) => e.date.getTime() >= from.setHours(0, 0, 0, 0)) ?? null;
}
