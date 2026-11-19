"use client";
import React from "react";
import Image from "next/image";
import RotatingText from "./ui/RotatingText/RotatingText";
import { MyStoryModal } from "./MyStoryModal";

const Banner = () => {
  return (
    <div className="px-4 md:px-30 h-[92vh] flex flex-col sm:flex-row sm:items-center relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start h-full sm:w-1/2 relative border-b border-white sm:border-none">
        <div className="absolute top-40 z-10 flex flex-col gap-4">
          <h1 className="font-poppins font-extrabold text-5xl md:text-7xl ">
            Akramul <br /> Islam
          </h1>
          <hr />
        </div>
        <Image
          src={"/Hero.png"}
          alt="Hero Image"
          width={450}
          height={200}
          className="absolute left-15 top-5 sm:left-50 bottom-0 sm:top-15"
        />
      </div>
      {/* Right-Side */}
      <div className="flex flex-col justify-center gap-4 text-3xl md:text-5xl sm:w-1/2 z-50">
        <h1>I am a </h1>
        <RotatingText
          texts={[
            "Cybersecurity Expert",
            "Ethical Hacker",
            "Digital Forensics Specialist",
          ]}
          mainClassName="px-2 sm:px-2 md:px-3 bg-cyan-300 text-xl sm:text-5xl font-bold text-black overflow-hidden py-0.5 sm:py-1 md:py-2 w-fit rounded-lg"
          staggerFrom="last"
          staggerDuration={0.025}
          splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
          rotationInterval={3000}
        />
        <p className="text-sm">
          Dedicated cybersecurity professional based in Dhaka, Bangladesh with
          expertise in identifying, analyzing, and mitigating security threats
          across digital landscapes. Combining technical precision with
          strategic insight to protect organizational assets and data integrity.
        </p>
        <MyStoryModal />
      </div>

      {/* Left-Side */}
    </div>
  );
};

export default Banner;
