import { motion } from "motion/react";

export const AnimatedWord = ({
  children,
  index,
}: {
  children: string;
  index: number;
}) => {
  let times, scales, opacities, scaleEases, opacityEases;

  if (index === 0) {
    times = [0, 0.5 / 6, 1.0 / 6, 2.0 / 6, 2.5 / 6, 1];
    scales = [1, 1.1, 1.1, 1.1, 1, 1];
    opacities = [0, 0, 1, 1, 0, 0];
    scaleEases = ["easeInOut", "linear", "linear", "easeInOut", "linear"];
    opacityEases = ["linear", "easeInOut", "linear", "easeInOut", "linear"];
  } else if (index === 1) {
    times = [0, 2.0 / 6, 2.5 / 6, 3.0 / 6, 4.0 / 6, 4.5 / 6, 1];
    scales = [1, 1, 1.1, 1.1, 1.1, 1, 1];
    opacities = [0, 0, 0, 1, 1, 0, 0];
    scaleEases = [
      "linear",
      "easeInOut",
      "linear",
      "linear",
      "easeInOut",
      "linear",
    ];
    opacityEases = [
      "linear",
      "linear",
      "easeInOut",
      "linear",
      "easeInOut",
      "linear",
    ];
  } else {
    // Wrap-around for index 2
    times = [0, 0.5 / 6, 4.0 / 6, 4.5 / 6, 5.0 / 6, 1];
    scales = [1.1, 1, 1, 1.1, 1.1, 1.1];
    opacities = [1, 0, 0, 0, 1, 1];
    scaleEases = ["easeInOut", "linear", "easeInOut", "linear", "linear"];
    opacityEases = ["easeInOut", "linear", "linear", "easeInOut", "linear"];
  }

  const getLetterAnimation = (i: number) => {
    let waveTime = index === 0 ? 0.5 : index === 1 ? 2.5 : 4.5;
    let offset = waveTime + i * 0.05;
    return {
      y: [0, 0, -8, 0, 0],
      times: [0, offset / 6, (offset + 0.3) / 6, (offset + 0.6) / 6, 1],
    };
  };

  return (
    <span className="relative inline-flex font-bold whitespace-nowrap">
      <motion.span
        animate={{ scale: scales }}
        transition={{ duration: 6, repeat: Infinity, times, ease: scaleEases }}
        className="inline-flex text-white relative"
        style={{ transformOrigin: "center" }}
      >
        {children.split("").map((char, i) => {
          const { y, times: yTimes } = getLetterAnimation(i);
          return (
            <motion.span
              key={i}
              className="inline-block"
              animate={{ y }}
              transition={{
                duration: 6,
                repeat: Infinity,
                times: yTimes,
                ease: "easeInOut",
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
        <motion.span
          animate={{ opacity: opacities }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times,
            ease: opacityEases,
          }}
          className="absolute inset-0 left-0 top-0 text-transparent bg-clip-text bg-gradient-to-r from-[#2B7FFF] to-[#60A5FA] drop-shadow-[0_0_12px_rgba(43,127,255,0.6)] flex"
          aria-hidden="true"
        >
          {children.split("").map((char, i) => {
            const { y, times: yTimes } = getLetterAnimation(i);
            return (
              <motion.span
                key={i}
                className="inline-block"
                animate={{ y }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  times: yTimes,
                  ease: "easeInOut",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            );
          })}
        </motion.span>
      </motion.span>
    </span>
  );
};
