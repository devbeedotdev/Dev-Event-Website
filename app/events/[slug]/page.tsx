import BookEvent from "@/components/BookEvent";
import EventCard from "@/components/EventCard";
import { getSimilarEvent } from "@/lib/actions/event.actions";
import { formatDate } from "@/lib/utils";
import { Event } from "@/types/event.types";
import Image from "next/image";
import { notFound } from "next/navigation";

function EventDetailItem({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) {
  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} width={17} height={17} alt={alt} />
      <p>{label}</p>
    </div>
  );
}

function EventTags({ tags }: { tags: Array<string> }) {
  return (
    <div className="flex flex-row gap-1.5 flex-wrap">

      
        {tags.map((tag) => (
          <div className="pill" key={tag}>{tag}</div>
        ))}
      
    </div>
  );
}

function EventAgenda({ agendaItems }: { agendaItems: Array<string> }) {
  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {agendaItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

async function EventDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const bookings = 10;

  const similarEvents : Array<Event> = await getSimilarEvent(slug)

  const request = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/events/${slug}`,
  );
  const event: Event = await request.json();
  console.log("This is an " + event.description);

  if (!event) return notFound();

  return (
    <section id="event">
      <div className="header">
        <h1>
          Event Description
          <p>{event.description}</p>
        </h1>
      </div>
      <div className="details">
        {/* Left Side - Event Content */}
        <div className="content">
          <Image
            src={event.image}
            alt="Event Banner"
            width={800}
            height={800}
            className="banner"
          />
          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{event.overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <h2>Event Details</h2>
            <EventDetailItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={formatDate(event.date)}
            />
            <EventDetailItem
              icon="/icons/clock.svg"
              alt="clock"
              label={event.time}
            />
            <EventDetailItem
              icon="/icons/pin.svg"
              alt="pin"
              label={event.location}
            />
            <EventDetailItem
              icon="/icons/mode.svg"
              alt="mode"
              label={event.mode}
            />
            <EventDetailItem
              icon="/icons/audience.svg"
              alt="audience"
              label={event.audience}
            />
          </section>
          <EventAgenda agendaItems={event.agenda} />
          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{event.organizer}</p>
          </section>

          <EventTags tags={event.tags} />
        </div>
        {/* Right Side - Booking Form */}
        <aside className="booking">
            <div className="signup-card">
                <h2>Book your spot</h2>
                {bookings > 0 ? (<p className="text-sm">Join {bookings} people who have already booked their spot</p>)  : 
                (<p className="text-sm">Be the first to book youe spot!</p>)
                }

                <BookEvent/>
            </div>
        
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
            {similarEvents.length > 0  && similarEvents.map((eachEvent) => (<EventCard key={eachEvent.id} {...eachEvent} />))}
        </div>
      </div>
    </section>
  );
}

export default EventDetailsPage;
