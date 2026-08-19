// Shared schema describing every admin-editable content type. Both the
// admin forms (client) and the API routes (server) read from this single
// source of truth, so adding a field only requires editing this file.

export type FieldType = "text" | "textarea" | "checkbox" | "image" | "date";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  helpText?: string;
  /** Optional row count override for textarea fields (default 4). */
  rows?: number;
}

export interface ContentTypeDef {
  slug: string;
  label: string;
  sheetName: string;
  idPrefix: string;
  fields: FieldDef[];
}

export const CONTENT_TYPES: Record<string, ContentTypeDef> = {
  organizers: {
    slug: "organizers",
    label: "Organizers",
    sheetName: "Organizers",
    idPrefix: "org",
    fields: [
      { name: "FullName", label: "Full Name", type: "text", required: true },
      { name: "Title", label: "Professional Title", type: "text" },
      { name: "Organization", label: "Company / Organization", type: "text" },
      { name: "HeadshotURL", label: "Professional Headshot", type: "image" },
      { name: "Website", label: "Website", type: "text" },
      { name: "Instagram", label: "Instagram", type: "text" },
      { name: "LinkedIn", label: "LinkedIn", type: "text" },
      { name: "OtherSocial", label: "Other Social Media", type: "text" },
      { name: "Role", label: "Role in the Event", type: "text" },
      { name: "Bio", label: "Biography (100-150 words)", type: "textarea" },
      { name: "WellnessQuote", label: "“What does wellness mean to you?”", type: "textarea" },
      { name: "SimpleTip", label: "“One simple thing everyone can do…”", type: "textarea" },
      { name: "Published", label: "Published (visible on site)", type: "checkbox" },
    ],
  },
  teachers: {
    slug: "teachers",
    label: "Teachers",
    sheetName: "Teachers",
    idPrefix: "teacher",
    fields: [
      { name: "FullName", label: "Full Name", type: "text", required: true },
      { name: "HeadshotURL", label: "High-Resolution Headshot", type: "image" },
      { name: "Title", label: "Professional Title", type: "text" },
      { name: "Credentials", label: "Credentials", type: "text" },
      { name: "Certifications", label: "Certifications", type: "text" },
      { name: "Licenses", label: "Licenses", type: "text" },
      { name: "BusinessName", label: "Business / Studio Name", type: "text" },
      { name: "BusinessLogoURL", label: "Business Logo", type: "image" },
      { name: "Bio", label: "Biography (100-150 words)", type: "textarea" },
      { name: "Website", label: "Website", type: "text" },
      { name: "Instagram", label: "Instagram", type: "text" },
      { name: "Facebook", label: "Facebook", type: "text" },
      { name: "LinkedIn", label: "LinkedIn", type: "text" },
      { name: "OtherLinks", label: "Other Professional Links", type: "text" },
      { name: "ClassTitle", label: "Official Class / Session Title", type: "text" },
      { name: "ClassDescriptionFull", label: "Full Class Description", type: "textarea" },
      { name: "ClassDescriptionShort", label: "Short Description (for Schedule)", type: "textarea" },
      { name: "ClassDate", label: "Date of Class", type: "date" },
      { name: "StartTime", label: "Start Time", type: "text" },
      { name: "EndTime", label: "End Time", type: "text" },
      { name: "Location", label: "Location / Room", type: "text" },
      { name: "MaxCapacity", label: "Maximum Capacity", type: "text" },
      { name: "RegistrationRequired", label: "Advance Registration Required", type: "checkbox" },
      { name: "RegistrationLink", label: "Registration Link", type: "text" },
      { name: "Complimentary", label: "Complimentary", type: "checkbox" },
      { name: "DonationBased", label: "Donation Based", type: "checkbox" },
      { name: "TicketRequired", label: "Ticket Required", type: "checkbox" },
      { name: "VipOnly", label: "VIP Only", type: "checkbox" },
      { name: "WhatToBring", label: "What Guests Should Bring", type: "text" },
      { name: "WhatToWear", label: "What Guests Should Wear", type: "text" },
      { name: "EquipmentProvided", label: "Mats / Equipment Provided", type: "text" },
      { name: "ExperienceLevel", label: "Experience / Fitness Level", type: "text" },
      { name: "AgeRestrictions", label: "Age Restrictions", type: "text" },
      { name: "Accessibility", label: "Accessibility Considerations", type: "text" },
      { name: "WaiverRequired", label: "Waiver Required", type: "checkbox" },
      { name: "SafetyNotes", label: "Contraindications / Safety Info", type: "textarea" },
      { name: "WellnessQuote", label: "“What does wellness mean to you?”", type: "textarea" },
      { name: "SimpleTip", label: "“One simple thing everyone can do…”", type: "textarea" },
      { name: "Published", label: "Published (visible on site)", type: "checkbox" },
    ],
  },
  sponsors: {
    slug: "sponsors",
    label: "Sponsors",
    sheetName: "Sponsors",
    idPrefix: "sponsor",
    fields: [
      { name: "CompanyName", label: "Exact Company Name", type: "text", required: true },
      { name: "SponsorshipLevel", label: "Sponsorship Level", type: "text", helpText: "e.g. Diamond, Platinum, Gold, Founding Partner" },
      { name: "LogoURL", label: "Company Logo (PNG, transparent preferred)", type: "image" },
      { name: "Website", label: "Website", type: "text" },
      { name: "Instagram", label: "Instagram", type: "text" },
      { name: "Facebook", label: "Facebook", type: "text" },
      { name: "LinkedIn", label: "LinkedIn", type: "text" },
      { name: "Description", label: "Company Description (75-125 words)", type: "textarea" },
      { name: "ContactName", label: "Primary Contact Name (internal only)", type: "text" },
      { name: "ContactTitle", label: "Primary Contact Title (internal only)", type: "text" },
      { name: "ContactEmail", label: "Primary Contact Email (internal only)", type: "text" },
      { name: "ContactPhone", label: "Primary Contact Phone (internal only)", type: "text" },
      { name: "RepresentativeNames", label: "Representative(s) Attending", type: "text" },
      { name: "Activities", label: "What They're Doing During the Weekend", type: "textarea" },
      { name: "HasBooth", label: "Has Exhibitor Table / Booth", type: "checkbox" },
      { name: "BoothSize", label: "Booth / Table Size", type: "text" },
      { name: "BoothLocation", label: "Booth / Table Location", type: "text" },
      { name: "Demonstration", label: "Demonstration", type: "text" },
      { name: "Treatment", label: "Treatment", type: "text" },
      { name: "Consultation", label: "Consultation", type: "text" },
      { name: "Sampling", label: "Sampling Experience", type: "text" },
      { name: "ProductExperience", label: "Product Experience", type: "text" },
      { name: "ClassTaught", label: "Class Taught", type: "text" },
      { name: "PanelParticipation", label: "Panel Participation", type: "text" },
      { name: "SpeakerInfo", label: "Speaker", type: "text" },
      { name: "Giveaway", label: "Giveaway / Raffle Contribution", type: "text" },
      { name: "AttendeeOffer", label: "Special Attendee Offer", type: "text" },
      { name: "VipBenefit", label: "VIP-Specific Benefit / Gift", type: "text" },
      { name: "TrunkShow", label: "Trunk Show / Retail Activation", type: "text" },
      { name: "AppointmentInfo", label: "Special Appointment / Reservation Info", type: "textarea" },
      { name: "LifestylePhotoURL", label: "Lifestyle / Founder / Product Photo", type: "image" },
      { name: "WhySupport", label: "“Why did you choose to support this event?”", type: "textarea" },
      { name: "WellnessMeaning", label: "“What does wellness mean to your organization?”", type: "textarea" },
      { name: "LinkedScheduleItemID", label: "Linked Schedule Item ID", type: "text", helpText: "The ID of their class/panel/activation on the Schedule tab, if any" },
      { name: "Published", label: "Published (visible on site)", type: "checkbox" },
    ],
  },
  posts: {
    slug: "posts",
    label: "Blog Posts",
    sheetName: "Posts",
    idPrefix: "post",
    fields: [
      { name: "Title", label: "Post Title", type: "text", required: true },
      {
        name: "Slug",
        label: "URL Slug",
        type: "text",
        required: true,
        helpText: "Lowercase, hyphens only, e.g. 5-wellness-tips-for-fall — used in the post URL: /blog/your-slug",
      },
      { name: "FeaturedImageURL", label: "Featured Image", type: "image" },
      {
        name: "Excerpt",
        label: "Excerpt / Summary (used as the SEO meta description if no override is set below)",
        type: "textarea",
        required: true,
        helpText: "1-2 sentences, ideally under 155 characters for search results.",
      },
      {
        name: "Content",
        label: "Post Content",
        type: "textarea",
        required: true,
        rows: 16,
        helpText: "Plain text. Leave a blank line between paragraphs.",
      },
      { name: "Author", label: "Author Name", type: "text" },
      { name: "PublishDate", label: "Publish Date", type: "date", required: true },
      { name: "Category", label: "Category", type: "text", helpText: "e.g. Wellness Tips, Event News, Charleston Guide" },
      { name: "Tags", label: "Tags", type: "text", helpText: "Comma-separated, e.g. yoga, meditation, charleston" },
      {
        name: "MetaTitle",
        label: "SEO Title Override (optional)",
        type: "text",
        helpText: "Leave blank to use the Post Title. Keep under 60 characters.",
      },
      {
        name: "MetaDescription",
        label: "SEO Meta Description Override (optional)",
        type: "textarea",
        helpText: "Leave blank to use the Excerpt. Keep under 155 characters.",
      },
      { name: "Published", label: "Published (visible on site)", type: "checkbox" },
    ],
  },
  schedule: {
    slug: "schedule",
    label: "Schedule of Events",
    sheetName: "Schedule",
    idPrefix: "event",
    fields: [
      { name: "Title", label: "Event / Class / Session / Panel Title", type: "text", required: true },
      { name: "Date", label: "Date", type: "date", required: true },
      { name: "StartTime", label: "Start Time", type: "text" },
      { name: "EndTime", label: "End Time", type: "text" },
      { name: "Location", label: "Location", type: "text" },
      { name: "InstructorTeacherID", label: "Instructor / Teacher ID", type: "text", helpText: "The ID of their entry on the Teachers tab, if any" },
      { name: "Presenter", label: "Presenter", type: "text" },
      { name: "Moderator", label: "Moderator", type: "text" },
      { name: "Panelists", label: "Panelists", type: "text" },
      { name: "SponsorID", label: "Sponsor ID", type: "text", helpText: "The ID of the related entry on the Sponsors tab, if any" },
      { name: "ShortDescription", label: "Short Description (for Schedule grid)", type: "textarea" },
      { name: "FullDescription", label: "Full Description", type: "textarea" },
      { name: "Category", label: "Event Category", type: "text" },
      { name: "RegistrationLink", label: "Registration Link", type: "text" },
      { name: "Published", label: "Published (visible on site)", type: "checkbox" },
    ],
  },
};

export type ContentTypeSlug = keyof typeof CONTENT_TYPES;
