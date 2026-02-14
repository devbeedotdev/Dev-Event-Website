"use client";
import { Event } from "@/types/event.types";
import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";



function EventCard({ image, title, slug, location, date, time }: Event) {
  const handleClick = () => {
    posthog.capture("event_card_clicked", {
      event_title: title,
      event_slug: slug,
      event_location: location,
      event_date: date,
    });
  };
  const path = slug ? `/events/${slug}` : "/events";
  console.log(path);
  return (
    <Link
      href={path}
      id="event-card"
      onClick={handleClick}
      className="block group" // Adding 'block' here is the magic fix for cursors
    >
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          width={410}
          height={300}
          className="poster transition-transform group-hover:scale-105"
          loading="eager"
        />
      </div>
      <div className="flex flex-row gap-2 pt-3">
        <Image src="/icons/pin.svg" alt="location" width={14} height={14} />
        <p>{location}</p>
      </div>
      <p className="title">{title} </p>
      <div className="datetime">
        <div>
          <Image src="/icons/calendar.svg" alt="date" width={14} height={14} />
          <p>{date}</p>
        </div>
        <div>
          <Image src="/icons/clock.svg" alt="time" width={14} height={14} />
          <p>{time}</p>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
