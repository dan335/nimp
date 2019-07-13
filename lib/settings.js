import UniformColor from '../classes/nodes/inputs/UniformColor.js';
import UrlImage from '../classes/nodes/inputs/UrlImage.js';
import Output from '../classes/nodes/outputs/Output.js';
import Blur from '../classes/nodes/color/Blur.js';
import BrightnessContrast from '../classes/nodes/color/BrightnessContrast.js';
import Greyscale from '../classes/nodes/color/Greyscale.js';
import Blend from '../classes/nodes/composing/Blend.js';
import Resize from '../classes/nodes/transform/Resize.js';
import ImageUpload from '../classes/nodes/inputs/ImageUpload.js';
import Mask from '../classes/nodes/alpha/Mask.js';
import Invert from '../classes/nodes/color/Invert.js';
import Displace from '../classes/nodes/transform/Displace.js';
import Number from '../classes/nodes/number/Number.js';
import AddNumbers from '../classes/nodes/number/AddNumbers.js';
import SubtractNumbers from '../classes/nodes/number/SubtractNumbers.js';
import MultiplyNumbers from '../classes/nodes/number/MultiplyNumbers.js';
import DivideNumbers from '../classes/nodes/number/DivideNumbers.js';
import ModuloNumbers from '../classes/nodes/number/ModuloNumbers.js';
import ExponentNumbers from '../classes/nodes/number/ExponentNumbers.js';
import RandomNumber from '../classes/nodes/number/RandomNumber.js';
import Opaque from '../classes/nodes/alpha/Opaque.js';
import Loop from '../classes/nodes/control/Loop.js';
import AbsoluteValue from '../classes/nodes/number/AbsoluteValue.js';
import Blit from '../classes/nodes/composing/Blit.js';
import Crop from '../classes/nodes/transform/Crop.js';
import Round from '../classes/nodes/number/Round.js';
import Rotate from '../classes/nodes/transform/Rotate.js';
import Simplex from '../classes/nodes/inputs/Simplex.js';
import Floor from '../classes/nodes/number/Floor.js';
import Ceil from '../classes/nodes/number/Ceil.js';
import If from '../classes/nodes/control/If.js';
import Else from '../classes/nodes/control/Else.js';
import Circle from '../classes/nodes/inputs/Circle.js';

const settings = {
  nodeWidth: 140,
  nodeHeight: 34,
  nodeConnectionRadius: 8,
  nodeBackgroundColor: 'hsl(209, 10%, 40%)',
  connectionSpaceBetween: 25,
  nodes: [
    {
      name: 'Image',
      nodes: [
        {name:'Image Upload', classObject:ImageUpload},
        {name:'Image from Url', classObject:UrlImage},
        {name:'Uniform Color', classObject:UniformColor},
        {name:'Circle', classObject:Circle},
        {name:'Simplex Noise', classObject:Simplex},
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
      name: 'Alpha',
      nodes: [
        {name:'Opaque', classObject:Opaque},
        {name:'Mask', classObject:Mask},
      ]
    },
    {
      name: 'Composite',
      nodes: [
        {name:'Blend', classObject:Blend},
        {name:'Blit', classObject:Blit},
      ]
    },
    {
      name: 'Transform',
      nodes: [
        {name:'Resize', classObject:Resize},
        {name:'Crop', classObject:Crop},
        {name:'Displace', classObject:Displace},
        {name:'Rotate', classObject:Rotate},
      ]
    },
    {
      name: 'Number',
      nodes: [
        {name:'Number Input', classObject:Number},
        {name:'Add', classObject:AddNumbers},
        {name:'Subtract', classObject:SubtractNumbers},
        {name:'Multiply', classObject:MultiplyNumbers},
        {name:'Divide', classObject:DivideNumbers},
        {name:'Modulo', classObject:ModuloNumbers},
        {name:'Exponent', classObject:ExponentNumbers},
        {name:'AbsoluteValue', classObject:AbsoluteValue},
        {name:'Round', classObject:Round},
        {name:'Floor', classObject:Floor},
        {name:'Ceil', classObject:Ceil},
        {name:'Random Number', classObject:RandomNumber},
      ]
    },
    {
      name:'Control',
      nodes: [
        {name:'Loop', classObject:Loop},
        {name:'If', classObject:If},
        {name:'If Else', classObject:Else},
      ]
    }
  ]
}


export default settings
