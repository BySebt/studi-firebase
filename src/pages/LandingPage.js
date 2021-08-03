import React from "react";
import tw from "twin.macro";
import AnimationRevealPage from "../utils/helpers/AnimationRevealPage.js";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import MainFeature from "../components/Landing/MainFeature";
import FeatureWithSteps from "../components/Landing/FeatureWithSteps";
import FAQ from "../components/Landing/FAQ";
import Footer from "../components/Landing/Footer";
import heroScreenshotImageSrc from "../assets/img/dashboard-screenshot.png";
import TeamIllustrationSrc from "../assets/icons/design-illustration-2.svg";

// This is the code for the landing page. 
// The sections of the landing page are located in /components, making it easier to maintain.

export default () => {
  // Subheading CSS
  const Subheading = tw.span`uppercase tracking-widest font-bold text-purple-500`;

  // Highlighted Text CSS
  const HighlightedText = tw.span`bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600`;

  return (

    // AnimationRevealPage gives each component a sliding in animation.
    <AnimationRevealPage>
      <Hero roundedHeaderButton={true} imageDecoratorBlob={true} />

      <MainFeature
        subheading={<Subheading>Dashboard</Subheading>}
        imageSrc={heroScreenshotImageSrc}
        imageBorder={true}
        imageDecoratorBlob={true}
      />
      <Features
        subheading={<Subheading>Features</Subheading>}
        heading={
          <>
            We have Amazing <HighlightedText>Features.</HighlightedText>
          </>
        }
      />
            <MainFeature
        subheading={<Subheading>Dashboard</Subheading>}
        imageSrc={heroScreenshotImageSrc}
        imageBorder={true}
        textOnLeft={true}
        imageDecoratorBlob={true}
      />
      <FeatureWithSteps
        subheading={<Subheading>STEPS</Subheading>}
        heading={
          <>
            Easy to <HighlightedText>Get Started.</HighlightedText>
          </>
        }
        textOnLeft={false}
        imageSrc={TeamIllustrationSrc}
        imageDecoratorBlob={true}
        decoratorBlobCss={tw`xl:w-40 xl:h-40 opacity-20 -translate-x-1/2 left-1/2`}
      />
      <FAQ
        subheading={<Subheading>FAQS</Subheading>}
        heading={
          <>
            You have <HighlightedText>Questions ?</HighlightedText>
          </>
        }
        faqs={[
          {
            question: "How much does Studyi cost?",
            answer: "Nothing. Studyi is completely free.",
          },
          {
            question: "How can Studyi help me improve?",
            answer:
              "By using Studyi, we record what percentage of your tasks you complete each day, then display it on your dashboard. " +
              "Using this data, you can clearly see how you are going with your revisions and improve in your own ways.",
          },
        ]}
      />
      <Footer />
    </AnimationRevealPage>
  );
};
