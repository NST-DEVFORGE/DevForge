import { z } from "zod";

export interface ClubEvent {
    id: string;
    title: string;
    summary: string;
    /** ISO 8601 with offset, so it survives timezone changes. */
    startsAt: string;
    endsAt?: string;
    location: string;
    /** Null means uncapped. */
    capacity: number | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface Rsvp {
    /** `${eventId}:${usn}` — one RSVP per member per event, enforced by the id. */
    id: string;
    eventId: string;
    usn: string;
    name: string;
    createdAt: string;
}

export const eventInputSchema = z.object({
    title: z.string().trim().min(3, "Give the session a title").max(120),
    summary: z.string().trim().min(10, "One line on what it covers").max(500),
    startsAt: z.string().datetime({ offset: true, message: "Start time must be a valid date" }),
    endsAt: z.string().datetime({ offset: true }).optional().or(z.literal("").transform(() => undefined)),
    location: z.string().trim().min(2, "Where is it?").max(160),
    capacity: z
        .number()
        .int()
        .positive("Capacity must be at least 1")
        .max(10_000)
        .nullable()
        .default(null),
});

export type EventInput = z.infer<typeof eventInputSchema>;

/** Stable id so a member can't RSVP twice by racing two requests. */
export function rsvpId(eventId: string, usn: string): string {
    return `${eventId}:${usn}`;
}

export function isPast(event: Pick<ClubEvent, "startsAt" | "endsAt">, now = new Date()): boolean {
    return new Date(event.endsAt ?? event.startsAt).getTime() < now.getTime();
}
