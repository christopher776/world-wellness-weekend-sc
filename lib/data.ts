export interface PaymentLink {
  linkId: string;
}

export const AUTHORIZE_NET_ACTION =
  "https://Simplecheckout.authorize.net/payment/CatalogPayment.aspx";

export const rentals = {
  treatmentRoom: {
    name: "Treatment Room Rental",
    price: "$1,000",
    unit: "Per Day",
    description:
      "Have a private treatment room to showcase your services, offer mini treatments or consultations, and connect one-on-one with attendees in a serene setting.",
    linkId: "cae883ee-a946-4278-b4c0-b632d98a75cf",
  },
  businessRoom: {
    name: "Business Room Rental",
    description:
      "Host workshops, educational sessions, panel discussions or CEC-accredited classes. Ideal for product training, business presentations and interactive learning.",
    perfectFor: [
      "Continuing Education Classes (CECs)",
      "Product Education",
      "Wellness Workshops",
      "Business Meetings & Trainings",
      "Panel Discussions",
      "Group Coaching & More",
    ],
    options: [
      { price: "$500", linkId: "42b89e3c-45d6-4f8d-82dd-040eb30ae1fa" },
      { price: "$750", linkId: "79d6df69-0574-4727-8438-f9c19e498a17" },
    ],
  },
};


export const associationBenefits = [
  "Founding Member designation",
  "Networking with South Carolina's spa, wellness, fitness, hospitality, beauty & medical professionals",
  "Invitations to member-only networking receptions & educational programs",
  "Business referrals & partnership opportunities",
  "Professional development & continuing education opportunities",
  "Recognition on the Association website as a Founding Member",
  "Priority access to future South Carolina Wellness Weekend events",
  "Opportunity to help shape the future of South Carolina's wellness industry",
];

export const wellnessClasses = [
  "Yoga",
  "Pilates",
  "Cycling",
  "Barre",
  "Meditation",
  "Breathwork",
  "Dance Fitness",
  "Recovery",
  "Sound Healing",
  "Mobility",
];

export const whyCharleston = [
  "Historic, walkable downtown",
  "World-class dining, boutiques & attractions",
  "Southern hospitality at its finest",
  "Easy access to the venue",
  "The perfect backdrop for wellness and community",
];

// VIP Tickets — per the "VIP Tickets" doc tab: $100, 100 tickets available.
export const vipTicket = {
  price: "$100",
  ticketsAvailable: 100,
  description:
    "Priority access, a VIP Opening Night Party in the Francis Marion Hotel's historic Carolina Ballroom, and exclusive experiences throughout South Carolina Wellness Weekend — designed for guests who want the full weekend at its best.",
  inclusions: [
    "VIP Opening Night Party in the historic Carolina Ballroom",
    "Priority registration & seating at all general sessions and classes",
    "VIP spa & wellness gift bag valued at $250 or more",
    "Branded South Carolina Wellness Weekend yoga mat",
    "Access to VIP-only classes and experiences",
    "Sponsor gifts and exclusive experiences",
  ],
  linkId: "dab6ea0e-9422-4739-82fc-44c2d9fb714c",
};

// Speaker topics — the categories we're actively recruiting speakers for.
// Combines the organizer's requested specialties with additional
// high-interest wellness topics researched from current wellness industry
// conferences (Global Wellness Summit 2026 Trends, McKinsey Future of
// Wellness survey) — longevity/peptides, functional medicine, women's
// health, mental health, sleep science, and wellness travel are all
// currently trending topics with strong community draw.
export const speakerTopics = [
  "Chiropractic Care",
  "Dental & Oral Health",
  "Dermatology & Skincare",
  "The Business of Wellness",
  "Art Therapy",
  "Peptide Therapy & Longevity",
  "Gardening for Wellness",
  "Music & Sound Healing",
  "Wellness Travel Planning",
  "Functional & Integrative Medicine",
  "Women's Health & Hormone Balance",
  "Mental Health & Mindfulness",
  "Sleep Science & Recovery",
  "Nutrition & Gut Health",
  "Corporate & Workplace Wellness",
  "Reiki & Energy Healing",
];

// AI-generated Charleston imagery used across the homepage, Hotel & Travel,
// and Teach/Speak pages.
export const charlestonImages = {
  historicStreet:
    "https://g.tlcdn.com/gen/794ea8e4893c45f99c550863512ff258.png",
  carriageTour:
    "https://g.tlcdn.com/gen/2d09696133304c04abfca93d0500d263.png",
  ballroom: "https://g.tlcdn.com/gen/0928f3fc3ba64e6fbd64d0d5f6a8e5ae.png",
  waterfront: "https://g.tlcdn.com/gen/42e9d080741e499fb0bdd2d9db0386d6.png",
  rainbowRow: "https://g.tlcdn.com/gen/2a04c138e6db45a09acbf17bc8a266ab.png",
  gaslitAlley: "https://g.tlcdn.com/gen/3f66548cc0904b2c9ca3929b00f2fdb8.png",
  batteryPark: "https://g.tlcdn.com/gen/9356e53707d34bacad093c4983b07b45.png",
};

// Francis Marion Hotel facts — sourced from historichotels.org and the
// hotel's own event-space page (francismarionhotel.com/event-space-details).
export const francisMarionHotel = {
  yearBuilt: 1924,
  architecture: "Beaux-Arts",
  historicHotelsOfAmericaSince: 1999,
  nationalRegisterYear: 1984,
  roomCount: 235,
  eventSpaces: [
    {
      name: "Carolina Ballroom & Mezzanine",
      description:
        "The hotel's largest and most flexible event space, added in 2004, blending historical charm with a modern feel. This is where the VIP Opening Night Party will take place.",
      occupancy: "Up to 350 seated · 500 reception style",
      isVip: true,
    },
    {
      name: "Colonial Ballroom",
      description:
        "The hotel's original dining room just off the grand lobby, featuring eight expansive Palladian windows overlooking Marion Square and a striking fireplace.",
      occupancy: "200 seated · 250 reception style",
    },
    {
      name: "Gold Ballroom",
      description:
        "Adorned with handcrafted trim, hardwood floors, and crystal chandeliers, with an orchestra balcony overlooking the room — home to several of the weekend's speaker sessions.",
      occupancy: "130 seated · 200 reception style",
    },
  ],
};
