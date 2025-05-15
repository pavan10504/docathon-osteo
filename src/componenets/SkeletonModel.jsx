import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const SkeletonModel = ({ arthritisGrade }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / 2 / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 1.5, 5.5);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true  });
    renderer.setClearColor( 0x000000, 0 );
    scene.background = null;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    if (mountRef.current && !mountRef.current.hasChildNodes()) {
  mountRef.current.appendChild(renderer.domElement);
}

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Load skeleton model
    const loader = new GLTFLoader();
    loader.load(
      "/models/skeleton.glb", // Path to your 3D model
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const center = new THREE.Vector3();
        box.getCenter(center);
        model.position.sub(center);
        scene.add(model);
        // Focus on knee if we have an arthritis grade
        if (arthritisGrade !== undefined) {
          // Find knee joint in the model
          const knee = model.getObjectByName("object_20");
          if (knee) {
            // Highlight knee based on arthritis grade
            console.log("kneee present")
            const kneeHighlight = new THREE.Mesh(
              new THREE.SphereGeometry(0.2, 32, 32),
              new THREE.MeshBasicMaterial({
                color: getColorForGrade(arthritisGrade),
                transparent: true,
                opacity: 0.7,
              })
            );
            knee.add(kneeHighlight);

            // Zoom to knee
            camera.position.set(
              knee.position.x,
              knee.position.y,
              knee.position.z + 1
            );
            controls.target.copy(knee.position);
          }
        }
      },
      undefined,
      (error) => console.error("Error loading model:", error)
    );

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / 2 / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth / 2, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
  window.removeEventListener("resize", handleResize);
  if (mountRef.current && mountRef.current.contains(renderer.domElement)) {
    mountRef.current.removeChild(renderer.domElement);
  }
};
  }, [arthritisGrade]);

  // Helper function to determine color based on arthritis grade
  const getColorForGrade = (grade) => {
    const colors = {
      0: 0x00ff00, // Green - healthy
      1: 0xffff00, // Yellow - mild
      2: 0xffa500, // Orange - moderate
      3: 0xff4500, // Red-orange - severe
      4: 0xff0000, // Red - extreme
    };
    return colors[grade] || 0xcccccc;
  };

  return <div ref={mountRef} className="h-full w-full bg-transparent [&>canvas]:!bg-transparent" />;
};

export default SkeletonModel;
