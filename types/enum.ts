export enum Service {
  Complaint,
  Tracking,
  Inquiry,
}

export enum ComplaintType {
  Sewerage,
  StreetLight,
  Sanitation,
  GarbageCollection,
  CleaningSweeping,
  SewerageOverflow,
  ManholeCoverMissing,
  StreetLightNotWorking,
  WaterLineLeakage,
  WaterSupplySuspended,
  RoadRepair,
  Other,
}

export enum ComplaintStatus {
  Pending,
  InProgress,
  Completed,
  Backlog,
  Archived,
}

export enum Language {
  English,
  Urdu,
}

export enum Block {
  Block13,
  Block17,
  Block18,
}

export enum StaffType {
  Staff,
  Admin,
  SuperAdmin,
}
