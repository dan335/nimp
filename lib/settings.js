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
import Fade from '../classes/nodes/alpha/Fade.js';
import Opacity from '../classes/nodes/alpha/Opacity.js';
import Min from '../classes/nodes/number/Min.js';
import Max from '../classes/nodes/number/Max.js';
import Sin from '../classes/nodes/number/Sin.js';
import Cos from '../classes/nodes/number/Cos.js';
import Pi from '../classes/nodes/number/Pi.js';
import HSL from '../classes/nodes/adjustment/HSL.js';
import ColorAdjust from '../classes/nodes/color/ColorAdjust.js';
import GetBrightness from '../classes/nodes/color/GetBrightness.js';
import GetLuminance from '../classes/nodes/color/GetLuminance.js';
import GetAlpha from '../classes/nodes/color/GetAlpha.js';
import AnalogousColors from '../classes/nodes/color/AnalogousColors.js';
import TriadColors from '../classes/nodes/color/TriadColors.js';
import TetradColors from '../classes/nodes/color/TetradColors.js';
import ComplimentColor from '../classes/nodes/color/ComplimentColor.js';
import SplitComplimentColors from '../classes/nodes/color/SplitComplimentColors.js';
import MonochromaticColors from '../classes/nodes/color/MonochromaticColors.js';
import ElseNumber from '../classes/nodes/control/ElseNumber.js';
import ElseColor from '../classes/nodes/control/ElseColor.js';
import ChannelSplit from '../classes/nodes/channel/ChannelSplit.js';
import ChannelMerge from '../classes/nodes/channel/ChannelMerge.js';
import Normalize from '../classes/nodes/adjustment/Normalize.js';
import Dither from '../classes/nodes/adjustment/Dither.js';
import Sepia from '../classes/nodes/filter/Sepia.js';
import Posterize from '../classes/nodes/filter/Posterize.js';
import GaussianBlur from '../classes/nodes/adjustment/GaussianBlur.js';
import Pixelate from '../classes/nodes/filter/Pixelate.js';
import SquareRoot from '../classes/nodes/number/SquareRoot.js';
import GetImageSize from '../classes/nodes/number/GetImageSize.js';

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
        {title:'Gaussian Blur', classObject:GaussianBlur, className:'GaussianBlur'},
        {title:'Brightness / Contrast', classObject:BrightnessContrast, className:'BrightnessContrast'},
        {title:'HSL', classObject:HSL, className:'HSL'},
        {title:'Greyscale', classObject:Greyscale, className:'Greyscale'},
        {title:'Invert', classObject:Invert, className:'Invert'},
        {title:'Normalize', classObject:Normalize, className:'Normalize'},
        {title:'Dither', classObject:Dither, className:'Dither'},
      ]
    },
    {
      title: 'Alpha',
      nodes: [
        {title:'Opaque', classObject:Opaque, className:'Opaque'},
        {title:'Mask', classObject:Mask, className:'Mask'},
        {title:'Fade', classObject:Fade, className:'Fade'},
        {title:'Opacity', classObject:Opacity, className:'Opacity'},
      ]
    },
    {
      title: 'Channel',
      nodes: [
        {title:'Channel Split', classObject:ChannelSplit, className:'ChannelSplit'},
        {title:'Channel Merge', classObject:ChannelMerge, className:'ChannelMerge'},
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
      title: 'Filter',
      nodes: [
        {title:'Sepia', classObject:Sepia, className:'Sepia'},
        {title:'Posterize', classObject:Posterize, className:'Posterize'},
        {title:'Pixelate', classObject:Pixelate, className:'Pixelate'},
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
        {title:'Min', classObject:Min, className:'Min'},
        {title:'Max', classObject:Max, className:'Max'},
        {title:'Sine', classObject:Sin, className:'Sin'},
        {title:'Cosine', classObject:Cos, className:'Cos'},
        {title:'Pi', classObject:Pi, className:'Pi'},
        {title:'Square Root', classObject:SquareRoot, className:'SquareRoot'},
        {title:'Random Number', classObject:RandomNumber, className:'RandomNumber'},
        {title:'Get Image Size', classObject:GetImageSize, className:'GetImageSize'},
      ]
    },
    {
      title: 'Color',
      nodes: [
        {title:'Color Input', classObject:ColorInput, className:'ColorInput'},
        {title:'RGB Input', classObject:RGBInput, className:'RGBInput'},
        {title:'HSV Input', classObject:HSVInput, className:'HSVInput'},
        {title:'HSL Input', classObject:HSLInput, className:'HSLInput'},
        {title:'Color Adjust', classObject:ColorAdjust, className:'ColorAdjust'},
        {title:'Sample Pixel', classObject:Sample, className:'Sample'},
        {title:'Get Brightness', classObject:GetBrightness, className:'GetBrightness'},
        {title:'Get Luminance', classObject:GetLuminance, className:'GetLuminance'},
        {title:'Get Alpha', classObject:GetAlpha, className:'GetAlpha'},
        {title:'Analogous Colors', classObject:AnalogousColors, className:'AnalogousColors'},
        {title:'Triad Colors', classObject:TriadColors, className:'TriadColors'},
        {title:'Tetrad Colors', classObject:TetradColors, className:'TetradColors'},
        {title:'Compliment Color', classObject:ComplimentColor, className:'ComplimentColor'},
        {title:'Split Compliment Colors', classObject:SplitComplimentColors, className:'SplitComplimentColors'},
        {title:'Monochromatic Colors', classObject:MonochromaticColors, className:'MonochromaticColors'},
      ]
    },
    {
      title:'Control',
      nodes: [
        {title:'Loop', classObject:Loop, className:'Loop'},
        {title:'If Else', classObject:Else, className:'Else'},
        {title:'Number If Else', classObject:ElseNumber, className:'ElseNumber'},
        {title:'Color If Else', classObject:ElseColor, className:'ElseColor'},
      ]
    }
  ]
}


export default settings
