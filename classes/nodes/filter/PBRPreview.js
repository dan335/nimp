import NodeImage from '../NodeImage.js';
import PBRPreviewProperties from './PBRPreviewProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class PBRPreview extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'PBR Preview', PBRPreviewProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Albedo'),
      new InputImage(this, 1, 'Normal'),
      new InputImage(this, 2, 'Roughness'),
      new InputNumber(this, 3, 'Size', 'hasSize')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.size = typeof settings.size !== 'undefined' ? settings.size : 128;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let size = this.size;
      if (this.inputs[3].number != null) size = this.inputs[3].number;
      size = Math.max(32, Math.min(512, Math.round(size)));

      const albedo = this.inputs[0].image;
      const normalMap = this.inputs[1].image;
      const roughnessMap = this.inputs[2].image;
      const image = new Jimp({ width: size, height: size });
      const data = image.bitmap.data;
      const cx = size / 2;
      const cy = size / 2;
      const radius = size / 2 - 2;

      // Light direction (normalized)
      const lightX = 0.5, lightY = -0.5, lightZ = 0.7;
      const lLen = Math.sqrt(lightX*lightX + lightY*lightY + lightZ*lightZ);
      const lx = lightX/lLen, ly = lightY/lLen, lz = lightZ/lLen;

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = (x - cx) / radius;
          const dy = (y - cy) / radius;
          const dist2 = dx*dx + dy*dy;
          const dstIdx = (y * size + x) * 4;

          if (dist2 > 1) {
            data[dstIdx] = 30;
            data[dstIdx+1] = 30;
            data[dstIdx+2] = 30;
            data[dstIdx+3] = 255;
            continue;
          }

          const dz = Math.sqrt(1 - dist2);

          // UV mapping (spherical)
          const u = 0.5 + Math.atan2(dx, dz) / (2 * Math.PI);
          const v = 0.5 - Math.asin(dy) / Math.PI;

          // Sample albedo
          const aw = albedo.bitmap.width;
          const ah = albedo.bitmap.height;
          const ax = Math.floor(u * aw) % aw;
          const ay = Math.floor(v * ah) % ah;
          const aIdx = (ay * aw + ax) * 4;
          let ar = albedo.bitmap.data[aIdx] / 255;
          let ag = albedo.bitmap.data[aIdx+1] / 255;
          let ab = albedo.bitmap.data[aIdx+2] / 255;

          // Normal (use sphere normal if no normal map)
          let nx = dx, ny = dy, nz = dz;
          if (normalMap) {
            const nw = normalMap.bitmap.width;
            const nh = normalMap.bitmap.height;
            const nux = Math.floor(u * nw) % nw;
            const nuy = Math.floor(v * nh) % nh;
            const nIdx = (nuy * nw + nux) * 4;
            // Perturb normal slightly from normal map
            const mnx = normalMap.bitmap.data[nIdx] / 255 * 2 - 1;
            const mny = normalMap.bitmap.data[nIdx+1] / 255 * 2 - 1;
            nx = dx + mnx * 0.3;
            ny = dy + mny * 0.3;
            nz = dz;
            const nLen = Math.sqrt(nx*nx + ny*ny + nz*nz);
            nx /= nLen; ny /= nLen; nz /= nLen;
          }

          // Roughness
          let roughness = 0.5;
          if (roughnessMap) {
            const rw = roughnessMap.bitmap.width;
            const rh = roughnessMap.bitmap.height;
            const rux = Math.floor(u * rw) % rw;
            const ruy = Math.floor(v * rh) % rh;
            const rIdx = (ruy * rw + rux) * 4;
            roughness = roughnessMap.bitmap.data[rIdx] / 255;
          }

          // Simple PBR-ish lighting
          const NdotL = Math.max(0, nx*lx + ny*ly + nz*lz);
          const diffuse = NdotL;

          // Specular (Blinn-Phong approximation)
          const hx = lx, hy = ly, hz = lz + 1;
          const hLen = Math.sqrt(hx*hx + hy*hy + hz*hz);
          const NdotH = Math.max(0, nx*hx/hLen + ny*hy/hLen + nz*hz/hLen);
          const shininess = Math.pow(2, (1 - roughness) * 10);
          const specular = Math.pow(NdotH, shininess) * (1 - roughness);

          const ambient = 0.15;
          const r = Math.min(1, ar * (diffuse + ambient) + specular);
          const g = Math.min(1, ag * (diffuse + ambient) + specular);
          const b2 = Math.min(1, ab * (diffuse + ambient) + specular);

          data[dstIdx] = Math.round(r * 255);
          data[dstIdx+1] = Math.round(g * 255);
          data[dstIdx+2] = Math.round(b2 * 255);
          data[dstIdx+3] = 255;
        }
      }

      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();
    json.settings.size = this.size;
    return json;
  }
}
