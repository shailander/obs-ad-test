import { useEffect, useRef, useState } from "react";
import LogoImg from "../../public/logo-white.png";

const TIME_TILL_SHOW = 15000; //show=true
const TIME_TILL_HIDE = 45000; //show=false

export default function Home() {
  const isVisible = useRef(true);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    const isObsPresent = !!window?.obsstudio?.pluginVersion;

    const intervalId = true
      ? setInterval(() => {
          sendData();
        }, 15000)
      : null;

    isVisible.current = isObsPresent;

    // const ele = document.getElementById("damm-element");
    // window.addEventListener("obsSourceVisibleChanged", function (event) {
    //   ele.innerText = `Visible : ${event.detail.visible} ** Active : ${data.current.active}`;
    //   data.current = { ...data.current, visible: event.detail.visible };
    // });
    window.addEventListener("obsSourceActiveChanged", function (event) {
      // ele.innerText = `Visible : ${data.current.visible} ** Active : ${event.detail.active}`;
      isVisible.current = !!event.detail.active;
    });

    // window.obsstudio.onVisibilityChange

    // setTimeout(() => {
    //   data.current = Math.random(1, 100);
    // }, 1000);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

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

  const sendData = async () => {
    const currentTimestamp = new Date();
    var timestampValue = currentTimestamp
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    await fetch("/api/hello", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timestamp: timestampValue,
        isVisible: isVisible.current,
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
