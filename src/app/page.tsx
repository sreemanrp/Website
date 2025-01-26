import { experiences, projects, socials } from "@/data/content";

const ROW_DELAY = 30;
const SCRAMBLE_SPEED = 27;
const SCRAMBLED_LETTER_COUNT = 5;

const getAnimationDuration = (text: string) => {
  return Math.min((text.length - SCRAMBLED_LETTER_COUNT) * SCRAMBLE_SPEED, 100);
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fefefe] text-black pl-4 lr-0 pt-10 pb-10 sm:px-2 sm:pt-10 sm:pb-10 md:pt-10 md:pb-10 lg:pt-12 lg:pb-12 md:p-10 lg:p-12 font-normal text-[4.9vw] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl leading-tight sm:leading-tight">
      <div>
        <div className="relative max-w-screen-2xl mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          {/* Header - Row 1 */}
          <div className="flex mb-4 sm:mb-8 md:mb-12 lg:mb-16 xl:mb-20">
            <div className="w-1/5 text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/3 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <h1>
                <ScrambleCombined
                  delay={0}
                >
                  Sreeman Reddy
                </ScrambleCombined>
              </h1>
            </div>
            <div className="">
              <h1 className="pb-0.5 md:pb-0.5 lg>pb-1">
                <ScrambleIn
                  delay={getAnimationDuration("Sreeman Reddy")}
                >
                  design ✺ tech ∿ build ◳
                </ScrambleIn>
              </h1>
              <a
                href="https://encom.com"
                target="_blank"
                className="cursor-pointer border-b-2 border-transparent md:hover:border-foreground"
              >
                <ScrambleCombined
                  delay={getAnimationDuration("Sreeman Reddy") + ROW_DELAY}
                  className="whitespace-pre"
                >
                  <span className="w-full whitespace-pre">
                    founder & COO @ Encom{" "}
                    <span className="md:hidden text-[3vw] sm:text-sm pb-1 -ml-0.5 font-medium">
                      ↗
                    </span>
                  </span>
                </ScrambleCombined>
              </a>
            </div>
          </div>

          {/* Previous Experience */}
          <div className="flex">
            <h2 className="w-1/5 text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12 sm:w-1/3 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 3}
              >
                past
              </ScrambleIn>
            </h2>
            <div className="flex-1 w-full">
              {experiences.map((exp, index) => (
                <a
                  href={exp.links}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={index}
                >
                  <ScrambleCombinedPair
                    key={index}
                    leftText={
                      <span className="w-full whitespace-pre">
                        {exp.title}{" "}
                        <span className="md:hidden text-[3vw] sm:text-sm pb-1 -ml-0.5 font-medium">
                          ↗
                        </span>
                      </span>
                    }
                    leftTextString={exp.title}
                    rightText={exp.year}
                    delay={
                      ROW_DELAY * 3 +
                      getAnimationDuration("Sreeman Reddy") +
                      ROW_DELAY * index
                    }
                    containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="flex">
            <h2 className="w-1/5 text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12  sm:w-1/3 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 7}
              >
                <span className="md:hidden">proj</span>
                <span className="hidden md:block">projects</span>
              </ScrambleIn>
            </h2>
            <ul className="flex-1">
              {projects.map((project, index) => (
                <li key={index}>
                  <a
                    href={project.links}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ScrambleCombinedPair
                      key={index}
                      leftTextString={project.title}
                      leftText={
                        <span className="w-full whitespace-pre">
                          {project.title}{" "}
                          <span className="md:hidden text-[3vw] sm:text-sm pb-1 -ml-0.5 font-medium">
                            ↗
                          </span>
                        </span>
                      }
                      rightText={project.year}
                      delay={
                        ROW_DELAY * 7 +
                        getAnimationDuration("daniel petho") +
                        ROW_DELAY * index
                      }
                      img={project.img}
                      imgAlt={`${project.title} project thumbnail`}
                      showImage={true}
                      containerClassName="group justify-between border-b-2 md:hover:border-foreground border-b-transparent cursor-pointer pb-0.5 md:pb-0.5 lg:pb-1"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex">
            <h2 className="w-1/5 text-right pr-4 sm:pr-6 md:pr-8 lg:pr-12  sm:w-1/3 md:w-1/4 lg:w-1/4 xl:w-[22%]">
              <ScrambleIn
                delay={ROW_DELAY * 15}
                scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                scrambleSpeed={SCRAMBLE_SPEED}
              >
                contact
              </ScrambleIn>
            </h2>
            <ul>
              <li>
                <ScrambleIn
                  delay={ROW_DELAY * 15 + getAnimationDuration("Sreeman Reddy")}
                  scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                  scrambleSpeed={SCRAMBLE_SPEED}
                >
                  abc@sreeman.sh
                </ScrambleIn>
              </li>
              <br />
              {socials.map((social, index) => (
                <li key={index}>
                  <a
                    href={social.links}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer border-b-2 border-b-transparent md:hover:border-foreground pb-0.5 md:pb-0.5 lg:pb-1 inline-block"
                  >
                    <ScrambleCombined
                      delay={
                        ROW_DELAY * 17 +
                        getAnimationDuration("Sreeman Reddy") +
                        ROW_DELAY * index
                      }
                      scrambledLetterCount={SCRAMBLED_LETTER_COUNT}
                      scrambleSpeed={SCRAMBLE_SPEED}
                    >
                      {social.name}{" "}
                      <span className="md:hidden text-[3vw] sm:text-sm pb-1 -ml-0.5 font-medium">
                        ↗
                      </span>
                    </ScrambleCombined>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
