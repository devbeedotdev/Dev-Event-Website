export interface EventItem {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventItem[] = [
  {
    title: "ReactConf 2026",
    image: "/images/event1.png",
    slug: "reactconf-2026",
    location: "Las Vegas, Nevada",
    date: "May 12-14, 2026",
    time: "09:00 AM",
  },
  {
    title: "Web Summit Berlin",
    image: "/images/event2.png",
    slug: "web-summit-berlin",
    location: "Berlin, Germany",
    date: "June 1-3, 2026",
    time: "08:30 AM",
  },
  {
    title: "Node.js Conference Europe",
    image: "/images/event3.png",
    slug: "nodejs-conf-europe",
    location: "Dublin, Ireland",
    date: "March 15-17, 2026",
    time: "10:00 AM",
  },
  {
    title: "TypeScript Congress",
    image: "/images/event4.png",
    slug: "typescript-congress",
    location: "Amsterdam, Netherlands",
    date: "April 8-10, 2026",
    time: "09:30 AM",
  },
  {
    title: "DevOps Days Toronto",
    image: "/images/event5.png",
    slug: "devops-days-toronto",
    location: "Toronto, Canada",
    date: "May 20-21, 2026",
    time: "08:00 AM",
  },
  {
    title: "JavaScript World Conference",
    image: "/images/event6.png",
    slug: "js-world-conference",
    location: "Singapore",
    date: "July 5-7, 2026",
    time: "09:00 AM",
  },
];
