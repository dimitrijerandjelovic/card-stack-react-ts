import CardStackComponent from "./Components/ImageWheelComponent";

function App() {
  const images = [
    { label: "0-480x320.jpg", src: "0-480x320.jpg" },
    { label: "1-480x320.jpg", src: "1-480x320.jpg" },
    { label: "2-480x320.jpg", src: "2-480x320.jpg" },
    { label: "3-480x320.jpg", src: "3-480x320.jpg" },
    { label: "4-480x320.jpg", src: "4-480x320.jpg" },
    { label: "5-480x320.jpg", src: "5-480x320.jpg" },
    { label: "6-480x320.jpg", src: "6-480x320.jpg" },
    { label: "7-480x320.jpg", src: "7-480x320.jpg" },
  ];
  return (
    <CardStackComponent
      nodes={images.map((x) => (
        <img src={x.src}></img>
      ))}
      animationSpeed={15}
      maxToDisplay={5}
    />
  );
}

export default App;
