export type GeometryDomain = "building" | "road" | "poi" | "crosswalk" | "vehicleLane";

export type GeometryNodeStateBinding = {
  nodeId: string;
  domain: GeometryDomain;
  tags?: string[];
};

export type GeometryLiveMapping = {
  geometryId: string;
  bindings: GeometryNodeStateBinding[];
};
