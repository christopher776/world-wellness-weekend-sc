import { siteConfig } from "@/lib/site-config";
import type { Metadata } from "next";

const description =
  "Privacy Policy for the South Carolina Spa & Wellness Association and World Wellness Weekend, South Carolina — how we collect, use, and protect your information.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: `Privacy Policy | ${siteConfig.shortName}`,
    description,
    url: `${siteConfig.url}/privacy-policy`,
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-gold-700">
        Policy
      </p>
      <h1 className="font-serif text-4xl font-bold text-navy-800 md:text-5xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-navy-400">Effective July 14, 2026</p>

      <div className="prose-content mt-10 space-y-6 text-sm leading-relaxed text-navy-600">
        <p>
          The South Carolina Spa &amp; Wellness Association, organizer of
          World Wellness Weekend, South Carolina (collectively,
          &ldquo;South Carolina Spa &amp; Wellness Association&rdquo;,
          &ldquo;SCSWA&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or
          &ldquo;us&rdquo;), based in Charleston, South Carolina, United
          States of America, provides this website and related
          applications available to visitors, sponsors, exhibitors, and
          members located throughout the world. Our website includes,
          without limitation, scwellness.org and any related pages or
          subdomains we operate (collectively, our &ldquo;Sites&rdquo;).
          Our Sites are controlled and operated from the United States and
          are subject to United States law.
        </p>

        <p>
          The South Carolina Spa &amp; Wellness Association respects your
          privacy and is committed to protecting it through our compliance
          with this policy.
        </p>

        <p>
          This policy describes the types of information we may collect
          from you or that you may provide when you visit our Sites and
          our practices for collecting, using, maintaining, protecting,
          and disclosing that information.
        </p>

        <p>This policy applies to information we collect:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>On our Sites.</li>
          <li>
            In email, text, and other electronic messages between you and
            our Sites, including sponsorship inquiries, RSVP submissions,
            and newsletter sign-ups.
          </li>
          <li>
            When you interact with our advertising and applications on
            third-party websites and services if those applications or
            advertising include links to this policy.
          </li>
        </ul>

        <p>It does not apply to information collected by:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            The South Carolina Spa &amp; Wellness Association offline or
            through any other means, including on any other website
            operated by any third party; or
          </li>
          <li>
            any third party, including through any application or content
            (including advertising) that may link to or be accessible from
            or on the Sites.
          </li>
        </ul>

        <p>
          Please read this policy carefully to understand our policies and
          practices regarding your information and how we will treat it.
          If you do not agree with our policies and practices, your choice
          is to not use our Sites. By accessing or using the Sites, you
          agree to this privacy policy. This policy may change from time to
          time (see Changes to Our Privacy Policy). Your continued use of
          the Sites after we make changes is deemed to be acceptance of
          those changes, so please check the policy periodically for
          updates.
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Children Under the Age of 13
        </h2>
        <p>
          Our Sites are not intended for children under 13 years of age. No
          one under age 13 may provide any information to or on the Sites.
          We do not knowingly collect personal information from children
          under 13. If you are under 13, do not use or provide any
          information on the Sites or on or through any of its features.
          If we learn we have collected or received personal information
          from a child under 13 without verification of parental consent,
          we will delete that information. If you believe we might have
          any information from or about a child under 13, please contact
          us at:{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-gold-700 underline hover:text-gold-600"
          >
            {siteConfig.contactEmail}
          </a>
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Information We Collect About You and How We Collect It
        </h2>
        <p>
          We collect information about your internet connection, the
          equipment you use to access our Sites, and usage details. We
          collect this information automatically as you navigate through
          the site. Information collected automatically may include usage
          details, IP addresses, and information collected through
          cookies.
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Information You Provide to Us
        </h2>
        <p>The information we collect on or through our Sites may include:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Information that you provide by filling in forms on our Sites,
            including sponsorship and exhibitor inquiries, room rental
            requests, and our RSVP &amp; updates sign-up form (name, email
            address, phone number, organization, and message). We may also
            ask you for information when you report a problem with our
            Sites.
          </li>
          <li>
            Records and copies of your correspondence (including email
            addresses), if you contact us.
          </li>
        </ul>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Information We Collect Through Automatic Data Collection
          Technologies
        </h2>
        <p>
          As you navigate through and interact with our Sites, we may use
          automatic data collection technologies, including Google
          Analytics, to collect certain information about your equipment,
          browsing actions, and patterns, including:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            Details of your visits to our Sites, including traffic data,
            logs, and other communication data and the resources that you
            access and use on the Sites.
          </li>
          <li>
            Information about your computer and internet connection,
            including your IP address, operating system, and browser
            type.
          </li>
        </ul>
        <p>
          The information we collect automatically may include personal
          information or we may maintain it or associate it with personal
          information we collect in other ways or receive from third
          parties. It helps us to improve our Sites and to deliver a
          better and more personalized service, including by enabling us
          to:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Estimate our audience size and usage patterns.</li>
          <li>
            Store information about your preferences, allowing us to
            customize our Sites according to your individual interests.
          </li>
          <li>Speed up your searches.</li>
          <li>Recognize you when you return to our Sites.</li>
        </ul>
        <p>
          No mobile details or personally identifiable information (PII)
          will be shared with third parties or affiliates for marketing or
          promotional purposes.
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          How We Use Your Information
        </h2>
        <p>
          We use information that we collect about you or that you provide
          to us, including any personal information:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>To present our Sites and its contents to you.</li>
          <li>
            To provide you with information, products, or services that
            you request from us, including sponsorship details, event
            updates, and RSVP confirmations.
          </li>
          <li>To fulfill any other purpose for which you provide it.</li>
          <li>
            To carry out our obligations and enforce our rights arising
            from any contracts entered between you and us, including for
            billing and collection related to sponsorships and room
            rentals.
          </li>
          <li>
            To notify you about changes to our Sites or any products or
            services we offer or provide through it.
          </li>
          <li>In any other way we may describe when you provide the information.</li>
          <li>For any other purpose with your consent.</li>
        </ul>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Disclosure of Your Information
        </h2>
        <p>
          We may disclose aggregated information about our users, and
          information that does not identify any individual, without
          restriction.
        </p>
        <p>
          We may disclose personal information that we collect, or you
          provide as described in this privacy policy:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>To our affiliated organizations and event partners.</li>
          <li>
            To contractors, service providers, and other third parties we
            use to support our business, including payment processing
            (Authorize.Net), email delivery, and event coordination
            services.
          </li>
          <li>
            To a buyer or other successor in the event of a merger,
            restructuring, reorganization, dissolution, or other transfer
            of some or all of the South Carolina Spa &amp; Wellness
            Association&rsquo;s assets, in which personal information held
            about our Sites users is among the assets transferred.
          </li>
          <li>To fulfill the purpose for which you provide it.</li>
          <li>For any other purpose disclosed by us when you provide the information.</li>
          <li>With your consent.</li>
        </ul>
        <p>We may also disclose your personal information:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            To comply with any court order, law, or legal process,
            including to respond to any government or regulatory request.
          </li>
          <li>
            To enforce or apply our terms and other agreements, including
            for billing and collection purposes.
          </li>
          <li>
            If we believe disclosure is necessary or appropriate to
            protect the rights, property, or safety of the South Carolina
            Spa &amp; Wellness Association, our members, sponsors, or
            others.
          </li>
        </ul>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Cookies and Tokens
        </h2>
        <p>
          We use tracking technologies, such as cookies, local storage,
          and pixel tags as described further below.
        </p>
        <p>
          <strong>Cookies.</strong> Cookies may be set and accessed on your
          computer. Upon your first visit to our Sites, a cookie will be
          sent to your computer that uniquely identifies your browser.
          &ldquo;Cookies&rdquo; are small files containing a string of
          characters that is sent to your computer&rsquo;s browser and
          stored on your device when you visit a website. You can reset
          your browser to refuse all cookies or to indicate when a cookie
          is being sent; however, if you reject cookies, you may not be
          able to take full advantage of our Sites. Additionally, if you
          clear all cookies on your browser, you may need to reset any
          privacy settings in your browser which are stored in cookies.
        </p>

        <p>Our Sites use the following types of cookies for the purposes set out below:</p>
        <div className="overflow-x-auto rounded-lg border border-navy-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream-200">
              <tr>
                <th className="p-3 font-semibold text-navy-800">
                  Type of Cookie
                </th>
                <th className="p-3 font-semibold text-navy-800">Purpose</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-navy-100 align-top">
                <td className="p-3 font-medium">
                  Analytics and Performance Cookies
                </td>
                <td className="p-3">
                  These cookies are used to collect information about
                  traffic to our Sites and how visitors use our Sites. The
                  information gathered does not identify any individual
                  visitor but enables us to count unique visitors, referral
                  sources, pages visited, and time of visit. We use Google
                  Analytics for this purpose; you can learn more about{" "}
                  <a
                    href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage"
                    className="text-gold-700 underline"
                  >
                    Google Analytics cookies
                  </a>{" "}
                  or{" "}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    className="text-gold-700 underline"
                  >
                    opt out here
                  </a>
                  .
                </td>
              </tr>
              <tr className="border-t border-navy-100 align-top">
                <td className="p-3 font-medium">Essential Cookies</td>
                <td className="p-3">
                  These cookies are essential to provide you with services
                  available through our Sites, such as processing sponsor
                  or RSVP form submissions and helping page content load
                  quickly. Without these cookies, the services you have
                  requested cannot be provided.
                </td>
              </tr>
              <tr className="border-t border-navy-100 align-top">
                <td className="p-3 font-medium">Functionality Cookies</td>
                <td className="p-3">
                  These cookies allow our Sites to remember choices you
                  make, such as preferences, in order to provide a more
                  personal experience and avoid asking you to re-enter
                  information on repeat visits.
                </td>
              </tr>
              <tr className="border-t border-navy-100 align-top">
                <td className="p-3 font-medium">Pixel Tags</td>
                <td className="p-3">
                  We may use small graphic files (&ldquo;pixel
                  tags&rdquo;) that allow us to monitor Site usage,
                  including pages viewed and links clicked, in combination
                  with cookies to provide offers and information of
                  interest to you.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          You can find more information about cookies and how to manage or
          delete them at{" "}
          <a
            href="http://www.allaboutcookies.org"
            className="text-gold-700 underline"
          >
            allaboutcookies.org
          </a>{" "}
          and{" "}
          <a
            href="http://www.youronlinechoices.com"
            className="text-gold-700 underline"
          >
            youronlinechoices.com
          </a>
          .
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Choices About How We Use and Disclose Your Information
        </h2>
        <p>
          We strive to provide you with choices regarding the personal
          information you provide to us:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Tracking Technologies and Advertising.</strong> You can
            set your browser to refuse all or some browser cookies, or to
            alert you when cookies are being sent. If you disable or
            refuse cookies, some parts of this site may then be
            inaccessible or not function properly.
          </li>
          <li>
            <strong>Email Communications.</strong> If you sign up for
            updates via our RSVP form or newsletter and later wish to stop
            receiving communications from us, contact us at the email
            below and we will remove you from our list.
          </li>
        </ul>
        <p>
          We do not control third parties&rsquo; collection or use of your
          information to serve interest-based advertising. However, these
          third parties may provide you with ways to choose not to have
          your information collected or used in this way. You can opt out
          of receiving targeted ads from members of the Network
          Advertising Initiative (&ldquo;NAI&rdquo;) on the NAI&rsquo;s
          website.
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Changes to Our Privacy Policy
        </h2>
        <p>
          It is our policy to post any changes we make to our privacy
          policy on this page. If we make material changes to how we treat
          our users&rsquo; personal information, we will notify you through
          a notice on the Sites home page. The date the privacy policy was
          last revised is identified at the top of the page. You are
          responsible for periodically visiting our Sites and this privacy
          policy to check for any changes.
        </p>

        <h2 className="font-serif text-xl font-bold text-navy-800">
          Contact Information
        </h2>
        <p>
          To ask questions or comment about this privacy policy and our
          privacy practices, contact us at{" "}
          <a
            href={`mailto:${siteConfig.contactEmail}`}
            className="text-gold-700 underline hover:text-gold-600"
          >
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </div>
    </div>
  );
}
