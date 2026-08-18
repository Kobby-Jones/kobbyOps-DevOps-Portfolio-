declare module "vanta/dist/vanta.net.min"
declare module "vanta/dist/vanta.waves.min";
 {
  type VantaEffect = {
    destroy: () => void;
    resize?: () => void;
    setOptions?: (options: Record<string, unknown>) => void;
  };

  type VantaNetFactory = (options: Record<string, unknown>) => VantaEffect;
  const NET: VantaNetFactory;
  export default NET;
}

declare module "three";
