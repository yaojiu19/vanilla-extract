import type { PropertiesFallback, AtRule } from 'csstype';

import type { SimplePseudos } from './transformCSS';

type BasicCSSProperties = PropertiesFallback<string | number>;

export interface CSSKeyframes {
  [time: string]: BasicCSSProperties;
}

export type CSSProperties = BasicCSSProperties & {
  vars?: {
    [key: string]: string | number;
  };
  '@keyframes'?: CSSKeyframes | string;
};

type PseudoProperties = { [key in SimplePseudos[number]]?: CSSProperties };

type CSSPropertiesAndPseudos = CSSProperties & PseudoProperties;

interface SelectorMap {
  [selector: string]: CSSProperties;
}

export interface MediaQueries<StyleType> {
  '@media'?: {
    [query: string]: StyleType;
  };
}

export interface FeatureQueries<StyleType> {
  '@supports'?: {
    [query: string]: StyleType;
  };
}

export interface StyleWithSelectors extends CSSPropertiesAndPseudos {
  selectors?: SelectorMap;
}

export type StyleRule = StyleWithSelectors &
  MediaQueries<StyleWithSelectors & FeatureQueries<StyleWithSelectors>> &
  FeatureQueries<StyleWithSelectors & MediaQueries<StyleWithSelectors>>;

export type GlobalStyleRule = CSSProperties &
  MediaQueries<CSSProperties & FeatureQueries<CSSProperties>> &
  FeatureQueries<CSSProperties & MediaQueries<CSSProperties>>;

export type GlobalFontFaceRule = Omit<AtRule.FontFaceFallback, 'src'> &
  Required<Pick<AtRule.FontFaceFallback, 'src'>>;
export type FontFaceRule = Omit<GlobalFontFaceRule, 'fontFamily'>;

export type CSSStyleBlock = {
  type: 'local' | 'global';
  selector: string;
  rule: StyleRule;
};

export type CSSFontFaceBlock = {
  type: 'fontFace';
  rule: GlobalFontFaceRule;
};

export type CSS = CSSStyleBlock | CSSFontFaceBlock;

export interface Adapter {
  appendCss: (css: CSS, fileScope: string) => void;
  registerClassName: (className: string) => void;
  onEndFileScope: (fileScope: string) => void;
}
