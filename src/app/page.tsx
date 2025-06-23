"use client";

import { Leaderboard } from "@/components/Leaderboard";

export default function Home() {
  return (
    <div className='h-[100vh] overflow-none'>
      <div className='fixed top-0 w-screen bg-[#3a3532] p-4 mb-10 flex justify-between items-center shadow z-[2]'>
        <div className='flex md:flex-1 justify-start'>
          <img
            alt='pickle-haus-logo'
            src='./logo.png'
            className='size-12 md:size-20 rounded-full'
          />
        </div>
        <div className='flex flex-1 justify-center items-center'>
          <img
            alt='net-ninjas-logo'
            className='size-0 md:size-20'
            src='./ninja.png'
          />
          <h1 className='text-2xl md:text-4xl text-[#c66144] font-bold text-center'>
            Ninja Leaderboard
          </h1>
          <img
            alt='net-ninjas-logo'
            className='size-0 md:size-20 transform scale-x-[-1]'
            src='./ninja.png'
          />
        </div>
        <div className='flex md:flex-1 justify-end'>
          <h3 className='text-sm md:text-lg font-bold text-[#f0e5c7]'>SBA</h3>
        </div>
      </div>
      {/* <div className='container mx-auto px-2 mt-36'>
        <div className='bg-[url(/yaba-bg.png)] bg-cover text-white font-bold rounded-xl border border-gray-300 p-8 md:text-xl flex justify-between items-center mb-5 mx-auto'>
          <div
            className='underline cursor-pointer'
            onClick={() => window.open("https://yabasports.com/")}
          >
            OFFICIAL EQUIPMENT PARTNER - YABA
          </div>
          <div>Flat 55% off on MRP for Net Ninjas</div>
        </div>
      </div> */}
      <div className='container mx-auto pb-10 px-2 mt-36'>
        <Leaderboard />
      </div>
    </div>
  );
}
