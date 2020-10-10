export interface ImmutableJsRecord {
  getIn: (path: string[]) => unknown;
}

export interface PreviewProps {
  entry: ImmutableJsRecord;
  widgetFor: (name: string) => Record<string, unknown>;
  widgetsFor: (name: string) => ImmutableJsRecord[];
  getAsset: (name: string) => Record<string, unknown>;
}
