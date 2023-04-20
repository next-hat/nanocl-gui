export type NodeRam = {
  Free: number
  Total: number
  Used: number
}

export type NodeCpu = {
  Brand: string
  Frequency: number
  Name: string
  Usage: number
  VendorId: string
}

export type NodeDisk = {
  AvailableSpace: number
  DeviceName: string
  MountPoint: string
  TotalSpace: number
  Type: string | { UNKNOWN: number }
}

export type Node = {
  NodeName: string
  IpAddress: string
  Ram: NodeRam
  Cpu: NodeCpu
  Disk: NodeDisk
}

export type NamespaceRow = {
  Cargoes: number
  Gateway: string
  Instances: number
  Name: string
}
