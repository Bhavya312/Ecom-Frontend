import previewImage from "../../src/assets/homeslider/preview.webp";

const Banner = ({name, catImage}) => {
  
  const image = catImage ?? previewImage;
  return (
    <section className="block min-h-[19rem] text-white bg-center bg-no-repeat bg-cover flex items-center justify-center text-center" style={{backgroundImage:`url(${image})`}}>
      <div className="text-4xl font-bold px-[10rem] py-10 capitalize">
      <h3 >{name ?? `Categories`}</h3>
      </div>
    </section>
  );
};

export default Banner;
