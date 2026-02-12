"use client";
import Image from "next/image";
import posthog from "posthog-js";

function ExploreBtn() {
  const handleClick = () => {
    posthog.capture("explore_events_clicked");
  };

  return (
    <button
      type="button"
      id="explore-btn"
      className="mt-7 mx-auto"
      onClick={handleClick}
    >
      <a href="#events">
        Explore Events
        <Image
          src="icons/arrow-down.svg"
          alt="down_icon"
          width={24}
          height={24}
        />
      </a>
    </button>
  );
}

export default ExploreBtn;
