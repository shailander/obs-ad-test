/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import LogoImg from "../../../public/logo-white.png";
import { useRouter } from "next/router";

const TIME_TILL_SHOW = 15000; //show=true
const TIME_TILL_HIDE = 45000; //show=false

const allowedStreamers = ["1", "2", "3"];

export default function Home() {
  const isObsSourceActive = useRef(true);
  const isStreaming = useRef(false);
  const [showLogo, setShowLogo] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const { id: streamerId } = router.query;
    if (!streamerId) return;

    if (!allowedStreamers.includes(streamerId)) return;

    const streamerTableName = "streamer_" + streamerId;

    const isObsPresent = !!window?.obsstudio?.pluginVersion;

    const intervalId = isObsPresent
      ? setInterval(() => {
          sendData(streamerTableName);
        }, 60000)
      : null;

    isObsSourceActive.current = isObsPresent;
    window?.obsstudio?.getStatus((status) => {
      isStreaming.current = status.streaming;
    });

    function onObsSourceActiveChanged(event) {
      isObsSourceActive.current = !!event.detail.active;
    }
    function obsStreamingStarted() {
      isStreaming.current = true;
    }
    function obsStreamingStopped() {
      isStreaming.current = false;
    }
    window.addEventListener("obsSourceActiveChanged", onObsSourceActiveChanged);
    window.addEventListener("obsStreamingStarted", obsStreamingStarted);
    window.addEventListener("obsStreamingStopped", obsStreamingStopped);

    return () => {
      window.removeEventListener(
        "obsSourceActiveChanged",
        onObsSourceActiveChanged
      );
      window.removeEventListener("obsStreamingStarted", obsStreamingStarted);
      window.removeEventListener("obsStreamingStopped", obsStreamingStopped);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [router.query]);

  useEffect(() => {
    let timerId;
    if (showLogo) {
      timerId = setTimeout(() => {
        setShowLogo(false);
      }, TIME_TILL_SHOW);
    } else {
      timerId = setTimeout(() => {
        setShowLogo(true);
      }, TIME_TILL_HIDE);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [showLogo]);

  const sendData = async (streamerTableName) => {
    if (!isStreaming.current) return;
    const currentTimestamp = new Date();
    var timestampValue = currentTimestamp
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    await fetch("/api/status-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: timestampValue,
        isActive: isObsSourceActive.current,
        streamerTableName,
      }),
    });
  };

  return (
    <div className="h-screen w-screen bg-transparent text-2xl flex justify-start items-center p-4">
      <img
        src={LogoImg.src}
        alt="logo"
        height={200}
        width={200}
        className={`${
          showLogo ? "opacity-100" : "opacity-0"
        } transition-opacity ease-in-out duration-1000 bg-black`}
      />
    </div>
  );
}
