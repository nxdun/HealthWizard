import PropTypes from "prop-types";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import * as reactSpring from "@react-spring/three";
import * as drei from "@react-three/drei";
import * as fiber from "@react-three/fiber";

function ShaderCanvas({ urlString }) {
  // Default URL if no urlString is provided
  const defaultUrl =
    "https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1.2&cAzimuthAngle=180&cDistance=2.6&cPolarAngle=120&cameraZoom=1&color1=%23ebedff&color2=%23f3f2f8&color3=%23dbf8ff&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=50&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1.4&positionX=0&positionY=1.8&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=-90&shader=defaults&type=plane&uAmplitude=0&uDensity=1&uFrequency=5.5&uSpeed=0.3&uStrength=3&uTime=0.2&wireframe=false";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: "-1",
        pointerEvents: "none",
      }}
    >
      <ShaderGradientCanvas
        importedFiber={{ ...fiber, ...drei, ...reactSpring }}
        style={{
          position: "absolute",
          top: 0,
          width: "100vw",
          height: "100vh",
          zIndex: "-1",
          pointerEvents: "none",
        }}
      >
        {/* Use the provided urlString prop or fall back to the default */}
        <ShaderGradient control="query" urlString={urlString || defaultUrl} />
      </ShaderGradientCanvas>
    </div>
  );
}

ShaderCanvas.propTypes = {
  urlString: PropTypes.string,
};

export default ShaderCanvas;
