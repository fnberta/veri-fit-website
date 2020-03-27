export interface ImmutableJsRecord {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getIn: (path: string[]) => any;
}

export interface PreviewProps {
  entry: ImmutableJsRecord;
  widgetFor: (name: string) => object;
  widgetsFor: (name: string) => ImmutableJsRecord[];
  getAsset: (name: string) => object;
}
