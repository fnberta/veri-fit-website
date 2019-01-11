import { FixedObject, FluidObject } from 'gatsby-image';

export interface ClassNameProps {
  className?: string;
}

export interface FluidImage {
  fluid: FluidObject;
}

export interface FixedImage {
  fixed: FixedObject;
}

export interface ChildImageSharp<T extends FluidImage | FixedImage> {
  childImageSharp: T;
}

export interface EdgesNode<TNode> {
  edges: Array<{ node: TNode }>;
}
