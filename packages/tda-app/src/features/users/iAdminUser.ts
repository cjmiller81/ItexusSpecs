interface Role {
  key: string;
  value: string;
}

export interface IAdminUser {
  state: number;
  created_at: string;
  credentials: any | null;
  id: string;
  metadata_admin: {
    group: string;
    OryCanAdminUsers?: string;
  };
  metadata_public: {
    IsFifoAdmin?: string;
    IsFifoUser: string;
    role: string;
  };
  organization_id: any | null;
  recovery_addresses: Array<{
    createdAt: string;
    id: string;
    updatedAt: string;
    value: string;
    via: string;
    additionalProperties: Record<string, any>;
  }>;
  schema_id: string;
  schema_url: string;
  state_changed_at: string;
  traits: {
    avatarUrl: string;
    email: string;
    name: {
      first: string;
      last: string;
    };
    newsletter: boolean;
  };
  updated_at: string;
  verifiable_addresses: Array<{
    via: number;
    createdAt: string;
    id: string;
    status: string;
    updatedAt: string;
    value: string;
    verified: boolean;
    verifiedAt: string;
    additionalProperties: Record<string, any>;
  }>;
  additional_properties: Record<string, any>;
  roles: Role[];
}
