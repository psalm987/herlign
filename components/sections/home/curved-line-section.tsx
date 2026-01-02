import React from "react";
import DemoCurvedText from "@/components/ui/curved-text";
import { path } from "@/components/constants/paths";
import Image from "next/image";
import Star from "@/components/svg/star";

const CurvedLineSection = () => {
  return (
    <div className="p-24 pt-0 overflow-x-hidden overflow-y-hidden flex justify-center">
      <div className="relative ">
        <DemoCurvedText
          path={path[0]}
          text="We speak to your creativity"
          height={500}
          width={1000}
          animate
          className="mx-auto"
        />
        <Image
          className="-bottom-30 left-10 absolute"
          src="/images/png/1.png"
          alt="Lips"
          height={300}
          width={300}
        />
        <Star
          size="200"
          className="absolute top-0 -right-20 text-lermorn-400"
        />
        {/* <Logo /> */}
      </div>
    </div>
  );
};

export default CurvedLineSection;
