import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { BarChart2Icon } from "lucide-react";
import { signOut } from "@/utils/login";
import Link from "next/link";

const MobileHeader = () => {
  return (
    <header className="bg-black fixed w-full px-8 flex md:hidden items-center text-white h-16 border-b-2 border-white/60 justify-between drop-shadow-xl z-50">
      <h1 className=" font-bold text-xl">doodl-ly</h1>
      <Sheet>
        <SheetTrigger>
          <BarChart2Icon className="rotate-270" />
        </SheetTrigger>
        <SheetContent className="bg-black text-white">
          <SheetHeader>
            <SheetTitle className="text-white text-2xl">Doodle-ly</SheetTitle>
          </SheetHeader>
          <ul className="cursor-pointer text-3xl font-semibold w-full items-center flex flex-col gap-20 mt-20 justify-between">
            <li className="hover:underline"><Link href='/about'>about</Link></li>
          <li className="cursor-pointer" onClick={signOut}>
            logout
          </li>
          </ul>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileHeader;
