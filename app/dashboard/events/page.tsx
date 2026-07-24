import { redirect } from "next/navigation";
import { CalendarCheck, MapPin, Users } from "lucide-react";
import { club, COLLECTIONS } from "@/lib/firebase/collections";
import { getSession } from "@/lib/session";
import { isPast, rsvpId, type ClubEvent, type Rsvp } from "@/lib/events";
import { RsvpButton } from "@/components/events/rsvp-button";
import { CreateSession } from "@/components/events/create-session";

export const metadata = { title: "Sessions" };

const when = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
});

export default async function EventsPage() {
    const session = await getSession();
    if (!session) redirect("/login?next=/dashboard/events");
    const canCreate = session.role === "admin" || session.role === "mentor";

    const [eventsSnap, rsvpsSnap] = await Promise.all([
        club<ClubEvent>(COLLECTIONS.events).get(),
        club<Rsvp>(COLLECTIONS.rsvps).get(),
    ]);

    const counts = new Map<string, number>();
    const mine = new Set<string>();
    rsvpsSnap.forEach((doc) => {
        const rsvp = doc.data();
        counts.set(rsvp.eventId, (counts.get(rsvp.eventId) ?? 0) + 1);
        if (doc.id === rsvpId(rsvp.eventId, session.usn)) mine.add(rsvp.eventId);
    });

    const events = eventsSnap.docs.map((d) => d.data());
    const upcoming = events.filter((e) => !isPast(e)).sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    const past = events.filter((e) => isPast(e)).sort((a, b) => b.startsAt.localeCompare(a.startsAt));

    return (
        <div className="min-h-screen bg-transparent text-white pt-24 pb-16">
            <div className="max-w-3xl mx-auto px-4">
                <div className="mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-cyan-400/10 text-cyan-400 rounded-full mb-5 border border-cyan-400/20">
                        <CalendarCheck size={24} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Club <span className="text-cyan-400">sessions</span>
                    </h1>
                    <p className="text-neutral-400">
                        {upcoming.length === 0
                            ? "Nothing scheduled right now."
                            : `${upcoming.length} coming up.`}
                    </p>
                </div>

                {canCreate && (
                    <div className="mb-6">
                        <CreateSession />
                    </div>
                )}

                {upcoming.length === 0 && past.length === 0 && (
                    <div className="glass rounded-2xl p-10 text-center">
                        <p className="text-neutral-400">No sessions yet.</p>
                        <p className="text-sm text-neutral-600 mt-1">
                            Admins and mentors can schedule them.
                        </p>
                    </div>
                )}

                <div className="space-y-3">
                    {upcoming.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            attending={counts.get(event.id) ?? 0}
                            going={mine.has(event.id)}
                        />
                    ))}
                </div>

                {past.length > 0 && (
                    <>
                        <h2 className="text-xs uppercase tracking-wider text-neutral-600 mt-12 mb-4">
                            Past sessions
                        </h2>
                        <div className="space-y-3 opacity-60">
                            {past.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    attending={counts.get(event.id) ?? 0}
                                    going={mine.has(event.id)}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function EventCard({
    event,
    attending,
    going,
}: {
    event: ClubEvent;
    attending: number;
    going: boolean;
}) {
    const full = event.capacity !== null && attending >= event.capacity;

    return (
        <div className="glass glass-hover rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-xs font-mono text-cyan-400 mb-1.5">
                        {when.format(new Date(event.startsAt))}
                    </p>
                    <h3 className="font-bold text-white">{event.title}</h3>
                    <p className="text-sm text-neutral-400 mt-1">{event.summary}</p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                        <span className="inline-flex items-center gap-1.5">
                            <MapPin size={12} />
                            {event.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <Users size={12} />
                            <span className="font-mono tabular-nums">{attending}</span>
                            {event.capacity !== null && (
                                <span className="text-neutral-600">/ {event.capacity}</span>
                            )}
                            {" going"}
                        </span>
                    </div>
                </div>

                <div className="flex-shrink-0">
                    <RsvpButton
                        eventId={event.id}
                        initiallyGoing={going}
                        full={full}
                        past={isPast(event)}
                    />
                </div>
            </div>
        </div>
    );
}
