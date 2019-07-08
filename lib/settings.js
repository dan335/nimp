import UniformColor from '../classes/nodes/inputs/UniformColor.js';
import UrlImage from '../classes/nodes/inputs/UrlImage.js';
import Output from '../classes/nodes/outputs/Output.js';
import Blur from '../classes/nodes/blurs/Blur.js';
import BrightnessContrast from '../classes/nodes/color/BrightnessContrast.js';
import Greyscale from '../classes/nodes/color/Greyscale.js';
import Blend from '../classes/nodes/composing/Blend.js';
import Resize from '../classes/nodes/resize/Resize.js';

const settings = {
  nodeWidth: 140,
  nodeHeight: 30,
  nodeConnectionRadius: 8,
  nodeBackgroundColor: 'hsl(209, 60%, 40%)',
  nodes: [
    {name:'Uniform Color', id:'uniformcolor', classObject:UniformColor},
    {name:'Image from Url', id:'urlimage', classObject:UrlImage},
    {name:'Output', id:'output', classObject:Output},
    {name:'Blur', id:'blur', classObject:Blur},
    {name:'Brightness/Contrast', id:'brightnesscontrast', classObject:BrightnessContrast},
    {name:'Greyscale', id:'greyscale', classObject:Greyscale},
    {name:'Blend', id:'blend', classObject:Blend},
    {name:'Resize', id:'resize', classObject:Resize},
  ]
}


export default settings
