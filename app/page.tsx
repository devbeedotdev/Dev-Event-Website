import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";



function HomePage() {
  return (
    <section>
      <h1 className="text-center">
        The Hub for Every Dev <br />
        Event you can&apos;t miss
      </h1>
      <p className="text-center mt-5">
        {" "}
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />
      <div className="mt-20 space-y-7"></div>
      <h3 className="h-15">Featured Events</h3>
      <ul className="events">
        {events.map((event) => (
          <li key={event.image}>
            <EventCard
              title={event.title}
              image={event.image}
              slug={event.slug}
              location={event.location}
              date={event.date}
              time={event.time}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default HomePage;
