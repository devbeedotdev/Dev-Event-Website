import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";

import { Event } from "@/types/event.types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function HomePage() {
  const response = await fetch(`${BASE_URL}/api/events`);
  const {data : events } = await response.json();

  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br />
        Event you can&apos;t miss
      </h1>
      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />
      <div className="mt-20 space-y-7"></div>
      <h3 className="h-15">Featured Events</h3>
      <ul className="events">
        {events.map((event : Event ) => (
          <li key={event.slug}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomePage;
