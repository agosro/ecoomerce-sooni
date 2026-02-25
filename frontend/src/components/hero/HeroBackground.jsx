import heroBg from "../../assets/images/hero6.png";

export default function HeroBackground() {
  return (
    <>
      <img
        src={heroBg}
        alt="Sooni Skincare"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Overlay SOONI */}
      <div className="absolute inset-0 bg-ivory/20 backdrop-blur-[px]" />
    </>
  );
}
