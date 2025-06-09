export interface INF_User {
  id: number;
  name: string;
  role: string;
  team: string;
  status: string;
  age: string;
  avatar: string;
  email: string;
}

export interface INF_Status {
  name: string;
  uid: string;
}

export interface INF_TableColumn {
  name: string;
  uid: string;
  sortable?: boolean;
}
