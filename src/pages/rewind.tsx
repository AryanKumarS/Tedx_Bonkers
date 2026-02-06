"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Footer from "@/components/Footer/Footer";
import DomeGallery from "@/components/DomeGallery/DomeGallery.jsx";

// --- DATA OBJECT (All Years) ---
const yearContent: {
  [key: number]: {
    theme: string;
    description: string;
    themeImage: string;
    speakers: Array<{
      name: string;
      topic: string;
      image: string;
      tedTalkUrl: string;
      imagePosition?: string;
    }>;
    themeImageScale?: number;
  };
} = {
  2025: {
    theme: "Inverso Clesiddra",
    description: "As time folds, perspectives unfold.",
    themeImage: "/rewind/25.webp",
    themeImageScale: 1.65,
    speakers: [
      {
        name: "Tirth Parsana",
        topic: "Aham Brahmasmi",
        image: "/rewind/25/tirth.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=5CAXlKPZTHA",
      },
      {
        name: "Sneha Chakraborty",
        topic: "Flow over Fear",
        image: "/rewind/25/sneha.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=KGWfQHL1HmY",
      },
      {
        name: "Palakh Khanna",
        topic: "Flipping the narrative",
        image: "/rewind/25/palakh.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=B3raZ8P1frI",
      },
      {
        name: "Nainika Mukherjee",
        topic: "Trust the Process: The Power of Movement",
        image: "/rewind/25/nainika.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=NYocIjAxXl4",
      },
      {
        name: "Manas Chopra",
        topic: "Why Community Building is the Key to Personal Growth",
        image: "/rewind/25/manas.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=SUU0WteEYus",
      },
      {
        name: "Humaira Mushtaq",
        topic: "Architect of Her Own Reality",
        image: "/rewind/25/humaira.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=wA-Pmcz8HvI",
      },
      {
        name: "Dr. Gajendra Purohit",
        topic: "The Timeless Equation",
        image: "/rewind/25/gajendra.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=2WmABjM2gSw",
      },
      {
        name: "Dr. Mitali Rathod",
        topic: "Navigating Adulthood",
        image: "/rewind/25/uterus.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=PfxqMAC-39A",
      },
      {
        name: "Amit Dubey",
        topic: "Whispers of the Web",
        image: "/rewind/25/amit.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=6MHYtNKaC1k",
      },
      {
        name: "Aiman Khan",
        topic: "Timeless Influence",
        image: "/rewind/25/aiman.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=gjecwTZgvo0",
      },
      {
        name: "Dr. L Venakata Subramaniam",
        topic: "India's Time",
        image: "/rewind/25/venkata.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=JYlIMogFDi8",
      },
    ],
  },
  2024: {
    theme: "Saptaranga",
    description: "Where Spectrums Unite",
    themeImage: "/rewind/24.webp",
    speakers: [
      {
        name: "Nikita Sharma",
        topic: "You Are It",
        image: "/rewind/24/nikita.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=goCrg3YuQmA",
        imagePosition: "10% 10%",
      },
      {
        name: "Dr Vijender Chauhan",
        topic: "No Success is Monocolor",
        image: "/rewind/24/vijender.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=LdK_eQExh1M",
      },
      {
        name: "Gaurav Juyal",
        topic: "Drapery and How It is Awesome",
        image: "/rewind/24/Gaurav.webp",
        tedTalkUrl: "",
      },
      {
        name: "Siddharth Jain",
        topic: "Finding Your Superpower",
        image: "/rewind/24/sid.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=l7w3bUkyFb0",
      },
      {
        name: "Devyani Sharma",
        topic: "Life Driven by Dance",
        image: "/rewind/24/devyani.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=WHZBHGE7b-g",
      },
      {
        name: "Akshay Chopra",
        topic: "From Nothing to Something",
        image: "/rewind/24/akshay.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=vkTNMjEYoh0",
      },
      {
        name: "Navin Reddy",
        topic: "The New Way of Learning Tech",
        image: "/rewind/24/navin.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=YBe4EE8QIAU",
      },
      {
        name: "Vipin Mishra",
        topic: "In The Zone",
        image: "/rewind/24/vipin.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=YIO37VZ8Zvg",
      },
      {
        name: "Padamjeet Sehrawat",
        topic: "You Are Your Best Answer",
        image: "/rewind/24/pad.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=pQF-tUolRGc",
      },
      {
        name: "Nirbhik Datta",
        topic: "Unveiling the Subconscious",
        image: "/rewind/24/nirbhik.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=zAKyzgdkOA4",
      },
      {
        name: "Aditya Goela CFA",
        topic: "How CFA Course Changed my Life",
        image: "/rewind/24/aditya.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=thR82rUg8VI",
      },
      {
        name: "Dr Kausar Shah",
        topic: "Dark Sides of Confident Leadership",
        image: "/rewind/24/kausar.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=Y7MdhKjFCOk",
      },
      {
        name: "Shivani Kalra",
        topic: "Because I Said No",
        image: "/rewind/24/shi.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=mKexuy238zA",
      },
    ],
  },
  2023: {
    theme: "T.H.I.N.C",
    description: "Transform, Hustle, Introspect, Nurture and Create",
    themeImage: "/rewind/23.webp",
    speakers: [
      {
        name: "Aastha Tiwari",
        topic: "The Heart Way or the Hard Way",
        image: "/rewind/THINC/11.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=xZzVeKW_3yU",
      },
      {
        name: "Dr. Aqsa Shaikh",
        topic: "The White Coat Has A Rainbow",
        image: "/rewind/THINC/12.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=1ckPQR64wwM",
      },
      {
        name: "Anuranjita Kumar",
        topic: "Can I Have It All",
        image: "/rewind/THINC/8.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=frWC8qmCuOQ",
      },
      {
        name: "Deepak Pareek",
        topic: "No Guts, No Glory!",
        image: "/rewind/THINC/9.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=kdIOiNHyDyM",
      },
      {
        name: "Ganesh Sahai",
        topic: "P-3 Way To Innovation",
        image: "/rewind/THINC/3.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=FZS-RSRl73w",
      },
      {
        name: "Harsh Goela",
        topic: "Stories in Stock Markets",
        image: "/rewind/THINC/10.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=6DItV7xFDSQ",
      },
      {
        name: "Nishtha Khushu",
        topic: "The Dancing Dream",
        image: "/rewind/THINC/6.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=M2fb3S9DTj8",
      },
      {
        name: "Pravishi Das",
        topic: "Be the Sun",
        image: "/rewind/THINC/1.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=cuoNArh218Y",
      },
      {
        name: "Sanghamitra Bose",
        topic: "The Invisible Children",
        image: "/rewind/THINC/2.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=nd6vtdczD04",
      },
      {
        name: "Sushma Gaikwad",
        topic: "Awaken The Warrior Within",
        image: "/rewind/THINC/7.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=_pXgXRKmpXE",
      },
      {
        name: "Tapesh Kumar",
        topic: "Stories of Failure",
        image: "/rewind/THINC/4.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=4hafBaWCifU",
      },
      {
        name: "Vijay Prakash Sharma",
        topic: "Music is my passion",
        image: "/rewind/THINC/5.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=TGNYCxoUQWU",
      },
    ],
  },
  2022: {
    theme: "Parvaaz",
    description: "Azaad. Aagaaz. Aseem",
    themeImage: "/rewind/22.webp",
    speakers: [
      {
        name: "Kevin Missal",
        topic: "Space Exploration",
        image: "/rewind/Parvaaz/kevin_missal.webp",
        tedTalkUrl: "",
      },
      {
        name: "Harish Mehta",
        topic: "Joy of Failing",
        image: "/rewind/Parvaaz/Harish_Mehta.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=u4KNmBXKe-4",
      },
      {
        name: "Supreet Singh Arora",
        topic: "Personal Identity",
        image: "/rewind/Parvaaz/Author_sherry.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=cxGsANXP3OQ",
      },
      {
        name: "Lakshay Jangid",
        topic: "Patience on one wheel",
        image: "/rewind/Parvaaz/lakshay.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=7sXgpj_Co9I",
      },
      {
        name: "Major General D.Bipin Bakshi",
        topic: "Seeking new horizons",
        image: "/rewind/Parvaaz/maj.webp",
        tedTalkUrl: "",
      },
      {
        name: "Rakshit Tandon",
        topic: "Blockchain",
        image: "/rewind/Parvaaz/Rakshit_Tandon.webp",
        tedTalkUrl: "",
      },
      {
        name: "Ridhi Khakhar",
        topic: "Carving your own path",
        image: "/rewind/Parvaaz/ridhi.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=fA6ady8Xrq8",
      },
      {
        name: "Sagar Lalwani",
        topic: "Take the risk",
        image: "/rewind/Parvaaz/Sagar_Lalwani.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=Fg9ixhDzPEo",
      },
      {
        name: "Sangeeta Sindhi Bahl",
        topic: "Become who you aspire",
        image: "/rewind/Parvaaz/sangeeta.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=7-8v_IM7OKs",
      },
      {
        name: "Srikanth Velamakanni",
        topic: "Magic behind AI",
        image: "/rewind/Parvaaz/srikant.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=PuyKr-jnguA",
      },
      {
        name: "Yoga Bhabagna Jonala",
        topic: "Classical Dancing",
        image: "/rewind/Parvaaz/yoga.webp",
        tedTalkUrl: "",
      },
    ],
  },
  2021: {
    theme: "Swadhyaya",
    description: "An interview with oneself",
    themeImage: "/rewind/21.webp",
    speakers: [
      {
        name: "Aabir Vyas",
        topic: "Hard Work",
        image: "/rewind/Swadhyaya/aabir_vyas.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=ftMj6E4wX60",
      },
      {
        name: "Abhash Jha",
        topic: "I Helped Myself",
        image: "/rewind/Swadhyaya/Abhash_Jha.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=k_FdxLP2qIk",
      },
      {
        name: "Anirban Bhattacharyya",
        topic: "Morning Raaga",
        image: "/rewind/Swadhyaya/anirban_bhattacharyya.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=jsX0MMr35lk",
      },
      {
        name: "Avinash Singh",
        topic: "Prosper. Or Perish",
        image: "/rewind/Swadhyaya/Avinash_Singh.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=IiVl2UgszFc",
      },
      {
        name: "EPR Iyer",
        topic: "Hip Hop Empowers",
        image: "/rewind/Swadhyaya/EPR_Iyer.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=IaHkabRhBq4",
      },
      {
        name: "Richie Mehta",
        topic: "The Meaning of...",
        image: "/rewind/Swadhyaya/Richie_Mehta.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=N_8CsLScgKg",
      },
      {
        name: "Vanndana Vaadera",
        topic: "Mental Workouts",
        image: "/rewind/Swadhyaya/vanndana_vaadera.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=bB97hvh-7sI",
      },
    ],
  },
  2020: {
    theme: "Quo Vadis",
    description: "Where are we headed?",
    themeImage: "/rewind/20.webp",
    speakers: [
      {
        name: "Aditya Bhandari",
        topic: "Young India",
        image: "/rewind/QuoVadis/Aditya_Bhandari.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=N2Xnkg4OP2w",
      },
      {
        name: "As We Keep Searching",
        topic: "Musical Performance",
        image: "/rewind/QuoVadis/aswekeepsearching.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=3YOpdfr-agQ",
      },
      {
        name: "Chameli Debnath",
        topic: "Kathak",
        image: "/rewind/QuoVadis/Chameli_Debnath.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=aCQv_A2wxrw",
      },
      {
        name: "Manoj Keshwar",
        topic: "Life Lessons",
        image: "/rewind/QuoVadis/manoj_keshwar.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=3YOpdfr-agQ",
      },
      {
        name: "Manraj Singh & Arpit Vyas",
        topic: "What Goes Around",
        image: "/rewind/QuoVadis/msingh_avyas.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=JeH9v7ohjWc",
      },
      {
        name: "Shalin IPS",
        topic: "Connected by Consumption",
        image: "/rewind/QuoVadis/shalin_IPS.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=sSqYNOIvoI8",
      },
      {
        name: "Sugata Mitra",
        topic: "Future of Work",
        image: "/rewind/QuoVadis/Sugata_mitra.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=jrH3_NANVJA",
      },
      {
        name: "Sushruthi Krishna",
        topic: "Success story",
        image: "/rewind/QuoVadis/Sushruthi-Krishna.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=3YOpdfr-agQ",
      },
      {
        name: "Tirthak Saha",
        topic: "Sustainability",
        image: "/rewind/QuoVadis/Tirthak_Saha.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=GBplgW4c3gY",
      },
      {
        name: "Zoe Modgill",
        topic: "Strength is an Inside Job",
        image: "/rewind/QuoVadis/Zoe_Modgill.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=_JAWKCanBTA",
      },
    ],
  },
  2019: {
    theme: "Sparking Metanoia",
    description: "",
    themeImage: "/rewind/19.webp",
    speakers: [
      {
        name: "Atif Khan",
        topic: "Drones",
        image: "/rewind/Sparking/atif_khan.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=VaegXWjUhN0",
      },
      {
        name: "Digital Gandhi",
        topic: "Love",
        image: "/rewind/Sparking/digital-gandhi.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=umH9yka1siY",
      },
      {
        name: "Salman Khurshid",
        topic: "Mind of a Judge",
        image: "/rewind/Sparking/Salman_Khurshid.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=ZljJEjJ7n_g",
      },
      {
        name: "Richard Rekhy",
        topic: "Leading from Heart",
        image: "/rewind/Sparking/Richard_Rekhy.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=PjrM3G8PCb8",
      },
      {
        name: "Sangeeta Sindhi Bahl",
        topic: "Setbacks",
        image: "/rewind/Sparking/sangeeta-bahl.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=ysYik6Ptfy4",
      },
      {
        name: "Nidhi Lauria",
        topic: "Generosity",
        image: "/rewind/Sparking/Nidhi_Lauria.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=umH9yka1siY",
      },
      {
        name: "Sanchit Batra",
        topic: "Illusion",
        image: "/rewind/Sparking/Sanchit_Batra.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=0qsQpUJv-Ck",
      },
      {
        name: "Kamal Morya",
        topic: "Dance",
        image: "/rewind/Sparking/Kamal_Morya.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=B8QRhZi_PVk",
      },
      {
        name: "Siya Jain",
        topic: "Kathak",
        image: "/rewind/Sparking/siya-jain.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=1i2Fruw4Vf4",
      },
      {
        name: "Lt Gen Vinod Bhatia",
        topic: "Who Dares Wins",
        image: "/rewind/Sparking/Vinod_Bhatia.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=4wa3XDh72lE",
      },
    ],
  },
  2018: {
    theme: "The Precipice",
    description: "On the brink of change",
    themeImage: "/rewind/18.webp",
    speakers: [
      {
        name: "Prasanth Nori",
        topic: "Education",
        image: "/rewind/Precipice/Prasanth_Nori.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=zxusiA7UsHI",
      },
      {
        name: "Nimisha Verma",
        topic: "Isolation",
        image: "/rewind/Precipice/Nimisha_Verma.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=RsqOdZepzVs",
      },
      {
        name: "Anuv Jain",
        topic: "Sadness",
        image: "/rewind/Precipice/anuv_jain.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=fAYaSIMsxQs",
      },
      {
        name: "Dr Ananta Singh",
        topic: "Leadership",
        image: "/rewind/Precipice/Ananta_Singhi.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=BjRjuQnmJLY",
      },
      {
        name: "Sushant Kalra",
        topic: "Child Abuse",
        image: "/rewind/Precipice/sushant_kalra.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=tZoxCmda56I",
      },
      {
        name: "Maj Gen. Umang Sethi",
        topic: "We Before I",
        image: "/rewind/Precipice/Umang_Sethi.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=nZkhF12fO8c",
      },
      {
        name: "Narayani Gupta",
        topic: "Past",
        image: "/rewind/Precipice/narayanai-gupta.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=yc8-XT-awzY",
      },
      {
        name: "Pankhuri Gidwani",
        topic: "Stereotypes",
        image: "/rewind/Precipice/pankhuri_gidwani.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=XmE4mk8x00s",
      },
      {
        name: "Dr Prem Atreja",
        topic: "Health",
        image: "/rewind/Precipice/Prem_Atreja.webp",
        tedTalkUrl: "https://www.youtube.com/watch?v=531nxrBke88",
      },
    ],
  },
};

