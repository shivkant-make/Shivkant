
export enum RecordType {
  INWARD = 'INWARD',
  OUTWARD = 'OUTWARD'
}

export interface InventoryRecord {
  id: string;
  type: RecordType;
  date: string;
  time: string;
  entityName: string; // Supplier for Inward, Customer for Outward
  itemDescription: string;
  quantity: number;
  unit: string;
  vehicleNumber: string;
  documentNumber: string; // Gate Pass or Invoice No
  remarks: string;
  imageUrl?: string;
  status: 'PENDING' | 'COMPLETED' | 'REJECTED';
}

export interface Stats {
  totalInward: number;
  totalOutward: number;
  pendingChecks: number;
}
