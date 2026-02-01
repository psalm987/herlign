import type { Metadata } from "next";
// import { CommunitySection } from "@/components/sections/contact/community-section";
import ContactFormSection from "@/components/sections/contact/form-section";

export const metadata: Metadata = {
  title: "Contact Us | Herlign FC - Get in Touch",
  description:
    "Have questions or want to connect? Reach out to Herlign Female Creatives. We're here to support your career journey and answer any questions about our community.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactFormSection />
      {/* <CommunitySection /> */}
    </main>
  );
}
