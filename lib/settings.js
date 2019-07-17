import UniformColor from '../classes/nodes/image/UniformColor.js';
import UrlImage from '../classes/nodes/image/UrlImage.js';
import Output from '../classes/nodes/outputs/Output.js';
import Blur from '../classes/nodes/adjustment/Blur.js';
import BrightnessContrast from '../classes/nodes/adjustment/BrightnessContrast.js';
import Greyscale from '../classes/nodes/adjustment/Greyscale.js';
import Blend from '../classes/nodes/composing/Blend.js';
import Resize from '../classes/nodes/transform/Resize.js';
import ImageUpload from '../classes/nodes/image/ImageUpload.js';
import Mask from '../classes/nodes/alpha/Mask.js';
import Invert from '../classes/nodes/adjustment/Invert.js';
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
import Simplex from '../classes/nodes/image/Simplex.js';
import Floor from '../classes/nodes/number/Floor.js';
import Ceil from '../classes/nodes/number/Ceil.js';
import Else from '../classes/nodes/control/Else.js';
import Circle from '../classes/nodes/image/Circle.js';
import RGBInput from '../classes/nodes/color/RGBInput.js';
import HSVInput from '../classes/nodes/color/HSVInput.js';
import ColorInput from '../classes/nodes/color/ColorInput.js';
import HSLInput from '../classes/nodes/color/HSLInput.js';
import FlipVertical from '../classes/nodes/transform/FlipVertical.js';
import FlipHorizontal from '../classes/nodes/transform/FlipHorizontal.js';
import Sample from '../classes/nodes/color/Sample.js';

const settings = {
  nodeWidth: 140,
  nodeHeight: 34,
  nodeConnectionRadius: 8,
  nodeBackgroundColor: 'hsl(209, 10%, 40%)',
  connectionSpaceBetween: 25,
  thumbnailWidth: 150,
  thumbnailHeight: 100,
  nodes: [
    {
      title: 'Image',
      nodes: [
        {title:'Image Upload', classObject:ImageUpload, className:'ImageUpload'},
        {title:'Image from Url', classObject:UrlImage, className:'UrlImage'},
        {title:'Uniform Color', classObject:UniformColor, className:'UniformColor'},
        {title:'Circle', classObject:Circle, className:'Circle'},
        {title:'Simplex Noise', classObject:Simplex, className:'Simplex'},
        {title:'Output', classObject:Output, className:'Output'},
      ]
    },
    {
      title: 'Adjustment',
      nodes: [
        {title:'Blur', classObject:Blur, className:'Blur'},
        {title:'Brightness/Contrast', classObject:BrightnessContrast, className:'BrightnessContrast'},
        {title:'Greyscale', classObject:Greyscale, className:'Greyscale'},
        {title:'Invert', classObject:Invert, className:'Invert'},
      ]
    },
    {
      title: 'Alpha',
      nodes: [
        {title:'Opaque', classObject:Opaque, className:'Opaque'},
        {title:'Mask', classObject:Mask, className:'Mask'},
      ]
    },
    {
      title: 'Composite',
      nodes: [
        {title:'Blend', classObject:Blend, className:'Blend'},
        {title:'Blit', classObject:Blit, className:'Blit'},
      ]
    },
    {
      title: 'Transform',
      nodes: [
        {title:'Resize', classObject:Resize, className:'Resize'},
        {title:'Crop', classObject:Crop, className:'Crop'},
        {title:'Displace', classObject:Displace, className:'Displace'},
        {title:'Rotate', classObject:Rotate, className:'Rotate'},
        {title:'Flip Horizontally', classObject:FlipHorizontal, className:'FlipHorizontal'},
        {title:'Flip Vertically', classObject:FlipVertical, className:'FlipVertical'},
      ]
    },
    {
      title: 'Number',
      nodes: [
        {title:'Number Input', classObject:Number, className:'Number'},
        {title:'Add', classObject:AddNumbers, className:'AddNumbers'},
        {title:'Subtract', classObject:SubtractNumbers, className:'SubtractNumbers'},
        {title:'Multiply', classObject:MultiplyNumbers, className:'MultiplyNumbers'},
        {title:'Divide', classObject:DivideNumbers, className:'DivideNumbers'},
        {title:'Mod', classObject:ModuloNumbers, className:'ModuloNumbers'},
        {title:'Exponent', classObject:ExponentNumbers, className:'ExponentNumbers'},
        {title:'Absolute Value', classObject:AbsoluteValue, className:'AbsoluteValue'},
        {title:'Round', classObject:Round, className:'Round'},
        {title:'Floor', classObject:Floor, className:'Floor'},
        {title:'Ceil', classObject:Ceil, className:'Ceil'},
        {title:'Random Number', classObject:RandomNumber, className:'RandomNumber'},
      ]
    },
    {
      title: 'Color',
      nodes: [
        {title:'Color Input', classObject:ColorInput, className:'ColorInput'},
        {title:'RGB Input', classObject:RGBInput, className:'RGBInput'},
        {title:'HSV Input', classObject:HSVInput, className:'HSVInput'},
        {title:'HSL Input', classObject:HSLInput, className:'HSLInput'},
        {title:'Sample Pixel', classObject:Sample, className:'Sample'},
      ]
    },
    {
      title:'Control',
      nodes: [
        {title:'Loop', classObject:Loop, className:'Loop'},
        {title:'If Else', classObject:Else, className:'Else'},
      ]
    }
  ]
}


export default settings