// --- COMPONENT: YEAR SECTION ---
const YearSection = ({
  year,
  data,
  onInView,
  imageRef,
}: {
  year: number;
  data: (typeof yearContent)[number];
  onInView: (year: number) => void;
  imageRef?: React.RefObject<HTMLDivElement>;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (isInView) {
      onInView(year);
    }
  }, [isInView, year, onInView]);

  return (
    <section
      id={`year-section-${year}`}
      ref={ref}
      className="min-h-screen py-24 relative border-b border-white/5 z-10"
    >
      <div className="container mx-auto px-4 relative ml-0 md:ml-20 flex flex-col items-center md:block md:items-start">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-16 w-full">
          <div
            ref={imageRef}
            className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-video rounded-2xl overflow-hidden border-2 border-cyan-500/20 shadow-2xl group"
          >
            <Image
              src={data.themeImage}
              alt={data.theme}
              fill
              unoptimized={data.themeImage.startsWith("http")}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              style={{
                transform: data.themeImageScale
                  ? `scale(${data.themeImageScale})`
                  : "scale(1)",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-6 left-6">
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-2">
                {year}
              </h2>
              <h3 className="text-2xl md:text-3xl text-cyan-400 font-light">
                {data.theme}
              </h3>
            </div>
          </div>
          <div className="w-full md:w-1/2 pb-6">
            <p className="text-xl md:text-2xl text-cyan-100/80 italic border-l-4 border-cyan-500 pl-6">
              "{data.description}"
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-16 place-items-center md:place-items-start">
          {data.speakers.map((speaker, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group w-full max-w-[280px]"
            >
              {/* Frameless Image Container */}
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg mb-4">
                <Image
                  src={speaker.image}
                  alt={speaker.name}
                  fill
                  unoptimized={speaker.image.startsWith("http")}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    objectPosition: speaker.imagePosition || "center",
                  }}
                />
              </div>

              {/* Text Content Below */}
              <div>
                <h4 className="font-bold text-white text-xl mb-1">
                  {speaker.name}
                </h4>
                <p className="text-cyan-400 text-sm mb-2">{speaker.topic}</p>
                {speaker.tedTalkUrl && (
                  <a
                    href={speaker.tedTalkUrl}
                    target="_blank"
                    className="text-sm text-gray-400 hover:text-white underline underline-offset-4 decoration-cyan-500/50 hover:decoration-cyan-400 transition-colors"
                  >
                    Watch Talk &rarr;
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function RewindPage() {

  const imageRef = useRef<HTMLDivElement>(null);
  const [activeYear, setActiveYear] = useState(2025);

  // Ref for hero section
  const heroRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;
        setIsSticky(window.scrollY > heroBottom - 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  const sortedYears = Object.keys(yearContent)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      <main className="relative bg-black text-white min-h-screen">
        {/* HERO SECTION */}
        <div
          ref={heroRef}
          className="relative h-[80vh] w-full overflow-hidden bg-black flex items-center justify-center"
        >
          {/* Dome Gallery Background */}
          <div className="absolute inset-0">
            <DomeGallery
              fit={0.7}
              minRadius={800}
              grayscale={false}
              overlayBlurColor="rgba(0,0,0,0.5)"
            />
          </div>

          {/* Hero Content Overlay */}
          <div className="relative z-10 text-center px-6 pointer-events-none">
            <motion.h1
              className="text-6xl md:text-8xl font-bold leading-tight mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              TEDx <span className="text-[#FF3A3A]">Rewind</span>
            </motion.h1>
          </div>
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-start gap-12 px-6 md:px-12">
          {/* MOBILE YEAR SELECTOR */}
          <div className="md:hidden w-full mb-2 sticky top-20 z-40">
            <div className="flex overflow-x-auto gap-3 py-4 px-2 no-scrollbar bg-black/60 backdrop-blur-xl border-b border-white/10 -mx-6 px-6">
              {sortedYears.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-4 py-2 rounded-full text-base font-bold transition-all whitespace-nowrap
                    ${
                      activeYear === year
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                        : "text-gray-400 hover:text-white border border-transparent"
                    }
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* LEFT COLUMN: Main Content (Tab View) */}
          <div className="flex-1 min-h-[60vh] max-w-7xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeYear}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <YearSection
                  year={activeYear}
                  data={yearContent[activeYear]}
                  onInView={() => {}}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT COLUMN: Placeholder for Layout + The Selector */}
          <div className="hidden md:flex flex-col w-32 lg:w-48 relative shrink-0 ml-12 md:ml-24 mr-8 md:mr-32 min-h-[200px]">
            {/* Layout placeholder to keep width reservation. Content only appears when isSticky and footer is not visible. */}
            <AnimatePresence>
              {isSticky && !footerVisible && (
                <motion.div
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: 50,
                    scale: 0.9,
                    transition: { duration: 0.2 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="fixed top-32 lg:top-40 right-8 md:right-32 z-50 w-32 lg:w-48"
                >
                  <div className="relative flex flex-col gap-1.5 px-6 py-14 bg-black/60 backdrop-blur-2xl border-2 border-white/60 shadow-[0_0_40px_rgba(34,211,238,0.1)]">
                    {/* Decorative Markers */}
                    {/* Corners */}
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white/80 rotate-45 shadow-[0_0_10px_white]" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rotate-45 shadow-[0_0_10px_white]" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white/80 rotate-45 shadow-[0_0_10px_white]" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/80 rotate-45 shadow-[0_0_10px_white]" />

                    {/* Midpoints */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rotate-45" />
                    <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rotate-45" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white/60 rotate-45" />
                    <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-1.5 h-1.5 bg-white/60 rotate-45" />

                    {sortedYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => setActiveYear(year)}
                        className={`relative flex items-center justify-center p-1.5 text-xl lg:text-[1.75rem] font-bold tracking-wide transition-all duration-300 w-full group font-serif
                          ${
                            activeYear === year
                              ? `text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`
                              : `text-gray-500 hover:text-gray-300 hover:scale-105`
                          }
                        `}
                      >
                        {activeYear === year && (
                          <motion.div
                            layoutId="activeGlow"
                            className="absolute inset-0 bg-white/5 blur-xl rounded-full -z-10"
                            transition={{ duration: 0.3 }}
                          />
                        )}
                        {year}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      <div ref={footerRef}>
        <Footer />
      </div>
    </div>
  );
}
