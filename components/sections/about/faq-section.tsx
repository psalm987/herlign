import FAQS from "@/components/constants/faqs";
import Image from "next/image";
import React from "react";

const FAQSection = () => {
  return (
    <section className=" bg-peenk-500 relative overflow-hidden">
      <Image
        src="/images/png/patterns/ohrange-500-mini.png"
        alt=""
        fill
        className="absolute h-auto w-screen object-cover"
      />
      <div className="py-20 md:py-28 px-8 relative">
        <div className="max-w-2xl mx-auto py-8 sm:py-12 lg:py-18 px-4 sm:px-6 lg:px-8 bg-white rounded-lg border border-lermorn-50 animate-subtle-lift-with-pause ">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="font-heading text-center  text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-8">
              You&apos;ve Got Questions.
              <br />
              We&apos;ve Got{" "}
              <span className="font-handwriting text-4xl sm:text-3xl md:text-6xl text-ohrange-500">
                (Witty)
              </span>{" "}
              Answers.
            </h2>

            <ul className="text-md md:text-xl text-gray-700 mb-8 max-w-md mx-auto">
              {FAQS.map((faq, index) => (
                <li key={index} className={"mb-6"}>
                  <h3 className="font-semibold mb-2 text-gray-900">
                    <span className="font-handwriting  text-xl md:text-2xl text-perple-500">
                      Q.{" "}
                    </span>
                    {faq.question}
                  </h3>
                  <p>
                    <span className="font-handwriting text-xl md:text-2xl text-ohrange-500">
                      A.{" "}
                    </span>
                    {faq.answer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
