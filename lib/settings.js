import UniformColor from '../classes/nodes/inputs/UniformColor.js';
import UrlImage from '../classes/nodes/inputs/UrlImage.js';
import Output from '../classes/nodes/outputs/Output.js';
import Blur from '../classes/nodes/blurs/Blur.js';
import BrightnessContrast from '../classes/nodes/color/BrightnessContrast.js';
import Greyscale from '../classes/nodes/color/Greyscale.js';
import Blend from '../classes/nodes/composing/Blend.js';
import Resize from '../classes/nodes/resize/Resize.js';
import ImageUpload from '../classes/nodes/inputs/ImageUpload.js';
import Mask from '../classes/nodes/composing/Mask.js';
import Invert from '../classes/nodes/color/Invert.js';
import Displace from '../classes/nodes/threedee/Displace.js';
import Number from '../classes/nodes/math/Number.js';

const settings = {
  nodeWidth: 140,
  nodeHeight: 34,
  nodeConnectionRadius: 8,
  nodeBackgroundColor: 'hsl(209, 10%, 40%)',
  nodes: [
    {
      name: 'Images',
      nodes: [
        {name:'Image Upload', classObject:ImageUpload},
        {name:'Image from Url', classObject:UrlImage},
        {name:'Uniform Color', classObject:UniformColor},
        {name:'Output', classObject:Output},
      ]
    },
    {
      name: 'Color',
      nodes: [
        {name:'Blur', classObject:Blur},
        {name:'Brightness/Contrast', classObject:BrightnessContrast},
        {name:'Greyscale', classObject:Greyscale},
        {name:'Invert', classObject:Invert},
      ]
    },
    {
      name: 'Blending',
      nodes: [
        {name:'Blend', classObject:Blend},
        {name:'Mask', classObject:Mask},
      ]
    },
    {
      name: 'Resizing',
      nodes: [
        {name:'Resize', classObject:Resize},
      ]
    },
    {
      name: '3D',
      nodes: [
        {name:'Displace', classObject:Displace},
      ]
    },
    {
      name: 'Math',
      nodes: [
        {name:'Number Input', classObject:Number},
      ]
    }
  ]
}


export default settings
